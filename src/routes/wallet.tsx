import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Coins, TrendingUp, TrendingDown, Sparkles, ArrowUpRight, ArrowDownLeft, Gift } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "Wallet — ViralSnap" }] }),
  component: WalletPage,
});

const PACKS = [
  { coins: 500, price: "$4.99", priceId: "coins_500" },
  { coins: 1200, price: "$9.99", priceId: "coins_1200" },
  { coins: 3000, price: "$19.99", priceId: "coins_3000" },
  { coins: 8000, price: "$49.99", priceId: "coins_8000" },
];


function WalletPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openCheckout, closeCheckout, isOpen, checkoutElement } = useStripeCheckout();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/welcome", replace: true });
  }, [loading, user, navigate]);

  // Handle return from Stripe checkout
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      toast.success("Payment complete!", {
        description: "Your ViralCoins are being added to your balance.",
      });
      // Coins are credited by the webhook; refresh shortly after.
      const refresh = () => {
        refreshProfile();
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      };
      refresh();
      const t = setTimeout(refresh, 2500);
      window.history.replaceState({}, "", "/wallet");
      return () => clearTimeout(t);
    }
  }, [refreshProfile, queryClient]);

  const handleBuy = (priceId: string) => {
    if (!user) {
      navigate({ to: "/welcome" });
      return;
    }
    openCheckout({
      priceId,
      customerEmail: user.email ?? undefined,
      userId: user.id,
      returnUrl: `${window.location.origin}/wallet?checkout=success`,
    });
  };

  const { data: txns = [] } = useQuery({
    queryKey: ["transactions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("coin_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
  });

  return (
    <div className="min-h-[100dvh] pb-28">
      <PaymentTestModeBanner />
      <header className="flex items-center justify-between px-4 pt-[calc(1rem+env(safe-area-inset-top))]">

        <h1 className="font-display text-2xl font-bold">Wallet</h1>
        <Link
          to="/earnings"
          className="flex items-center gap-1 rounded-full border border-gold/40 bg-card px-3 py-1.5 text-sm font-semibold text-gold"
        >
          <TrendingUp className="h-4 w-4" /> Earnings
        </Link>
      </header>


      <div className="mx-auto max-w-md space-y-6 px-4 py-4">
        {/* balance card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-ember p-6 shadow-glow">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <p className="text-sm font-medium text-white/80">ViralCoins balance</p>
          <div className="mt-1 flex items-center gap-2">
            <Coins className="h-8 w-8 text-white" />
            <span className="font-display text-4xl font-bold text-white">
              {(profile?.coin_balance ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-black/20 p-3 backdrop-blur">
              <div className="flex items-center gap-1 text-xs text-white/80">
                <TrendingUp className="h-3.5 w-3.5" /> Earned
              </div>
              <p className="mt-0.5 font-display text-lg font-bold text-white">
                {(profile?.total_earned ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-black/20 p-3 backdrop-blur">
              <div className="flex items-center gap-1 text-xs text-white/80">
                <TrendingDown className="h-3.5 w-3.5" /> Spent
              </div>
              <p className="mt-0.5 font-display text-lg font-bold text-white">
                {(profile?.total_spent ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* packs */}
        <div>
          <h2 className="mb-3 font-display text-lg font-bold">Top up</h2>
          <div className="grid grid-cols-2 gap-3">
            {PACKS.map((p) => (
              <button
                key={p.coins}
                onClick={() => handleBuy(p.priceId)}
                className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-gold/60"
              >
                <Sparkles className="h-5 w-5 text-gold" />
                <span className="font-display text-lg font-bold">{p.coins.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">coins</span>
                <span className="mt-1 rounded-full bg-gradient-fire px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                  {p.price}
                </span>
              </button>
            ))}

          </div>
        </div>

        {/* history */}
        <div>
          <h2 className="mb-3 font-display text-lg font-bold">Activity</h2>
          <div className="space-y-2">
            {txns.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No transactions yet.
              </p>
            )}
            {txns.map((t) => {
              const positive = t.amount >= 0;
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      positive ? "bg-accent text-gold" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {t.type === "gift_received" || t.type === "welcome" ? (
                      <Gift className="h-4 w-4" />
                    ) : positive ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t.description}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(t.created_at)}</p>
                  </div>
                  <span
                    className={`font-display text-sm font-bold ${
                      positive ? "text-gold" : "text-muted-foreground"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {t.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={(o) => !o && closeCheckout()}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buy ViralCoins</DialogTitle>
          </DialogHeader>
          {checkoutElement}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
