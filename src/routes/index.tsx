import { createFileRoute, Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useRef } from "react";
import { Flame, Sparkles, Radio, Bell } from "lucide-react";
import { fetchFeedPage, fetchFollowingFeedPage } from "@/lib/feed";
import { VideoCard } from "@/components/video-card";
import { BottomNav } from "@/components/bottom-nav";
import { OnboardingWalkthrough } from "@/components/onboarding-walkthrough";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

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
  const [tab, setTab] = useState<Tab>("foryou");
  const { user } = useAuth();

  // Generate a random seed once per session
  const [sessionSeed] = useState(() => Math.floor(Math.random() * 1000));

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["feed", tab, user?.id, sessionSeed],
      initialPageParam: 0,
      queryFn: ({ pageParam }) =>
        tab === "following" ? fetchFollowingFeedPage(pageParam) : fetchFeedPage(pageParam, sessionSeed),
      getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    });

  const sentinelRef = useRef<HTMLDivElement>(null);


  const items = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((page, pageIndex) =>
      page.items.map((video) => ({ video, key: `${video.id}-${pageIndex}` })),
    );
  }, [data]);

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
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Link
          to="/activity"
          className="flex w-16 items-center gap-1 text-white drop-shadow"
          aria-label="Activity"
        >
          <Bell className="h-5 w-5" />
        </Link>

        <div className="flex items-center gap-4">
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
          className="flex w-16 items-center justify-end gap-1 text-xs font-bold uppercase text-white drop-shadow"
        >
          <Radio className="h-4 w-4 text-primary" /> Live
        </Link>
      </header>

      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Skeleton className="h-full w-full bg-secondary/40" />
        </div>
      ) : items.length > 0 ? (
        <div className="h-full snap-y-mandatory overflow-y-scroll no-scrollbar">
          {items.map(({ video, key }) => (
            <VideoCard
              key={key}
              video={video}
              muted={muted}
              onToggleMute={() => setMuted((m) => !m)}
            />
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
