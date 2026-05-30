import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type EarningsVideo = Tables<"videos">;

export type EarningsSummary = {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalProductClicks: number;
  videoCount: number;
  giftCoins: number;
  giftCount: number;
  totalEarned: number;
  topVideos: EarningsVideo[];
};

/**
 * Computes a creator earnings + performance summary for the signed-in user.
 */
export async function fetchEarnings(): Promise<EarningsSummary | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const me = auth.user.id;

  const [{ data: videos }, { data: profile }, giftsRes] = await Promise.all([
    supabase
      .from("videos")
      .select("*")
      .eq("creator_id", me)
      .order("view_count", { ascending: false }),
    supabase.from("profiles").select("total_earned").eq("id", me).maybeSingle(),
    supabase
      .from("gifts")
      .select("coin_amount")
      .eq("receiver_id", me),
  ]);

  const vids = (videos ?? []) as EarningsVideo[];
  const gifts = giftsRes.data ?? [];

  return {
    totalViews: vids.reduce((s, v) => s + (v.view_count ?? 0), 0),
    totalLikes: vids.reduce((s, v) => s + (v.like_count ?? 0), 0),
    totalComments: vids.reduce((s, v) => s + (v.comment_count ?? 0), 0),
    totalProductClicks: vids.reduce((s, v) => s + (v.product_clicks ?? 0), 0),
    videoCount: vids.length,
    giftCoins: gifts.reduce((s, g) => s + (g.coin_amount ?? 0), 0),
    giftCount: gifts.length,
    totalEarned: profile?.total_earned ?? 0,
    topVideos: vids.slice(0, 5),
  };
}
