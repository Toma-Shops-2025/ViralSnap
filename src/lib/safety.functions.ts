import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabase } from "@/integrations/supabase/client";

export const REPORT_REASONS = [
  "spam",
  "harassment",
  "hate",
  "sexual",
  "violence",
  "csam",
  "impersonation",
  "ip_violation",
  "self_harm",
  "illegal",
  "other",
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export const submitReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    targetType: "post" | "comment" | "user";
    targetId: string;
    reason: ReportReason;
    details?: string;
  }) =>
    z
      .object({
        targetType: z.enum(["post", "comment", "user"]),
        targetId: z.string().uuid(),
        reason: z.enum(REPORT_REASONS),
        details: z.string().max(1000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await supabase.from("reports").insert({
      reporter_id: context.userId,
      target_type: data.targetType,
      target_id: data.targetId,
      reason: data.reason,
      notes: data.details ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const toggleBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { targetUserId: string }) =>
    z.object({ targetUserId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    if (data.targetUserId === context.userId) throw new Error("You can't block yourself");
    const { userId } = context;
    const { data: existing } = await supabase
      .from("blocks")
      .select("blocker_id")
      .eq("blocker_id", userId)
      .eq("blocked_id", data.targetUserId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("blocks")
        .delete()
        .eq("blocker_id", userId)
        .eq("blocked_id", data.targetUserId);
      return { blocked: false };
    }

    // Auto-unfollow both directions when blocking.
    await supabase
      .from("follows")
      .delete()
      .or(
        `and(follower_id.eq.${userId},following_id.eq.${data.targetUserId}),and(follower_id.eq.${data.targetUserId},following_id.eq.${userId})`,
      );

    const { error } = await supabase
      .from("blocks")
      .insert({ blocker_id: userId, blocked_id: data.targetUserId });

    if (error) throw new Error(error.message);
    return { blocked: true };
  });
