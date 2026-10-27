const KEY = "viralsnap_muted_words";

export function parseMutedWordsInput(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((w) => w.trim())
    .filter(Boolean);
}

export function getMutedWords(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string" && x.length > 0)
      : [];
  } catch {
    return [];
  }
}

export function setMutedWords(words: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(words));
    window.dispatchEvent(new Event("viralsnap-muted-words-changed"));
  } catch {
    /* ignore */
  }
}

export function textHasMutedWord(text: string, words: string[]): boolean {
  if (!text || words.length === 0) return false;
  const lower = text.toLowerCase();
  return words.some((w) => lower.includes(w.toLowerCase()));
}

export function censorMutedWords(text: string, words: string[]): string {
  if (!text || words.length === 0) return text;
  let out = text;
  for (const word of words) {
    if (!word) continue;
    const re = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(re, "•••");
  }
  return out;
}
