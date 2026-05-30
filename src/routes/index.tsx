import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Flame, Sparkles } from "lucide-react";
import { fetchFeed } from "@/lib/feed";
import { VideoCard } from "@/components/video-card";
import { BottomNav } from "@/components/bottom-nav";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ViralSnap — Creators Deserve More" },
      {
        name: "description",
        content:
          "Scroll the ViralSnap feed: short videos from creators who earn real money with ViralCoins and sell products in-feed.",
      },
      { property: "og:title", content: "ViralSnap — Creators Deserve More" },
      {
        property: "og:description",
        content: "The short-video platform that pays creators what they're worth.",
      },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  const [muted, setMuted] = useState(true);
  const { data: videos, isLoading } = useQuery({
    queryKey: ["feed"],
    queryFn: fetchFeed,
  });

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      {/* top brand bar */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-center px-4 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <div className="flex items-center gap-1.5">
          <Flame className="h-5 w-5 text-primary drop-shadow" />
          <span className="font-display text-lg font-bold tracking-tight text-white drop-shadow">
            Viral<span className="text-gradient-fire">Snap</span>
          </span>
        </div>
      </header>

      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Skeleton className="h-full w-full bg-secondary/40" />
        </div>
      ) : videos && videos.length > 0 ? (
        <div className="h-full snap-y-mandatory overflow-y-scroll no-scrollbar">
          {videos.map((v) => (
            <VideoCard
              key={v.id}
              video={v}
              muted={muted}
              onToggleMute={() => setMuted((m) => !m)}
            />
          ))}
        </div>
      ) : (
        <EmptyFeed />
      )}

      <BottomNav />
    </div>
  );
}

function EmptyFeed() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-fire shadow-glow">
        <Sparkles className="h-10 w-10 text-primary-foreground" />
      </div>
      <h1 className="mt-6 font-display text-2xl font-bold text-white">
        The feed is warming up
      </h1>
      <p className="mt-2 max-w-xs text-sm text-white/70">
        No videos yet. Be the first creator to drop something viral.
      </p>
      <Link
        to="/upload"
        className="mt-6 rounded-full bg-gradient-fire px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        Upload a video
      </Link>
    </div>
  );
}
