import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription } from "./dialog-C0PDZPpH.mjs";
import { B as Button } from "./button-DJnjoRwr.mjs";
import { c as cn } from "./utils-BB9uwBYF.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { a as Route$6, u as useAuth } from "./router-DDjFEyQJ.mjs";
import { c as compact } from "./format-DD3jW9wI.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { R as Radio, a as ArrowLeft, a6 as Users, U as Send, ab as X, v as Gift } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./server-CauiqJuS.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./client.server-U_pH-Evd.mjs";
import "./stripe.server-DSl7M_sI.mjs";
import "node:process";
import "events";
import "http";
import "https";
import "os";
const GIFTS = [
  { type: "fire", emoji: "🔥", label: "Fire", coins: 10 },
  { type: "lightning", emoji: "⚡", label: "Lightning", coins: 25 },
  { type: "heartburst", emoji: "💖", label: "Heart Burst", coins: 50 },
  { type: "rocket", emoji: "🚀", label: "Rocket", coins: 100 },
  { type: "diamond", emoji: "💎", label: "Diamond", coins: 250 },
  { type: "crown", emoji: "👑", label: "Crown", coins: 500 }
];
function GiftDialog({ open, onOpenChange, receiverId, receiverName, videoId, streamId }) {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = reactExports.useState(null);
  const [sending, setSending] = reactExports.useState(false);
  const gift = GIFTS.find((g) => g.type === selected);
  const balance = profile?.coin_balance ?? 0;
  const handleSend = async () => {
    if (!user) {
      onOpenChange(false);
      navigate({ to: "/welcome" });
      return;
    }
    if (!gift) return;
    if (balance < gift.coins) {
      toast.error("Not enough ViralCoins", {
        description: "Top up your wallet to keep the support flowing."
      });
      return;
    }
    setSending(true);
    const { error } = await supabase.rpc("send_gift", {
      _receiver_id: receiverId,
      _gift_type: gift.type,
      _coin_amount: gift.coins,
      _video_id: videoId ?? void 0,
      _stream_id: streamId ?? void 0
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${gift.emoji} ${gift.label} sent to @${receiverName}!`, {
      description: `${Math.floor(gift.coins * 0.7)} coins went straight to the creator.`
    });
    await refreshProfile();
    setSelected(null);
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display", children: [
        "Send a gift to @",
        receiverName
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        "Creators keep 70% of every gift. You have",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gold", children: balance.toLocaleString() }),
        " ViralCoins."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 py-2", children: GIFTS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setSelected(g.type),
        className: cn(
          "flex flex-col items-center gap-1 rounded-2xl border p-3 transition-all",
          selected === g.type ? "border-primary bg-accent shadow-glow" : "border-border bg-secondary/40 hover:border-primary/50"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: g.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: g.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-gold", children: g.coins })
        ]
      },
      g.type
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: handleSend,
        disabled: !gift || sending,
        className: "w-full rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90",
        children: !user ? "Sign in to gift" : gift ? `Send ${gift.emoji} for ${gift.coins} coins` : "Pick a gift"
      }
    )
  ] }) });
}
async function fetchStream(streamId) {
  const {
    data: stream
  } = await supabase.from("live_streams").select("*").eq("id", streamId).maybeSingle();
  if (!stream) return {
    stream: null,
    creator: null,
    bg: null
  };
  const {
    data: creator
  } = await supabase.from("profiles").select("id, username, display_name, avatar_url").eq("id", stream.creator_id).maybeSingle();
  const {
    data: vid
  } = await supabase.from("videos").select("media_url").eq("creator_id", stream.creator_id).eq("status", "published").order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  return {
    stream,
    creator,
    bg: vid?.media_url ?? null
  };
}
function WatchLivePage() {
  const {
    streamId
  } = Route$6.useParams();
  const {
    user,
    profile
  } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = reactExports.useState([]);
  const [draft, setDraft] = reactExports.useState("");
  const [showGift, setShowGift] = reactExports.useState(false);
  const scrollRef = reactExports.useRef(null);
  const {
    data
  } = useQuery({
    queryKey: ["stream", streamId],
    queryFn: () => fetchStream(streamId)
  });
  const stream = data?.stream;
  const creator = data?.creator;
  const isOwner = !!user && user.id === creator?.id;
  reactExports.useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: rows
      } = await supabase.from("live_messages").select("id, user_id, text").eq("stream_id", streamId).order("created_at", {
        ascending: true
      }).limit(100);
      if (!mounted || !rows) return;
      const ids = [...new Set(rows.map((r) => r.user_id))];
      const {
        data: profs
      } = await supabase.from("profiles").select("id, username").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      const nameMap = new Map((profs ?? []).map((p) => [p.id, p.username]));
      setMessages(rows.map((r) => ({
        ...r,
        username: nameMap.get(r.user_id)
      })));
    })();
    const channel = supabase.channel(`live:${streamId}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "live_messages",
      filter: `stream_id=eq.${streamId}`
    }, async (payload) => {
      const row = payload.new;
      const {
        data: p
      } = await supabase.from("profiles").select("username").eq("id", row.user_id).maybeSingle();
      setMessages((prev) => [...prev, {
        ...row,
        username: p?.username
      }]);
    }).subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [streamId]);
  reactExports.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);
  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    if (!user) return navigate({
      to: "/welcome"
    });
    setDraft("");
    const {
      error
    } = await supabase.from("live_messages").insert({
      stream_id: streamId,
      user_id: user.id,
      text
    });
    if (error) toast.error(error.message);
  };
  const endStream = async () => {
    await supabase.from("live_streams").update({
      status: "ended",
      ended_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", streamId);
    toast.success("Stream ended");
    navigate({
      to: "/live"
    });
  };
  if (data && !stream) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-12 w-12 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold", children: "This stream has ended" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/live", className: "rounded-full bg-gradient-fire px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow", children: "Browse live" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[100dvh] w-full overflow-hidden bg-black", children: [
    data?.bg ? /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: data.bg, autoPlay: true, loop: true, muted: true, playsInline: true, className: "absolute inset-0 h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-ember" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/live", className: "flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        creator && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/u/$username", params: {
          username: creator.username
        }, className: "flex items-center gap-2 rounded-full bg-black/40 py-1 pl-1 pr-3 backdrop-blur", children: [
          creator.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: creator.avatar_url, alt: creator.username, className: "h-7 w-7 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-full bg-gradient-fire text-xs font-bold text-primary-foreground", children: (creator.display_name ?? "C").charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-white", children: [
            "@",
            creator.username
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[10px] font-bold uppercase text-primary-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-white" }),
          " Live"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
          " ",
          compact(stream?.viewer_count ?? 0)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: scrollRef, className: "absolute inset-x-0 bottom-32 z-10 max-h-[45%] space-y-2 overflow-y-auto px-4 no-scrollbar", children: messages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[80%] rounded-2xl bg-black/40 px-3 py-1.5 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-gold", children: [
        "@",
        m.username ?? "viewer"
      ] }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-white", children: m.text })
    ] }, m.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 items-center gap-2 rounded-full bg-black/50 px-4 py-2 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: draft, onChange: (e) => setDraft(e.target.value), onKeyDown: (e) => e.key === "Enter" && send(), placeholder: "Say something nice…", className: "flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: send, className: "text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-5 w-5" }) })
      ] }),
      isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: endStream, className: "flex h-11 w-11 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow", "aria-label": "End stream", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowGift(true), className: "flex h-11 w-11 items-center justify-center rounded-full bg-gradient-fire text-primary-foreground shadow-glow", "aria-label": "Send gift", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5" }) })
    ] }),
    showGift && creator && /* @__PURE__ */ jsxRuntimeExports.jsx(GiftDialog, { open: showGift, onOpenChange: setShowGift, receiverId: creator.id, receiverName: creator.username, streamId })
  ] });
}
export {
  WatchLivePage as component
};
