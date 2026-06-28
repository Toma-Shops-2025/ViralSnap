import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
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
  Banknote,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { fetchEarnings } from "@/lib/earnings";
import { compact } from "@/lib/format";
import { getStripeEnvironment } from "@/lib/stripe";
import {
  getConnectStatus,
  createConnectOnboardingLink,
  requestCreatorPayout,
} from "@/lib/connect.functions";
import { PayoutOnboardDialog } from "@/components/payout-onboard-dialog";
import { toast } from "sonner";
import { PayoutSetupBanner } from "@/components/payout-setup-banner";

export const Route = createFileRoute("/earnings")({
  head: () => ({ meta: [{ title: "Earnings — ViralSnap" }] }),
  component: EarningsPage,
});

// Creators cash out coins at 1000 coins = $5 (= $0.005 / coin).
const COIN_TO_USD = 5 / 1000;
const MIN_PAYOUT_COINS = 1000;

function EarningsPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [coinsToCashOut, setCoinsToCashOut] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [onboardUrl, setOnboardUrl] = useState<string | null>(null);

  const statusFn = useServerFn(getConnectStatus);
  const onboardFn = useServerFn(createConnectOnboardingLink);
  const payoutFn = useServerFn(requestCreatorPayout);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/welcome", replace: true });
  }, [loading, user, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["earnings", user?.id],
    enabled: !!user,
    queryFn: fetchEarnings,
  });

  const { data: connect, refetch: refetchConnect } = useQuery({
    queryKey: ["connect-status", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const res = await statusFn({ data: { environment: getStripeEnvironment() } });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
  });

  const balance = profile?.coin_balance ?? 0;
  const cashValue = (balance * COIN_TO_USD).toFixed(2);
  const canPayout = balance >= MIN_PAYOUT_COINS;

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await onboardFn({
        data: {
          email: user?.email ?? undefined,
          returnUrl: `${window.location.origin}/earnings`,
          environment: getStripeEnvironment(),
        },
      });
      if ("error" in res) throw new Error(res.error);
      setOnboardUrl(res.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start onboarding");
    } finally {
      setConnecting(false);
    }
  };

  const handlePayout = async () => {
    const coins = Number(coinsToCashOut);
    if (!Number.isInteger(coins) || coins < MIN_PAYOUT_COINS) {
      toast.error(`Minimum payout is ${MIN_PAYOUT_COINS.toLocaleString()} coins.`);
      return;
    }
    if (coins > balance) {
      toast.error("You don't have that many coins.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await payoutFn({
        data: { coins, environment: getStripeEnvironment() },
      });
      if ("error" in res) throw new Error(res.error);
      toast.success(`Payout of $${(res.amountCents / 100).toFixed(2)} sent!`);
      setPayoutOpen(false);
      setCoinsToCashOut("");
      await refreshProfile();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payout failed");
    } finally {
      setSubmitting(false);
    }
  };

  const openPayout = () => {
    if (!canPayout) {
      toast.info(
        `Payouts open at ${MIN_PAYOUT_COINS.toLocaleString()} coins. Keep creating!`,
      );
      return;
    }
    if (!connect?.payoutsEnabled) {
      handleConnect();
      return;
    }
    setCoinsToCashOut(String(balance));
    setPayoutOpen(true);
  };

  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Link to="/wallet" className="flex h-9 w-9 items-center justify-center rounded-full bg-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-2xl font-bold">Earnings</h1>
      </header>

      <div className="mx-auto max-w-md space-y-6 px-4 py-4">
        <PayoutSetupBanner />
        {/* cash card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-ember p-6 shadow-glow">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <p className="text-sm font-medium text-white/80">Available to cash out</p>
          <div className="mt-1 flex items-end gap-1">
            <span className="font-display text-4xl font-bold text-white">${cashValue}</span>
            <span className="mb-1 text-sm text-white/70">USD</span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
            <Coins className="h-4 w-4" /> {balance.toLocaleString()} ViralCoins
          </p>

          {connect?.payoutsEnabled && (
            <p className="mt-2 flex items-center gap-1 text-xs text-white/90">
              <CheckCircle2 className="h-3.5 w-3.5" /> Payout account connected
            </p>
          )}

          <button
            onClick={openPayout}
            disabled={connecting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-black/25 py-2.5 text-sm font-semibold text-white backdrop-blur transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {connecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Banknote className="h-4 w-4" />
            )}
            {connect?.payoutsEnabled
              ? "Request payout"
              : canPayout
                ? "Connect payout account"
                : "Request payout"}
          </button>
          <p className="mt-2 text-center text-[11px] text-white/60">
            Min {MIN_PAYOUT_COINS.toLocaleString()} coins = $5.00
          </p>
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
                    <video src={v.media_url ?? undefined} muted playsInline preload="metadata" className="h-14 w-10 rounded-md object-cover" />
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

      <Dialog open={payoutOpen} onOpenChange={(o) => !o && setPayoutOpen(false)}>
        <DialogContent className="border-border bg-card sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Request payout</DialogTitle>
            <DialogDescription>
              Coins are converted at 1,000 coins = $5.00 and transferred to your
              connected account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-1">
            <Input
              type="number"
              min={MIN_PAYOUT_COINS}
              max={balance}
              value={coinsToCashOut}
              onChange={(e) => setCoinsToCashOut(e.target.value)}
              className="rounded-xl bg-secondary/40"
            />
            <p className="text-sm text-muted-foreground">
              You'll receive{" "}
              <span className="font-semibold text-foreground">
                ${((Number(coinsToCashOut) || 0) * COIN_TO_USD).toFixed(2)}
              </span>
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPayoutOpen(false)}
              className="rounded-full border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayout}
              disabled={submitting}
              className="rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90"
            >
              {submitting ? "Sending…" : "Cash out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PayoutOnboardDialog url={onboardUrl} onClose={() => setOnboardUrl(null)} />

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
