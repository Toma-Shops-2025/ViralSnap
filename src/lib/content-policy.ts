/** Substrings that indicate adult / prohibited content in usernames, titles, etc. */
const BLOCKED_SUBSTRINGS = [
  "porn",
  "xxx",
  "nsfw",
  "nude",
  "nudes",
  "hentai",
  "blowjob",
  "handjob",
  "orgasm",
  "cumshot",
  "dildo",
  "onlyfans",
  "sextape",
  "sex tape",
  "milf",
  "anal",
  "fetish",
  "escort",
  "xnxx",
  "xvideos",
  "redtube",
  "youporn",
  "brazzers",
  "bangbros",
];

export function normalizePolicyText(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function findBlockedTerm(input: string): string | null {
  const norm = normalizePolicyText(input);
  const compact = norm.replace(/\s+/g, "");
  for (const term of BLOCKED_SUBSTRINGS) {
    const needle = term.replace(/\s+/g, "");
    if (compact.includes(needle) || norm.includes(term)) return term;
  }
  return null;
}

export function assertContentAllowed(fields: {
  title?: string;
  caption?: string;
  tags?: string[];
  username?: string;
  displayName?: string;
}) {
  const checks: Array<[string, string | undefined]> = [
    ["username", fields.username],
    ["display name", fields.displayName],
    ["title", fields.title],
    ["caption", fields.caption],
    ["tags", fields.tags?.join(" ")],
  ];

  for (const [label, value] of checks) {
    if (!value?.trim()) continue;
    const hit = findBlockedTerm(value);
    if (hit) {
      throw new Error(
        `This ${label} violates ViralSnap community guidelines. Adult or explicit content is not allowed.`,
      );
    }
  }
}
