import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Radio, Plus, Users, Flame } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { compact } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/live/")({
  head: () => ({
    meta: [
      { title: "Live — ViralSnap" },
      { name: "description", content: "Watch creators go live, chat in real time, and send ViralCoin gifts." },
    ],
  }),
  component: LivePage,
});

async function fetchStreams() {
  const { data: streams } = await supabase
    .from("live_streams")
    .select("*")
    .eq("status", "live")
    .order("viewer_count", { ascending: false })
    .limit(50);
  const ids = [...new Set((streams ?? []).map((s) => s.creator_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
  return {
    streams: streams ?? [],
    profiles: new Map((profiles ?? []).map((p) => [p.id, p])),
  };
}

function LivePage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const { data } = useQuery({ queryKey: ["live-streams"], queryFn: fetchStreams, refetchInterval: 8000 });

  const goLive = async () => {
    if (!user) return navigate({ to: "/auth" });
    setStarting(true);
    const { data: stream, error } = await supabase
      .from("live_streams")
      .insert({ creator_id: user.id, title: `${profile?.display_name ?? "Creator"} is live!`, status: "live" })
      .select("id")
      .single();
    setStarting(false);
    if (error || !stream) return toast.error(error?.message ?? "Could not start stream");
    navigate({ to: "/live/$streamId", params: { streamId: stream.id } });
  };

  const streams = data?.streams ?? [];

  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
          <Radio className="h-6 w-6 text-primary" /> Live
        </h1>
        <button
          onClick={goLive}
          disabled={starting}
          className="flex items-center gap-1.5 rounded-full bg-gradient-fire px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> Go Live
        </button>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-4">
        {streams.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-fire shadow-glow">
              <Radio className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="mt-6 font-display text-xl font-bold">No one is live right now</h2>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Be the first to go live. Your fans get notified and can gift you ViralCoins in real time.
            </p>
            <button
              onClick={goLive}
              disabled={starting}
              className="mt-6 rounded-full bg-gradient-fire px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              Start your stream
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {streams.map((s) => {
              const p = data?.profiles.get(s.creator_id);
              return (
                <Link
                  key={s.id}
                  to="/live/$streamId"
                  params={{ streamId: s.id }}
                  className="group relative aspect-[9/14] overflow-hidden rounded-2xl bg-card"
                >
                  <div className="absolute inset-0 bg-gradient-ember opacity-80" />
                  <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
                  </div>
                  <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                    <Users className="h-3 w-3" /> {compact(s.viewer_count)}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center gap-2">
                      {p?.avatar_url ? (
                        <img src={p.avatar_url} alt={p.username} className="h-8 w-8 rounded-full border border-white object-cover" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-gradient-fire text-xs font-bold text-primary-foreground">
                          {(p?.display_name ?? "C").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">@{p?.username ?? "creator"}</p>
                        <p className="flex items-center gap-0.5 text-[10px] text-gold">
                          <Flame className="h-2.5 w-2.5" /> {compact(s.total_gifts)} gifts
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
