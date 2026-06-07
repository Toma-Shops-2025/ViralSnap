import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type VideoRow = Tables<"videos">;
export type ProfileRow = Tables<"profiles">;

export type FeedVideo = VideoRow & {
  creator: Pick<ProfileRow, "id" | "username" | "display_name" | "avatar_url"> | null;
  liked: boolean;
};

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

export async function fetchFeed(): Promise<FeedVideo[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) throw error;
  return attachCreatorsAndLikes(data ?? []);
}

export async function fetchFollowingFeed(): Promise<FeedVideo[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];

  const { data: follows } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", auth.user.id);

  const ids = (follows ?? []).map((f) => f.following_id);
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("status", "published")
    .in("creator_id", ids)
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) throw error;
  return attachCreatorsAndLikes(data ?? []);
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

