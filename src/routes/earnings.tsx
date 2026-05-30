import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  ArrowLeft,
  Play,
  Heart,
  MessageCircle,
  Gift,
  Coins,
  ShoppingBag,
  TrendingUp,
  Video,
} from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { useAuth } from "@/hooks/use-auth";
import { fetchEarnings } from "@/lib/earnings";
import { compact } from "@/lib/format";

export const Route = createFileRoute("/earnings")({
  head: () => ({ meta: [{ title: "Earnings — ViralSnap" }] }),
  component: EarningsPage,
});

// Creators keep 70% of gift coins; 1000 coins ≈ $5 cash value.
const COIN_TO_USD = 5 / 1000;

function EarningsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["earnings", user?.id],
    enabled: !!user,
    queryFn: fetchEarnings,
  });

  const cashValue = ((data?.totalEarned ?? 0) * COIN_TO_USD).toFixed(2);

  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Link to="/wallet" className="flex h-9 w-9 items-center justify-center rounded-full bg-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-2xl font-bold">Earnings</h1>
      </header>

      <div className="mx-auto max-w-md space-y-6 px-4 py-4">
        {/* cash card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-ember p-6 shadow-glow">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <p className="text-sm font-medium text-white/80">Estimated payout value</p>
          <div className="mt-1 flex items-end gap-1">
            <span className="font-display text-4xl font-bold text-white">${cashValue}</span>
            <span className="mb-1 text-sm text-white/70">USD</span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
            <Coins className="h-4 w-4" /> {(data?.totalEarned ?? 0).toLocaleString()} ViralCoins earned
          </p>
          <button
            onClick={() =>
              alert("Payouts open once you reach 10,000 coins. Keep creating!")
            }
            className="mt-5 w-full rounded-full bg-black/25 py-2.5 text-sm font-semibold text-white backdrop-blur"
          >
            Request payout
          </button>
        </div>

        {/* performance grid */}
        <div>
          <h2 className="mb-3 font-display text-lg font-bold">Performance</h2>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard icon={Play} label="Views" value={data?.totalViews ?? 0} loading={isLoading} />
            <MetricCard icon={Heart} label="Likes" value={data?.totalLikes ?? 0} loading={isLoading} />
            <MetricCard icon={MessageCircle} label="Comments" value={data?.totalComments ?? 0} loading={isLoading} />
            <MetricCard icon={Gift} label="Gifts received" value={data?.giftCount ?? 0} loading={isLoading} />
            <MetricCard icon={ShoppingBag} label="Product clicks" value={data?.totalProductClicks ?? 0} loading={isLoading} />
            <MetricCard icon={Video} label="Videos" value={data?.videoCount ?? 0} loading={isLoading} />
          </div>
        </div>

        {/* top videos */}
        <div>
          <h2 className="mb-3 flex items-center gap-1.5 font-display text-lg font-bold">
            <TrendingUp className="h-5 w-5 text-gold" /> Top videos
          </h2>
          {(data?.topVideos.length ?? 0) === 0 ? (
            <p className="rounded-2xl border border-border bg-card py-8 text-center text-sm text-muted-foreground">
              Upload videos to start earning.
            </p>
          ) : (
            <div className="space-y-2">
              {data?.topVideos.map((v, i) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                >
                  <span className="font-display text-lg font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  {v.cover_url ? (
                    <img src={v.cover_url} alt={v.title} className="h-14 w-10 rounded-md object-cover" />
                  ) : (
                    <video src={v.media_url} muted playsInline preload="metadata" className="h-14 w-10 rounded-md object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{v.title || v.caption || "Untitled"}</p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Play className="h-3 w-3" /> {compact(v.view_count)}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Heart className="h-3 w-3" /> {compact(v.like_count)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: typeof Play;
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-2 font-display text-2xl font-bold">
        {loading ? "—" : compact(value)}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
