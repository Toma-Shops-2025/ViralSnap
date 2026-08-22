import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { geminiJsonObject } from "@/lib/gemini.server";

type StripeEnv = "sandbox" | "live";

export type GeneratedPost = {
  titleOptions: string[];
  caption: string;
  hashtags: string[];
  hook: string;
  postingTip: string;
};

type GenerateResult = GeneratedPost | { error: string };

/**
 * Pro-only AI helper. Takes a short topic prompt and returns a punchy title,
 * caption, and hashtag set for a new post. Gated server-side against an active
 * ViralSnap Pro subscription so the feature can't be unlocked from the client.
 */
export const generatePostContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { idea: string; environment: StripeEnv }) => {
    const idea = (data.idea ?? "").trim();
    if (idea.length < 2) throw new Error("Add a short idea first");
    return { idea: idea.slice(0, 400), environment: data.environment };
  })
  .handler(async ({ data, context }): Promise<GenerateResult> => {
    const { supabase, userId, claims } = context;
    const claimEmail =
      typeof claims?.email === "string" ? claims.email.trim().toLowerCase() : "";
    const emailAdmin = claimEmail === "admin@viralsnap.online";

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (!isAdmin && !emailAdmin) {
      const { data: pro } = await supabase
        .from("pro_subscriptions")
        .select("status, current_period_end")
        .eq("user_id", userId)
        .eq("environment", data.environment)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const active =
        pro &&
        ((["active", "trialing"].includes(pro.status) &&
          (!pro.current_period_end ||
            new Date(pro.current_period_end) > new Date())) ||
          (pro.status === "canceled" &&
            pro.current_period_end &&
            new Date(pro.current_period_end) > new Date()));

      if (!active) {
        return { error: "ViralSnap Pro is required to use the AI generators." };
      }
    }

    try {
      const parsed = await geminiJsonObject(
        "You are a viral short-form video copywriter for a TikTok-style app called ViralSnap. " +
          "Given a short idea, write content engineered for maximum reach. " +
          "Respond ONLY as compact JSON with keys: " +
          "titleOptions (array of exactly 3 distinct scroll-stopping titles, each max 80 chars), " +
          "caption (1-3 punchy sentences with a hook, may use 1-2 emojis), " +
          "hashtags (array of 5-8 lowercase hashtags WITHOUT the # symbol, no spaces), " +
          "hook (one short opening line to say in the first 3 seconds of the video), " +
          "postingTip (one short, practical tip on when or how to post for max reach).",
        data.idea,
      );

      const hashtags = Array.isArray(parsed.hashtags)
        ? parsed.hashtags
            .map((h) => String(h).replace(/^#/, "").trim())
            .filter(Boolean)
            .slice(0, 8)
        : [];

      const titleOptions = Array.isArray(parsed.titleOptions)
        ? parsed.titleOptions
            .map((t) => String(t).trim().slice(0, 80))
            .filter(Boolean)
            .slice(0, 3)
        : [];

      return {
        titleOptions: titleOptions.length ? titleOptions : ["Untitled drop"],
        caption: String(parsed.caption ?? ""),
        hashtags,
        hook: String(parsed.hook ?? ""),
        postingTip: String(parsed.postingTip ?? ""),
      };
    } catch (err) {
      console.error("generatePostContent error:", err);
      const msg = err instanceof Error ? err.message : "Could not generate suggestions. Try again.";
      if (msg.includes("GEMINI_API_KEY")) return { error: "AI is not configured." };
      return { error: "Could not generate suggestions. Try again." };
    }
  });
