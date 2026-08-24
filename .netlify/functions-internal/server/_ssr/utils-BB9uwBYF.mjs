import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function toastErrorMessage(err, fallback = "Something went wrong") {
  const raw = err instanceof Error ? err.message : typeof err === "string" ? err : "";
  if (!raw) return fallback;
  const lower = raw.toLowerCase();
  if (lower.includes("<!doctype") || lower.includes("<html") || lower.includes("inactivity timeout") || lower.includes("without sending any data")) {
    return "AI timed out — try again in a moment";
  }
  const cleaned = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return cleaned.slice(0, 180) || fallback;
}
export {
  cn as c,
  toastErrorMessage as t
};
