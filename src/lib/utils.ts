import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Strip HTML / gateway pages so toasts stay readable. */
export function toastErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  const raw = err instanceof Error ? err.message : typeof err === "string" ? err : "";
  if (!raw) return fallback;
  const lower = raw.toLowerCase();
  if (
    lower.includes("<!doctype") ||
    lower.includes("<html") ||
    lower.includes("inactivity timeout") ||
    lower.includes("without sending any data")
  ) {
    return "AI timed out — try again in a moment";
  }
  const cleaned = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return cleaned.slice(0, 180) || fallback;
}
