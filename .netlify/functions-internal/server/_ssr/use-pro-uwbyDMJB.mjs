import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { a as getStripeEnvironment } from "./stripe-B2IM9WNU.mjs";
import { u as useAuth } from "./router-QVK_Sz8y.mjs";
function useIsAdmin() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    }
  });
  return { isAdmin: !!query.data, isLoading: query.isLoading };
}
function useProSubscription() {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const query = useQuery({
    queryKey: ["pro-subscription", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const env = getStripeEnvironment();
      const { data } = await supabase.from("pro_subscriptions").select("status, current_period_end, cancel_at_period_end").eq("user_id", user.id).eq("environment", env).order("created_at", { ascending: false }).limit(1).maybeSingle();
      return data;
    }
  });
  const sub = query.data;
  const isPro = isAdmin || !!(sub && (["active", "trialing"].includes(sub.status) && (!sub.current_period_end || new Date(sub.current_period_end) > /* @__PURE__ */ new Date()) || sub.status === "canceled" && sub.current_period_end && new Date(sub.current_period_end) > /* @__PURE__ */ new Date()));
  return { isPro, isAdmin, subscription: sub, isLoading: query.isLoading, refetch: query.refetch };
}
export {
  useProSubscription as u
};
