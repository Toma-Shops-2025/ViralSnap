/**
 * Direct Google Gemini API (no Lovable gateway).
 * Set GEMINI_API_KEY in Netlify (from Google AI Studio).
 */

const BASE = "https://generativelanguage.googleapis.com/v1beta";

/** Prefer 3.6 Flash (required for new API keys); fall back to 3.5 Flash-Lite. */
const TEXT_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash-lite"] as const;
const FETCH_MS = 18_000;

export const GEMINI_TEXT_MODEL = TEXT_MODELS[0];

export function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  // Strip accidental quotes pasted from dashboards
  return key.replace(/^["']|["']$/g, "");
}

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  error?: { message?: string; status?: string; code?: number };
};

async function generateOnce(
  model: string,
  system: string,
  user: string,
): Promise<string> {
  const key = getGeminiApiKey();
  let res: Response;
  try {
    res = await fetch(`${BASE}/models/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.9,
        },
      }),
      signal: AbortSignal.timeout(FETCH_MS),
    });
  } catch (e) {
    const name = e instanceof Error ? e.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      throw new Error(`${model}: timed out — try again in a moment`);
    }
    throw e instanceof Error ? e : new Error(String(e));
  }

  const json = (await res.json()) as GeminiResponse;
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

export async function geminiJsonObject(
  system: string,
  user: string,
): Promise<Record<string, unknown>> {
  let lastErr: Error | null = null;

  for (const model of TEXT_MODELS) {
    try {
      const text = await generateOnce(model, system, user);
      try {
        return JSON.parse(text) as Record<string, unknown>;
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]) as Record<string, unknown>;
        throw new Error(`${model}: response was not valid JSON`);
      }
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e));
      // Try next model on not-found / unsupported; stop on auth/quota.
      const msg = lastErr.message.toLowerCase();
      if (
        msg.includes("api key") ||
        msg.includes("permission") ||
        msg.includes("403") ||
        msg.includes("401") ||
        msg.includes("quota") ||
        msg.includes("resource_exhausted")
      ) {
        break;
      }
    }
  }

  throw lastErr ?? new Error("Gemini request failed");
}
