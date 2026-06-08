import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type StripeEnv = "sandbox" | "live";

export type GeneratedPost = {
  titleOptions: string[];
  caption: string;
  hashtags: string[];
  hook: string;
  postingTip: string;
};

type GenerateResult = GeneratedPost | { error: string };

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

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
    const { supabase, userId } = context;

    // Verify active Pro subscription.
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

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { error: "AI is not configured." };

    try {
      const resp = await fetch(AI_GATEWAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are a viral short-form video copywriter for a TikTok-style app called ViralSnap. " +
                "Given a short idea, write content engineered for maximum reach. " +
                "Respond ONLY as compact JSON with keys: title (max 80 chars, scroll-stopping), " +
                "caption (1-3 punchy sentences with a hook, may use 1-2 emojis), " +
                "hashtags (array of 5-8 lowercase hashtags WITHOUT the # symbol, no spaces). " +
                "Do not include any text outside the JSON.",
            },
            { role: "user", content: data.idea },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (resp.status === 429) {
        return { error: "Rate limit reached. Try again in a moment." };
      }
      if (resp.status === 402) {
        return { error: "AI credits exhausted. Add credits to keep generating." };
      }
      if (!resp.ok) {
        console.error("AI gateway error", resp.status, await resp.text());
        return { error: "Could not generate suggestions. Try again." };
      }

      const json = await resp.json();
      const raw = json?.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as Partial<GeneratedPost>;

      const hashtags = Array.isArray(parsed.hashtags)
        ? parsed.hashtags
            .map((h) => String(h).replace(/^#/, "").trim())
            .filter(Boolean)
            .slice(0, 8)
        : [];

      return {
        title: String(parsed.title ?? "").slice(0, 80),
        caption: String(parsed.caption ?? ""),
        hashtags,
      };
    } catch (err) {
      console.error("generatePostContent error:", err);
      return { error: "Could not generate suggestions. Try again." };
    }
  });
