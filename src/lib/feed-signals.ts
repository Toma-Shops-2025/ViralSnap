const VIDEO_KEY = "viralsnap_not_interested_videos";
const CREATOR_KEY = "viralsnap_not_interested_creators";

export const FEED_SIGNALS_CHANGED = "viralsnap-feed-signals-changed";

function readIds(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
    window.dispatchEvent(new Event(FEED_SIGNALS_CHANGED));
  } catch {
    /* ignore */
  }
}

export function getNotInterestedVideoIds(): string[] {
  return readIds(VIDEO_KEY);
}

export function getNotInterestedCreatorIds(): string[] {
  return readIds(CREATOR_KEY);
}

export function markVideoNotInterested(videoId: string) {
  const ids = new Set(getNotInterestedVideoIds());
  ids.add(videoId);
  writeIds(VIDEO_KEY, [...ids]);
}

export function markCreatorNotInterested(creatorId: string) {
  const ids = new Set(getNotInterestedCreatorIds());
  ids.add(creatorId);
  writeIds(CREATOR_KEY, [...ids]);
}

export function clearFeedSignals() {
  try {
    localStorage.removeItem(VIDEO_KEY);
    localStorage.removeItem(CREATOR_KEY);
    window.dispatchEvent(new Event(FEED_SIGNALS_CHANGED));
  } catch {
    /* ignore */
  }
}
