/** Deterministic PRNG so the same seed always yields the same shuffle. */
function createRng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Fisher–Yates shuffle with a stable seed (session-scoped feed order). */
export function shuffleWithSeed<T>(input: T[], seed: number): T[] {
  const arr = [...input];
  const rand = createRng(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function newSessionSeed(): number {
  return (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0;
}

/** Derive a per-lap seed so each full pass through the library shuffles differently. */
export function lapSeed(sessionSeed: number, lap: number): number {
  return (sessionSeed + Math.imul(lap >>> 0, 2654435761)) >>> 0;
}

const lapShuffleCache = new Map<string, unknown[]>();

function getLapLibrary<T>(base: T[], sessionSeed: number, lap: number): T[] {
  const key = `${sessionSeed}:${lap}:${base.length}`;
  const hit = lapShuffleCache.get(key);
  if (hit) return hit as T[];
  const shuffled = shuffleWithSeed(base, lapSeed(sessionSeed, lap));
  lapShuffleCache.set(key, shuffled);
  return shuffled;
}

/** Paginate through a library; each full lap uses a fresh shuffle order. */
export function sliceShuffledPage<T>(
  base: T[],
  sessionSeed: number,
  page: number,
  pageSize: number,
): { slice: T[]; hasMore: boolean } {
  if (base.length === 0) return { slice: [], hasMore: false };
  const from = page * pageSize;
  const len = base.length;
  const slice: T[] = [];
  for (let i = 0; i < pageSize; i++) {
    const global = from + i;
    const lap = Math.floor(global / len);
    const idx = global % len;
    slice.push(getLapLibrary(base, sessionSeed, lap)[idx]);
  }
  return { slice, hasMore: true };
}
