const KEY = "vs_blocked_creator_ids";

export function rememberBlockedCreator(userId: string) {
  try {
    const ids = new Set(getBlockedCreatorIds());
    ids.add(userId);
    sessionStorage.setItem(KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

export function getBlockedCreatorIds(): string[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
