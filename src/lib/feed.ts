import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { isPlayableFeedVideo } from "@/lib/video";

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

/** Fisher–Yates shuffle (returns a new array, does not mutate input). */
export function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
    .filter((v) => profileMap.has(v.creator_id))
    .map((v) => ({
      ...v,
      creator: profileMap.get(v.creator_id) ?? null,
      liked: likedSet.has(v.id),
    }));
}

export async function fetchFeedPage(page = 0, seed = 0): Promise<FeedPage> {
  const { count } = await supabase
    .from("videos")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  const total = count ?? 0;
  if (total === 0) return { items: [], hasMore: false, page };

  // Calculate a random starting point based on the seed
  const seedOffset = (seed % Math.max(1, total - FEED_PAGE_SIZE));
  const effectiveOffset = (seedOffset + (page * FEED_PAGE_SIZE)) % Math.max(1, total);

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("status", "published")
    .range(effectiveOffset, effectiveOffset + FEED_PAGE_SIZE - 1);

  if (error) throw error;

  let rows = ((data ?? []) as VideoRow[]).filter(isPlayableFeedVideo);

  // Shuffle the items locally for extra randomness
  return {
    items: shuffle(await attachCreatorsAndLikes(rows)),
    hasMore: total > (page + 1) * FEED_PAGE_SIZE,
    page,
  };
}

export async function fetchFollowingFeedPage(page = 0): Promise<FeedPage> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { items: [], hasMore: false, page };

  const { data: follows } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", auth.user.id);

  const ids = (follows ?? []).map((f) => f.following_id);
  if (ids.length === 0) return { items: [], hasMore: false, page };

  const from = page * FEED_PAGE_SIZE;
  const to = from + FEED_PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("status", "published")
    .in("creator_id", ids)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw error;
  const rows = ((data ?? []) as VideoRow[]).filter(isPlayableFeedVideo);
  return {
    items: shuffle(await attachCreatorsAndLikes(rows)),
    hasMore: (data ?? []).length === FEED_PAGE_SIZE,
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
  return attachCreatorsAndLikes(data ?? []);
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

