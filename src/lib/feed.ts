import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { isPlayableFeedVideo } from "@/lib/video";
import { shuffleWithSeed, sliceShuffledPage } from "@/lib/shuffle";

export type VideoRow = Tables<"videos"> & {
  mux_asset_id?: string | null;
  mux_asset_status?: string | null;
  mux_playback_id?: string | null;
};
export type ProfileRow = Tables<"profiles"> & {
  is_banned?: boolean;
};

export type FeedVideo = VideoRow & {
  creator: Pick<ProfileRow, "id" | "username" | "display_name" | "avatar_url"> | null;
  liked: boolean;
};

export type FeedPage = {
  items: FeedVideo[];
  hasMore: boolean;
  page: number;
};

const FEED_PAGE_SIZE = 12;
const BATCH = 500;

/** Cached published libraries (unshuffled); order is applied per lap via session seed. */
const forYouLibraryCache = new Map<number, VideoRow[]>();
const followingLibraryCache = new Map<string, VideoRow[]>();

async function fetchAllPublishedVideos(): Promise<VideoRow[]> {
  const rows: VideoRow[] = [];
  for (let from = 0; ; from += BATCH) {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range(from, from + BATCH - 1);
    if (error) throw error;
    const batch = (data ?? []) as VideoRow[];
    rows.push(...batch);
    if (batch.length < BATCH) break;
  }
  return rows.filter(isPlayableFeedVideo);
}

async function getForYouLibrary(): Promise<VideoRow[]> {
  const hit = forYouLibraryCache.get(0);
  if (hit) return hit;
  const library = await fetchAllPublishedVideos();
  forYouLibraryCache.set(0, library);
  return library;
}

async function attachCreatorsAndLikes(videos: VideoRow[]): Promise<FeedVideo[]> {
  if (videos.length === 0) return [];
  const creatorIds = [...new Set(videos.map((v) => v.creator_id))];
  const videoIds = videos.map((v) => v.id);

  let profiles:
    | Array<{
        id: string;
        username: string;
        display_name: string;
        avatar_url: string | null;
        is_banned?: boolean | null;
      }>
    | null = null;

  const withBan = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, is_banned")
    .in("id", creatorIds);

  if (withBan.error && /is_banned/i.test(withBan.error.message)) {
    const fallback = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .in("id", creatorIds);
    profiles = fallback.data;
  } else {
    profiles = withBan.data;
  }

  const profileMap = new Map(
    (profiles ?? []).filter((p) => !p.is_banned).map((p) => [p.id, p]),
  );

  let likedSet = new Set<string>();
  const { data: auth } = await supabase.auth.getUser();
  if (auth.user) {
    const { data: likes } = await supabase
      .from("likes")
      .select("video_id")
      .eq("user_id", auth.user.id)
      .in("video_id", videoIds);
    likedSet = new Set((likes ?? []).map((l) => l.video_id));
  }

  return videos
    .filter((v) => {
      const profile = profileMap.get(v.creator_id);
      return profile ? !profile.is_banned : true;
    })
    .map((v) => ({
      ...v,
      creator:
        profileMap.get(v.creator_id) ??
        ({
          id: v.creator_id,
          username: "user",
          display_name: "Creator",
          avatar_url: null,
        } as FeedVideo["creator"]),
      liked: likedSet.has(v.id),
    }));
}

/** For You: shuffle per lap; each full pass through the library gets a new order. */
export async function fetchFeedPage(page = 0, seed = 0): Promise<FeedPage> {
  const library = await getForYouLibrary();
  if (library.length === 0) {
    return { items: [], hasMore: false, page };
  }
  const { slice } = sliceShuffledPage(library, seed, page, FEED_PAGE_SIZE);
  return {
    items: await attachCreatorsAndLikes(slice),
    hasMore: true,
    page,
  };
}

/** Following: shuffle per lap for that creator set. */
export async function fetchFollowingFeedPage(page = 0, seed = 0): Promise<FeedPage> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { items: [], hasMore: false, page };

  const cacheKey = auth.user.id;
  let library = followingLibraryCache.get(cacheKey);

  if (!library) {
    const { data: follows } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", auth.user.id);

    const ids = (follows ?? []).map((f) => f.following_id);
    if (ids.length === 0) return { items: [], hasMore: false, page };

    const rows: VideoRow[] = [];
    for (let from = 0; ; from += BATCH) {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("status", "published")
        .in("creator_id", ids)
        .order("created_at", { ascending: false })
        .range(from, from + BATCH - 1);
      if (error) throw error;
      const batch = (data ?? []) as VideoRow[];
      rows.push(...batch);
      if (batch.length < BATCH) break;
    }

    library = rows.filter(isPlayableFeedVideo);
    followingLibraryCache.set(cacheKey, library);
  }

  if (library.length === 0) {
    return { items: [], hasMore: false, page };
  }

  const { slice } = sliceShuffledPage(library, seed, page, FEED_PAGE_SIZE);
  return {
    items: await attachCreatorsAndLikes(slice),
    hasMore: true,
    page,
  };
}

export async function fetchCreatorVideos(creatorId: string): Promise<FeedVideo[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("creator_id", creatorId)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return attachCreatorsAndLikes(((data ?? []) as VideoRow[]).filter(isPlayableFeedVideo));
}

export async function toggleLike(videoId: string, liked: boolean) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("not authed");
  if (liked) {
    await supabase.from("likes").delete().eq("video_id", videoId).eq("user_id", auth.user.id);
  } else {
    await supabase.from("likes").insert({ video_id: videoId, user_id: auth.user.id });
  }
}
