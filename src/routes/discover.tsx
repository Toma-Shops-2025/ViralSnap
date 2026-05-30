import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, Play, Heart, Radio, Briefcase } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { supabase } from "@/integrations/supabase/client";
import { compact } from "@/lib/format";
import type { Tables } from "@/integrations/supabase/types";


export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — ViralSnap" },
      { name: "description", content: "Discover trending creators and viral videos on ViralSnap." },
    ],
  }),
  component: DiscoverPage,
});

type Vid = Tables<"videos">;

async function fetchTrending() {
  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(60);
  const creatorIds = [...new Set((videos ?? []).map((v) => v.creator_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", creatorIds.length ? creatorIds : ["00000000-0000-0000-0000-000000000000"]);
  return {
    videos: (videos ?? []) as Vid[],
    profiles: new Map((profiles ?? []).map((p) => [p.id, p])),
  };
}

function DiscoverPage() {
  const { data } = useQuery({ queryKey: ["trending"], queryFn: fetchTrending });

  const videos = data?.videos ?? [];


  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="sticky top-0 z-30 space-y-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <h1 className="font-display text-2xl font-bold">Discover</h1>
        <Link
          to="/search"
          className="flex items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          Search videos, creators, #tags
        </Link>
      </header>


      <div className="mx-auto max-w-2xl px-1 py-2">
        <div className="mb-3 grid grid-cols-2 gap-2 px-1">
          <Link
            to="/live"
            className="flex items-center gap-2 rounded-2xl bg-gradient-ember p-3 shadow-glow"
          >
            <Radio className="h-5 w-5 text-white" />
            <div>
              <p className="text-sm font-bold text-white">Live now</p>
              <p className="text-[11px] text-white/80">Watch & gift</p>
            </div>
          </Link>
          <Link
            to="/campaigns"
            className="flex items-center gap-2 rounded-2xl border border-gold/40 bg-card p-3"
          >
            <Briefcase className="h-5 w-5 text-gold" />
            <div>
              <p className="text-sm font-bold">Campaigns</p>
              <p className="text-[11px] text-muted-foreground">Get paid</p>
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {videos.map((v) => {
            const p = data?.profiles.get(v.creator_id);
            return (
              <Link
                key={v.id}
                to="/u/$username"
                params={{ username: p?.username ?? "" }}
                className="group relative aspect-[9/14] overflow-hidden rounded-lg bg-card"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5">
                  <p className="truncate text-[11px] font-medium text-white">
                    @{p?.username ?? "creator"}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-white/80">
                    <span className="flex items-center gap-0.5">
                      <Play className="h-2.5 w-2.5 fill-white" /> {compact(v.view_count)}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Heart className="h-2.5 w-2.5 fill-white" /> {compact(v.like_count)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {videos.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Nothing here yet. Check back soon.
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
