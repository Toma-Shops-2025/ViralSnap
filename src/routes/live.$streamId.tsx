import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Gift, Users, Radio, X } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { GiftDialog } from "@/components/gift-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { compact } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/live/$streamId")({
  head: () => ({ meta: [{ title: "Live stream — ViralSnap" }] }),
  component: WatchLivePage,
});

type ChatMsg = { id: string; user_id: string; text: string; username?: string };

async function fetchStream(streamId: string) {
  const { data: stream } = await supabase
    .from("live_streams")
    .select("*")
    .eq("id", streamId)
    .maybeSingle();
  if (!stream) return { stream: null, creator: null, bg: null as string | null };
  const { data: creator } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .eq("id", stream.creator_id)
    .maybeSingle();
  const { data: vid } = await supabase
    .from("videos")
    .select("media_url")
    .eq("creator_id", stream.creator_id)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return { stream, creator, bg: vid?.media_url ?? null };
}

function WatchLivePage() {
  const { streamId } = Route.useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const [showGift, setShowGift] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({ queryKey: ["stream", streamId], queryFn: () => fetchStream(streamId) });
  const stream = data?.stream;
  const creator = data?.creator;
  const isOwner = !!user && user.id === creator?.id;

  // load history + realtime subscription
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: rows } = await supabase
        .from("live_messages")
        .select("id, user_id, text")
        .eq("stream_id", streamId)
        .order("created_at", { ascending: true })
        .limit(100);
      if (!mounted || !rows) return;
      const ids = [...new Set(rows.map((r) => r.user_id))];
      const { data: profs } = await supabase.from("profiles").select("id, username").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      const nameMap = new Map((profs ?? []).map((p) => [p.id, p.username]));
      setMessages(rows.map((r) => ({ ...r, username: nameMap.get(r.user_id) })));
    })();

    const channel = supabase
      .channel(`live:${streamId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_messages", filter: `stream_id=eq.${streamId}` },
        async (payload) => {
          const row = payload.new as { id: string; user_id: string; text: string };
          const { data: p } = await supabase.from("profiles").select("username").eq("id", row.user_id).maybeSingle();
          setMessages((prev) => [...prev, { ...row, username: p?.username }]);
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [streamId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    if (!user) return navigate({ to: "/auth" });
    setDraft("");
    const { error } = await supabase.from("live_messages").insert({ stream_id: streamId, user_id: user.id, text });
    if (error) toast.error(error.message);
  };

  const endStream = async () => {
    await supabase.from("live_streams").update({ status: "ended", ended_at: new Date().toISOString() }).eq("id", streamId);
    toast.success("Stream ended");
    navigate({ to: "/live" });
  };

  if (data && !stream) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-6 text-center">
        <Radio className="h-12 w-12 text-muted-foreground" />
        <p className="font-display text-lg font-bold">This stream has ended</p>
        <Link to="/live" className="rounded-full bg-gradient-fire px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
          Browse live
        </Link>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      {data?.bg ? (
        <video src={data.bg} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-ember" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

      {/* top bar */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Link to="/live" className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur">
          <ArrowLeft className="h-5 w-5 text-white" />
        </Link>
        <div className="flex items-center gap-2">
          {creator && (
            <Link to="/u/$username" params={{ username: creator.username }} className="flex items-center gap-2 rounded-full bg-black/40 py-1 pl-1 pr-3 backdrop-blur">
              {creator.avatar_url ? (
                <img src={creator.avatar_url} alt={creator.username} className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-fire text-xs font-bold text-primary-foreground">
                  {(creator.display_name ?? "C").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-semibold text-white">@{creator.username}</span>
            </Link>
          )}
          <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[10px] font-bold uppercase text-primary-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
            <Users className="h-3 w-3" /> {compact(stream?.viewer_count ?? 0)}
          </span>
        </div>
      </header>

      {/* chat overlay */}
      <div
        ref={scrollRef}
        className="absolute inset-x-0 bottom-32 z-10 max-h-[45%] space-y-2 overflow-y-auto px-4 no-scrollbar"
      >
        {messages.map((m) => (
          <div key={m.id} className="max-w-[80%] rounded-2xl bg-black/40 px-3 py-1.5 backdrop-blur">
            <span className="text-xs font-semibold text-gold">@{m.username ?? "viewer"}</span>{" "}
            <span className="text-sm text-white">{m.text}</span>
          </div>
        ))}
      </div>

      {/* bottom input */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-black/50 px-4 py-2 backdrop-blur">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Say something nice…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
          />
          <button onClick={send} className="text-white">
            <Send className="h-5 w-5" />
          </button>
        </div>
        {isOwner ? (
          <button
            onClick={endStream}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
            aria-label="End stream"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={() => setShowGift(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-fire text-primary-foreground shadow-glow"
            aria-label="Send gift"
          >
            <Gift className="h-5 w-5" />
          </button>
        )}
      </div>

      {showGift && creator && (
        <GiftDialog
          open={showGift}
          onOpenChange={setShowGift}
          receiverId={creator.id}
          receiverName={creator.username}
          streamId={streamId}
        />
      )}
    </div>
  );
}
