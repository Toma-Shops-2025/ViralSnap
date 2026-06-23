import { PLAY_STORE_URL } from "@/lib/app-links";

/** "Get it on Google Play" badge-style button. */
export function GooglePlayButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-xl border border-border bg-black px-4 py-2.5 text-white transition-opacity hover:opacity-90 ${className}`}
      aria-label="Get it on Google Play"
    >
      <PlayTriangle className="h-7 w-7 shrink-0" />
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wide text-white/80">Get it on</span>
        <span className="font-display text-lg font-semibold">Google Play</span>
      </span>
    </a>
  );
}

function PlayTriangle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden>
      <path fill="#00D4FF" d="M48 32v448l240-224z" />
      <path fill="#00F076" d="M48 32l240 224 88-82L92 22a44 44 0 0 0-44 10z" />
      <path fill="#FFCE00" d="M376 174l72 56c20 16 20 40 0 56l-72 50-88-82z" />
      <path fill="#FF3A44" d="M48 480l240-224 88 82-284 152a44 44 0 0 1-44-10z" />
    </svg>
  );
}
