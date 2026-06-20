import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Banknote, Loader2, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getStripeEnvironment } from "@/lib/stripe";
import { getConnectStatus, createConnectOnboardingLink } from "@/lib/connect.functions";
import { PayoutOnboardDialog } from "@/components/payout-onboard-dialog";
import { toast } from "sonner";

/**
 * Prominent prompt nudging creators who haven't connected a payout account to
 * finish Stripe onboarding. Renders nothing for signed-out users or anyone
 * whose payouts are already enabled.
 */
export function PayoutSetupBanner({ returnPath = "/earnings" }: { returnPath?: string }) {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [onboardUrl, setOnboardUrl] = useState<string | null>(null);

  const statusFn = useServerFn(getConnectStatus);
  const onboardFn = useServerFn(createConnectOnboardingLink);

  const { data: connect } = useQuery({
    queryKey: ["connect-status", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const res = await statusFn({ data: { environment: getStripeEnvironment() } });
      if ("error" in res) throw new Error(res.error);
      return res;
    },
  });

  if (!user || dismissed || !connect || connect.payoutsEnabled) return null;

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await onboardFn({
        data: {
          email: user.email ?? undefined,
          returnUrl: `${window.location.origin}${returnPath}`,
          environment: getStripeEnvironment(),
        },
      });
      if ("error" in res) throw new Error(res.error);
      setOnboardUrl(res.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start payout setup");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-ember p-4 shadow-glow">
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-white/80 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
          <Banknote className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-bold text-white">Finish your payout setup</p>
          <p className="mt-0.5 text-xs text-white/85">
            Connect a payout account so you can cash out your ViralCoins earnings.
          </p>
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-primary transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {connecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Set up payouts
          </button>
        </div>
      </div>
    </div>
  );
}
