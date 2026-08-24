import { createFileRoute, Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useRef } from "react";
import { Flame, Sparkles, Radio, Bell, Volume2, VolumeX } from "lucide-react";
import { fetchFeedPage, fetchFollowingFeedPage } from "@/lib/feed";
import { newSessionSeed } from "@/lib/shuffle";
import { VideoCard } from "@/components/video-card";
import { BottomNav } from "@/components/bottom-nav";
import { OnboardingWalkthrough } from "@/components/onboarding-walkthrough";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { getBlockedCreatorIds } from "@/lib/blocked-creators";

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

type Tab = "foryou" | "following";

function FeedPage() {
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [tab, setTab] = useState<Tab>("foryou");
  const { user } = useAuth();

  const unmuteFeed = () => {
    setMuted(false);
    setVolume(1);
  };

  const toggleMute = () => {
    if (muted) unmuteFeed();
    else setMuted(true);
  };

  const setFeedVolume = (v: number) => {
    setVolume(v);
    if (v > 0) {
      setMuted(false);
    } else {
      setMuted(true);
    }
  };

  // New seed every app open → full-library shuffle starts on a different video.
  const [sessionSeed] = useState(() => newSessionSeed());

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["feed", tab, user?.id, sessionSeed],
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        tab === "following"
          ? fetchFollowingFeedPage(pageParam, sessionSeed)
          : fetchFeedPage(pageParam, sessionSeed),
      getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    });

  const sentinelRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);


  const [blockedTick, setBlockedTick] = useState(0);
  useEffect(() => {
    setBlockedTick((t) => t + 1);
    const onFocus = () => setBlockedTick((t) => t + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const items = useMemo(() => {
    const blocked = new Set(getBlockedCreatorIds());
    const pages = data?.pages ?? [];
    const out: { video: (typeof pages)[0]["items"][0]; key: string }[] = [];
    for (const page of pages) {
      for (const video of page.items) {
        if (blocked.has(video.creator_id)) continue;
        // Unique key per occurrence so wrap-around can re-show the same video.
        out.push({ video, key: `${video.id}-${out.length}` });
      }
    }
    return out;
  }, [data, blockedTick]);

  useEffect(() => {
    const root = feedRef.current;
    if (!root || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      { root, threshold: [0.6] },
    );

    root.querySelectorAll<HTMLElement>("[data-feed-item]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || items.length === 0 || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "0px 0px 200% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length, hasNextPage, isFetchingNextPage, fetchNextPage]);



  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      {/* top brand bar */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-4 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <div className="pointer-events-auto flex w-16 flex-col items-center gap-2">
          <Link
            to="/activity"
            className="flex items-center justify-center text-white drop-shadow"
            aria-label="Activity"
          >
            <Bell className="h-5 w-5" />
          </Link>
          <button
            type="button"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={toggleMute}
            className="grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur"
          >
            {muted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-24 w-9 flex-col items-center justify-center rounded-full bg-black/40 px-1 py-2 backdrop-blur"
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => {
                const v = Number.parseFloat(e.target.value);
                setFeedVolume(v);
              }}
              aria-label="Volume"
              className="volume-slider h-20 w-1 cursor-pointer appearance-none rounded-full bg-white/25 [writing-mode:vertical-lr] [direction:rtl]"
            />
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-4 pt-0.5">
          <TabButton active={tab === "following"} onClick={() => setTab("following")}>
            Following
          </TabButton>
          <span className="h-4 w-px bg-white/30" />
          <TabButton active={tab === "foryou"} onClick={() => setTab("foryou")}>
            For You
          </TabButton>
        </div>

        <Link
          to="/live"
          className="pointer-events-auto flex w-16 items-center justify-end gap-1 pt-0.5 text-xs font-bold uppercase text-white drop-shadow"
        >
          <Radio className="h-4 w-4 text-primary" /> Live
        </Link>
      </header>

      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Skeleton className="h-full w-full bg-secondary/40" />
        </div>
      ) : items.length > 0 ? (
        <div ref={feedRef} className="h-full snap-y snap-mandatory overflow-y-scroll no-scrollbar">
          {items.map(({ video, key }, idx) => (
            <div key={key} data-feed-item data-idx={idx}>
              <VideoCard
                video={video}
                isActive={idx === activeIndex}
                isMuted={muted}
                volume={volume}
                onToggleMute={toggleMute}
              />
            </div>
          ))}
          <div ref={sentinelRef} className="h-px w-full" aria-hidden />
          {isFetchingNextPage && <div className="h-20 w-full bg-black" aria-hidden />}
        </div>
      ) : tab === "following" ? (
        <EmptyFollowing signedIn={!!user} />
      ) : (
        <EmptyFeed />
      )}

      <BottomNav />
      <OnboardingWalkthrough />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "font-display text-base font-bold tracking-tight drop-shadow transition-colors",
        active ? "text-white" : "text-white/60",
      )}
    >
      {children}
    </button>
  );
}

function EmptyFollowing({ signedIn }: { signedIn: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-fire shadow-glow">
        <Flame className="h-10 w-10 text-primary-foreground" />
      </div>
      <h1 className="mt-6 font-display text-2xl font-bold text-white">
        {signedIn ? "Nothing here yet" : "Sign in to follow creators"}
      </h1>
      <p className="mt-2 max-w-xs text-sm text-white/70">
        {signedIn
          ? "Follow creators to see their latest drops here."
          : "Create an account to build your own personal feed."}
      </p>
      <Link
        to={signedIn ? "/discover" : "/welcome"}
        className="mt-6 rounded-full bg-gradient-fire px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        {signedIn ? "Discover creators" : "Get started"}
      </Link>
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
