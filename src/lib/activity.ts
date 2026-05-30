import { supabase } from "@/integrations/supabase/client";

export type ActivityKind = "follow" | "like" | "comment" | "gift";

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  created_at: string;
  actor: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
  videoId?: string;
  coverUrl?: string | null;
  text?: string;
  coinAmount?: number;
};

type MiniProfile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
};

/**
 * Aggregates recent inbound activity for the signed-in creator:
 * new followers, likes & comments on their videos, and gifts received.
 */
export async function fetchActivity(): Promise<ActivityItem[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  const me = auth.user.id;

  // The creator's own videos (used to scope likes & comments)
  const { data: myVideos } = await supabase
    .from("videos")
    .select("id, cover_url")
    .eq("creator_id", me);
  const myVideoIds = (myVideos ?? []).map((v) => v.id);
  const coverMap = new Map((myVideos ?? []).map((v) => [v.id, v.cover_url]));
  const safeIds = myVideoIds.length ? myVideoIds : ["00000000-0000-0000-0000-000000000000"];

  const [followsRes, likesRes, commentsRes, giftsRes] = await Promise.all([
    supabase
      .from("follows")
      .select("id, follower_id, created_at")
      .eq("following_id", me)
      .order("created_at", { ascending: false })
      .limit(40),
    supabase
      .from("likes")
      .select("id, user_id, video_id, created_at")
      .in("video_id", safeIds)
      .neq("user_id", me)
      .order("created_at", { ascending: false })
      .limit(40),
    supabase
      .from("comments")
      .select("id, user_id, video_id, text, created_at")
      .in("video_id", safeIds)
      .neq("user_id", me)
      .order("created_at", { ascending: false })
      .limit(40),
    supabase
      .from("gifts")
      .select("id, sender_id, video_id, coin_amount, created_at")
      .eq("receiver_id", me)
      .order("created_at", { ascending: false })
      .limit(40),
  ]);

  const follows = followsRes.data ?? [];
  const likes = likesRes.data ?? [];
  const comments = commentsRes.data ?? [];
  const gifts = giftsRes.data ?? [];

  const actorIds = [
    ...follows.map((f) => f.follower_id),
    ...likes.map((l) => l.user_id),
    ...comments.map((c) => c.user_id),
    ...gifts.map((g) => g.sender_id),
  ];
  const uniqueActorIds = [...new Set(actorIds)];

  let profileMap = new Map<string, MiniProfile>();
  if (uniqueActorIds.length) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .in("id", uniqueActorIds);
    profileMap = new Map((profs ?? []).map((p) => [p.id, p as MiniProfile]));
  }

  const items: ActivityItem[] = [
    ...follows.map((f) => ({
      id: `follow-${f.id}`,
      kind: "follow" as const,
      created_at: f.created_at,
      actor: profileMap.get(f.follower_id) ?? null,
    })),
    ...likes.map((l) => ({
      id: `like-${l.id}`,
      kind: "like" as const,
      created_at: l.created_at,
      actor: profileMap.get(l.user_id) ?? null,
      videoId: l.video_id,
      coverUrl: coverMap.get(l.video_id) ?? null,
    })),
    ...comments.map((c) => ({
      id: `comment-${c.id}`,
      kind: "comment" as const,
      created_at: c.created_at,
      actor: profileMap.get(c.user_id) ?? null,
      videoId: c.video_id,
      coverUrl: coverMap.get(c.video_id) ?? null,
      text: c.text,
    })),
    ...gifts.map((g) => ({
      id: `gift-${g.id}`,
      kind: "gift" as const,
      created_at: g.created_at,
      actor: profileMap.get(g.sender_id) ?? null,
      videoId: g.video_id ?? undefined,
      coverUrl: g.video_id ? coverMap.get(g.video_id) ?? null : null,
      coinAmount: g.coin_amount,
    })),
  ];

  items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return items.slice(0, 60);
}
