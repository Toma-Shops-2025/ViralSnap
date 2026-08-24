const KEY = "vs_blocked_creator_ids";
function rememberBlockedCreator(userId) {
  try {
    const ids = new Set(getBlockedCreatorIds());
    ids.add(userId);
    sessionStorage.setItem(KEY, JSON.stringify([...ids]));
  } catch {
  }
}
function getBlockedCreatorIds() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
export {
  getBlockedCreatorIds as g,
  rememberBlockedCreator as r
};
