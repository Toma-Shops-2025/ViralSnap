import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";
import { useAuth } from "@/hooks/use-auth";
import { toggleBlock } from "@/lib/safety.functions";
import { rememberBlockedCreator } from "@/lib/blocked-creators";
import { toast } from "sonner";

export const Route = createFileRoute("/block/$userId")({
  validateSearch: (search: Record<string, unknown>) => ({
    username: typeof search.username === "string" ? search.username : undefined,
  }),
  head: () => ({ meta: [{ title: "Block creator — ViralSnap" }] }),
  component: BlockCreatorPage,
});

function BlockCreatorPage() {
  const { userId } = Route.useParams();
  const { username } = Route.useSearch();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/welcome", replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user && user.id === userId) {
      toast.error("You can't block yourself");
      navigate({ to: "/", replace: true });
    }
  }, [user, userId, navigate]);

  const confirmBlock = async () => {
    setBusy(true);
    try {
      const res = await toggleBlock({ data: { targetUserId: userId } });
      if (res.blocked) {
        rememberBlockedCreator(userId);
        toast.success(username ? `Blocked @${username}` : "Creator blocked");
      } else {
        toast.success(username ? `Unblocked @${username}` : "Creator unblocked");
      }
      navigate({ to: "/", replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to block creator");
    } finally {
      setBusy(false);
    }
  };

  if (loading || !user) {
    return <div className="min-h-dvh bg-background" />;
  }

  const label = username ? `@${username}` : "this creator";

  return (
    <div className="min-h-dvh bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/90 px-4 py-3 backdrop-blur">
        <button
          type="button"
          aria-label="Back"
          onClick={() => navigate({ to: "/" })}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary/60"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg font-bold">Block creator</h1>
      </header>

      <div className="mx-auto max-w-md space-y-6 px-4 py-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-rose-500/15 text-rose-400">
            <Ban className="h-8 w-8" />
          </div>
          <h2 className="font-display text-xl font-bold">Block {label}?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You won&apos;t see their videos in your feed, and you&apos;ll unfollow each other.
            They won&apos;t be notified that you blocked them.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={confirmBlock}
            disabled={busy}
            className="rounded-full bg-rose-500 text-white hover:bg-rose-500/90"
          >
            {busy ? "Blocking…" : `Block ${label}`}
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: "/" })} className="rounded-full">
            Cancel
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
