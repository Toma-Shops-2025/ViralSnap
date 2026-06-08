import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Shared shell for public legal / policy pages (privacy, terms, DMCA, etc).
 * Kept auth-free so these URLs are reachable for Google Play review and by
 * signed-out visitors.
 */
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Link
          to="/"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="font-display text-xl font-bold">ViralSnap</span>
      </header>

      <article className="mx-auto max-w-2xl px-5 pt-6 pb-24">
        <h1 className="font-display text-2xl font-bold tracking-tight text-gradient-fire">
          {title}
        </h1>
        {updated && (
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Last updated: {updated}
          </p>
        )}
        {children}
        <LegalFooter />
      </article>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6 text-sm text-foreground/90 space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_a]:underline-offset-2">
      <h2 className="text-base font-semibold text-gold">{title}</h2>
      {children}
    </section>
  );
}

function LegalFooter() {
  return (
    <p className="mt-10 flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-6 text-xs text-muted-foreground">
      <Link to="/privacy" className="text-gold">Privacy</Link>
      <Link to="/terms" className="text-gold">Terms</Link>
      <Link to="/guidelines" className="text-gold">Guidelines</Link>
      <Link to="/dmca" className="text-gold">DMCA</Link>
      <Link to="/refunds" className="text-gold">Refunds</Link>
      <Link to="/account-deletion" className="text-gold">Delete account</Link>
      <Link to="/contact" className="text-gold">Contact</Link>
    </p>
  );
}
