import { createFileRoute, useParams, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Play, Heart, Settings, LogOut, Gift, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";
import { GiftDialog } from "@/components/gift-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { compact } from "@/lib/format";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/u/$username")({
  head: () => ({ meta: [{ title: "Profile — ViralSnap" }] }),
  component: ProfilePage,
});

type Vid = Tables<"videos">;

async function fetchProfileData(username: string, viewerId?: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (!profile) return null;

  const [{ count: followers }, { count: following }, { data: videos }, followRow] =
    await Promise.all([
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", profile.id),
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", profile.id),
      supabase
        .from("videos")
        .select("*")
        .eq("creator_id", profile.id)
        .eq("status", "published")
        .order("created_at", { ascending: false }),
      viewerId
        ? supabase
            .from("follows")
            .select("id")
            .eq("follower_id", viewerId)
            .eq("following_id", profile.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  return {
    profile,
    followers: followers ?? 0,
    following: following ?? 0,
    videos: (videos ?? []) as Vid[],
    isFollowing: !!followRow.data,
  };
}

function ProfilePage() {
  const { username } = useParams({ from: "/u/$username" });
  const { user, profile: myProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showGift, setShowGift] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["profile", username, user?.id],
    queryFn: () => fetchProfileData(username, user?.id),
  });

  const isMe = myProfile?.username === username;

  const handleFollow = async () => {
    if (!user) return navigate({ to: "/auth" });
    if (!data) return;
    if (data.isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", data.profile.id);
    } else {
      await supabase.from("follows").insert({
        follower_id: user.id,
        following_id: data.profile.id,
      });
    }
    queryClient.invalidateQueries({ queryKey: ["profile", username] });
  };

  if (isLoading) {
    return <div className="flex min-h-[100dvh] items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!data) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 px-6 text-center">
        <Flame className="h-10 w-10 text-primary" />
        <p className="font-display text-lg font-bold">Creator not found</p>
        <Link to="/" className="text-sm text-primary">Back to feed</Link>
        <BottomNav />
      </div>
    );
  }

  const { profile, followers, following, videos, isFollowing } = data;

  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="px-4 pt-[calc(1.25rem+env(safe-area-inset-top))]">
        <div className="flex items-start justify-between">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="h-20 w-20 rounded-full border-2 border-primary object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-fire text-2xl font-bold text-primary-foreground">
              {profile.display_name.charAt(0).toUpperCase()}
            </div>
          )}
          {isMe && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate({ to: "/settings" })}
                className="rounded-full border-border bg-card"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={async () => {
                  await signOut();
                  toast.success("Signed out");
                  navigate({ to: "/" });
                }}
                className="rounded-full border-border bg-card"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <h1 className="mt-3 font-display text-xl font-bold">{profile.display_name}</h1>
        <p className="text-sm text-muted-foreground">@{profile.username}</p>
        {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}

        <div className="mt-4 flex gap-6">
          <Stat label="Followers" value={followers} />
          <Stat label="Following" value={following} />
          <Stat label="Earned" value={profile.total_earned} gold />
        </div>

        <div className="mt-4 flex gap-2">
          {isMe ? (
            <Link
              to="/upload"
              className="flex-1 rounded-full bg-gradient-fire py-2 text-center text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Upload video
            </Link>
          ) : (
            <>
              <Button
                onClick={handleFollow}
                className={`flex-1 rounded-full ${
                  isFollowing
                    ? "bg-secondary text-foreground hover:bg-secondary/80"
                    : "bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button
                onClick={() => setShowGift(true)}
                variant="outline"
                className="rounded-full border-gold/50 bg-card text-gold"
              >
                <Gift className="h-4 w-4" /> Gift
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="mx-auto mt-6 max-w-2xl px-1">
        <div className="grid grid-cols-3 gap-1">
          {videos.map((v) => (
            <div
              key={v.id}
              className="relative aspect-[9/14] overflow-hidden rounded-lg bg-card"
            >
              {v.cover_url ? (
                <img src={v.cover_url} alt={v.title} className="h-full w-full object-cover" />
              ) : (
                <video
                  src={v.media_url}
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-2 text-[10px] text-white/90">
                <span className="flex items-center gap-0.5">
                  <Play className="h-2.5 w-2.5 fill-white" /> {compact(v.view_count)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Heart className="h-2.5 w-2.5 fill-white" /> {compact(v.like_count)}
                </span>
              </div>
            </div>
          ))}
        </div>
        {videos.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">No videos yet.</p>
        )}
      </div>

      {showGift && (
        <GiftDialog
          open={showGift}
          onOpenChange={setShowGift}
          receiverId={profile.id}
          receiverName={profile.username}
        />
      )}
      <BottomNav />
    </div>
  );
}

function Stat({ label, value, gold }: { label: string; value: number; gold?: boolean }) {
  return (
    <div>
      <p className={`font-display text-lg font-bold ${gold ? "text-gold" : ""}`}>
        {compact(value)}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
