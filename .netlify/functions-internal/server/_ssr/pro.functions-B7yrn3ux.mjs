import { c as createServerRpc } from "./createServerRpc-CronfYHw.mjs";
import { a as createServerFn } from "./server-CauiqJuS.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DPXRLhra.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const BASE = "https://generativelanguage.googleapis.com/v1beta";
const TEXT_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash-lite"];
const FETCH_MS = 18e3;
TEXT_MODELS[0];
function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  return key.replace(/^["']|["']$/g, "");
}
async function generateOnce(model, system, user) {
  const key = getGeminiApiKey();
  let res;
  try {
    res = await fetch(`${BASE}/models/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.9
        }
      }),
      signal: AbortSignal.timeout(FETCH_MS)
    });
  } catch (e) {
    const name = e instanceof Error ? e.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      throw new Error(`${model}: timed out — try again in a moment`);
    }
    throw e instanceof Error ? e : new Error(String(e));
  }
  const json = await res.json();
  if (!res.ok) {
    const detail = json.error?.message ?? `HTTP ${res.status}`;
    throw new Error(`${model}: ${detail}`);
  }
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p) => p.text ?? "").join("").trim();
  if (!text) {
    const reason = json.candidates?.[0]?.finishReason ?? "empty";
    throw new Error(`${model}: empty response (${reason})`);
  }
  return text;
}
async function geminiJsonObject(system, user) {
  let lastErr = null;
  for (const model of TEXT_MODELS) {
    try {
      const text = await generateOnce(model, system, user);
      try {
        return JSON.parse(text);
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
        throw new Error(`${model}: response was not valid JSON`);
      }
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e));
      const msg = lastErr.message.toLowerCase();
      if (msg.includes("api key") || msg.includes("permission") || msg.includes("403") || msg.includes("401") || msg.includes("quota") || msg.includes("resource_exhausted")) {
        break;
      }
    }
  }
  throw lastErr ?? new Error("Gemini request failed");
}
const generatePostContent_createServerFn_handler = createServerRpc({
  id: "1d773a27b431444d3e166725cb92462780a3c84b3616e1d5fd7f8947b5c82859",
  name: "generatePostContent",
  filename: "src/lib/pro.functions.ts"
}, (opts) => generatePostContent.__executeServer(opts));
const generatePostContent = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => {
  const idea = (data.idea ?? "").trim();
  if (idea.length < 2) throw new Error("Add a short idea first");
  return {
    idea: idea.slice(0, 400),
    environment: data.environment
  };
}).handler(generatePostContent_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId,
    claims
  } = context;
  const claimEmail = typeof claims?.email === "string" ? claims.email.trim().toLowerCase() : "";
  const emailAdmin = claimEmail === "admin@viralsnap.online";
  const {
    data: isAdmin
  } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin"
  });
  if (!isAdmin && !emailAdmin) {
    const {
      data: pro
    } = await supabase.from("pro_subscriptions").select("status, current_period_end").eq("user_id", userId).eq("environment", data.environment).order("created_at", {
      ascending: false
    }).limit(1).maybeSingle();
    const active = pro && (["active", "trialing"].includes(pro.status) && (!pro.current_period_end || new Date(pro.current_period_end) > /* @__PURE__ */ new Date()) || pro.status === "canceled" && pro.current_period_end && new Date(pro.current_period_end) > /* @__PURE__ */ new Date());
    if (!active) {
      return {
        error: "ViralSnap Pro is required to use the AI generators."
      };
    }
  }
  try {
    const parsed = await geminiJsonObject("You are a viral short-form video copywriter for a TikTok-style app called ViralSnap. Given a short idea, write content engineered for maximum reach. Respond ONLY as compact JSON with keys: titleOptions (array of exactly 3 distinct scroll-stopping titles, each max 80 chars), caption (1-3 punchy sentences with a hook, may use 1-2 emojis), hashtags (array of 5-8 lowercase hashtags WITHOUT the # symbol, no spaces), hook (one short opening line to say in the first 3 seconds of the video), postingTip (one short, practical tip on when or how to post for max reach).", data.idea);
    const hashtags = Array.isArray(parsed.hashtags) ? parsed.hashtags.map((h) => String(h).replace(/^#/, "").trim()).filter(Boolean).slice(0, 8) : [];
    const titleOptions = Array.isArray(parsed.titleOptions) ? parsed.titleOptions.map((t) => String(t).trim().slice(0, 80)).filter(Boolean).slice(0, 3) : [];
    return {
      titleOptions: titleOptions.length ? titleOptions : ["Untitled drop"],
      caption: String(parsed.caption ?? ""),
      hashtags,
      hook: String(parsed.hook ?? ""),
      postingTip: String(parsed.postingTip ?? "")
    };
  } catch (err) {
    console.error("generatePostContent error:", err);
    const msg = err instanceof Error ? err.message : "Could not generate suggestions. Try again.";
    if (msg.includes("GEMINI_API_KEY") || msg.toLowerCase().includes("not configured")) {
      return {
        error: "AI is not configured. Add GEMINI_API_KEY in Netlify and redeploy."
      };
    }
    if (/api key|permission|401|403/i.test(msg)) {
      return {
        error: "Gemini rejected the API key. Check GEMINI_API_KEY in Netlify."
      };
    }
    if (/quota|resource_exhausted|429/i.test(msg)) {
      return {
        error: "Gemini free-tier limit hit. Try again later or enable billing in AI Studio."
      };
    }
    const short = msg.length > 160 ? `${msg.slice(0, 160)}…` : msg;
    return {
      error: short
    };
  }
});
export {
  generatePostContent_createServerFn_handler
};
