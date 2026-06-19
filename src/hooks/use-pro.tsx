import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { useAuth } from "@/hooks/use-auth";
import { useIsAdmin } from "@/hooks/use-admin";

/**
 * Reads the current user's ViralSnap Pro status from the pro_subscriptions
 * table, scoped to the active Stripe environment. Client-side gate for UX only —
 * the AI generators re-check Pro status server-side before running.
 */
export function useProSubscription() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["pro-subscription", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const env = getStripeEnvironment();
      const { data } = await supabase
        .from("pro_subscriptions")
        .select("status, current_period_end, cancel_at_period_end")
        .eq("user_id", user!.id)
        .eq("environment", env)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const sub = query.data;
  const isPro = !!(
    sub &&
    ((["active", "trialing"].includes(sub.status) &&
      (!sub.current_period_end ||
        new Date(sub.current_period_end) > new Date())) ||
      (sub.status === "canceled" &&
        sub.current_period_end &&
        new Date(sub.current_period_end) > new Date()))
  );

  return { isPro, subscription: sub, isLoading: query.isLoading, refetch: query.refetch };
}
