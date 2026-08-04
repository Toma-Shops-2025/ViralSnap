import { createClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/integrations/supabase/types";

export type PublicProfileData = {
  profile: Tables<"profiles">;
  followers: number;
  following: number;
  videos: Tables<"videos">[];
};

// Server publishable (anon) client — public, RLS-scoped reads only. No session.
function createPublicClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase public client env vars");
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// SSR-friendly public profile fetch so per-user pages (the URLs we hand to
// Stripe Connect) return crawlable HTML with the creator's name and bio.
export const getPublicProfile = 
  .inputValidator((data: { username: string }) => data)
  .handler(async ({ data }): Promise<PublicProfileData | null> => {
    const supabase = createPublicClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", data.username)
      .maybeSingle();
    if (!profile) return null;

    const [{ count: followers }, { count: following }, { data: videos }] =
      await Promise.all([
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", profile.id),
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", profile.id),
        supabase
          .from("videos")
          .select("*")
          .eq("creator_id", profile.id)
          .eq("status", "published")
          .order("created_at", { ascending: false }),
      ]);

    return {
      profile,
      followers: followers ?? 0,
      following: following ?? 0,
      videos: (videos ?? []) as Tables<"videos">[],
    };
  });
