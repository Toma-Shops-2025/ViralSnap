import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Play, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [q, setQ] = useState("");
  const { data } = useQuery({ queryKey: ["trending"], queryFn: fetchTrending });

  const videos = (data?.videos ?? []).filter((v) => {
    if (!q) return true;
    const p = data?.profiles.get(v.creator_id);
    const hay = `${v.caption} ${v.title} ${(v.tags ?? []).join(" ")} ${p?.username ?? ""}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="sticky top-0 z-30 space-y-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <h1 className="font-display text-2xl font-bold">Discover</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search videos, creators, #tags"
            className="rounded-full bg-card pl-9"
          />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-1 py-2">
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
