import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const ADMIN_EMAILS = new Set(["admin@viralsnap.online"]);

/**
 * Returns whether the current user has the `admin` role. Admins are granted
 * full access to every feature (Pro generators, upload limits, etc.) without
 * needing a paid subscription. Client-side gate for UX only — server functions
 * re-check the admin role via has_role() before unlocking gated features.
 */
export function useIsAdmin() {
  const { user } = useAuth();
  const emailAdmin = !!(user?.email && ADMIN_EMAILS.has(user.email.trim().toLowerCase()));

  const query = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    },
  });

  return { isAdmin: emailAdmin || !!query.data, isLoading: query.isLoading };
}
