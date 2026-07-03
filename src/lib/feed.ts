import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type VideoRow = Tables<"videos"> & {
  mux_asset_id?: string | null;
  mux_asset_status?: string | null;
  mux_playback_id?: string | null;
};
export type ProfileRow = Tables<"profiles">;

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

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", creatorIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

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

  return videos.map((v) => ({
    ...v,
    creator: profileMap.get(v.creator_id) ?? null,
    liked: likedSet.has(v.id),
  }));
}

// Full-library shuffle state (per browser session).
// We shuffle the ENTIRE set of published video IDs once, then page through that
// shuffled order. This guarantees every video in the library is served before
// any repeat — not just the most recent batch.
let feedOrder: string[] = [];

async function buildFeedOrder(): Promise<string[]> {
  const ids: string[] = [];
  const CHUNK = 1000;
  for (let from = 0; ; from += CHUNK) {
    const { data, error } = await supabase
      .from("videos")
      .select("id")
      .eq("status", "published")
      .range(from, from + CHUNK - 1);
    if (error) throw error;
    const batch = (data ?? []).map((r) => r.id as string);
    ids.push(...batch);
    if (batch.length < CHUNK) break;
  }
  return shuffle(ids);
}

export async function fetchFeedPage(page = 0): Promise<FeedPage> {
  // Rebuild the shuffled order at the start of every feed session (page 0),
  // e.g. on first load, tab switch, or refetch. This gives a fresh order each
  // time while still covering the whole library within a session.
  if (page === 0 || feedOrder.length === 0) {
    feedOrder = await buildFeedOrder();
  }

  const total = feedOrder.length;
  if (total === 0) return { items: [], hasMore: false, page };

  // Slice the shuffled order for this page, wrapping around the end so the feed
  // is endless. Because we wrap over the FULL shuffled list, all videos play in
  // shuffled order before any repeat.
  const start = (page * FEED_PAGE_SIZE) % total;
  const pageIds: string[] = [];
  for (let i = 0; i < FEED_PAGE_SIZE; i++) {
    pageIds.push(feedOrder[(start + i) % total]);
  }

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .in("id", pageIds);
  if (error) throw error;

  // Preserve the shuffled order (the `.in()` query returns rows in arbitrary order).
  const rowMap = new Map((data ?? []).map((v) => [v.id, v as VideoRow]));
  const rows = pageIds
    .map((id) => rowMap.get(id))
    .filter((v): v is VideoRow => Boolean(v));

  return {
    items: await attachCreatorsAndLikes(rows),
    hasMore: true,
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
  return {
    items: shuffle(await attachCreatorsAndLikes((data ?? []) as VideoRow[])),
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

