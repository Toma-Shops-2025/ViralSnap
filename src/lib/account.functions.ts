import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type DeleteAccountResult = { success: true } | { error: string };

/**
 * Permanently deletes the signed-in user's auth account. Related rows that
 * reference auth.users with ON DELETE CASCADE are removed automatically.
 */
export const deleteAccount = 
  
  .handler(async ({ context }): Promise<DeleteAccountResult> => {
    const userId = context.userId;
    if (!userId) return { error: "Not authenticated" };
    try {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) return { error: error.message };
      return { success: true };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Failed to delete account" };
    }
  });
