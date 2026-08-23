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
