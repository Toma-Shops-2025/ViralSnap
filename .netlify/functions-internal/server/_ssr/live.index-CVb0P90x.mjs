import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as BottomNav } from "./bottom-nav-Bx8ufx_y.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { u as useAuth } from "./router-QVK_Sz8y.mjs";
import { c as compact } from "./format-DD3jW9wI.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { S as Radio, R as Plus, aa as Users, s as Flame } from "../_libs/lucide-react.mjs";
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
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./server-Dx3nuNLW.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./client.server-U_pH-Evd.mjs";
import "./stripe.server-CgDo0qox.mjs";
import "node:process";
import "events";
import "http";
import "https";
import "os";
async function fetchStreams() {
  const {
    data: streams
  } = await supabase.from("live_streams").select("*").eq("status", "live").order("viewer_count", {
    ascending: false
  }).limit(50);
  const ids = [...new Set((streams ?? []).map((s) => s.creator_id))];
  const {
    data: profiles
  } = await supabase.from("profiles").select("id, username, display_name, avatar_url").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
  return {
    streams: streams ?? [],
    profiles: new Map((profiles ?? []).map((p) => [p.id, p]))
  };
}
function LivePage() {
  const {
    user,
    profile
  } = useAuth();
  const navigate = useNavigate();
  const [starting, setStarting] = reactExports.useState(false);
  const {
    data
  } = useQuery({
    queryKey: ["live-streams"],
    queryFn: fetchStreams,
    refetchInterval: 8e3
  });
  const goLive = async () => {
    if (!user) return navigate({
      to: "/welcome"
    });
    setStarting(true);
    const {
      data: stream,
      error
    } = await supabase.from("live_streams").insert({
      creator_id: user.id,
      title: `${profile?.display_name ?? "Creator"} is live!`,
      status: "live"
    }).select("id").single();
    setStarting(false);
    if (error || !stream) return toast.error(error?.message ?? "Could not start stream");
    navigate({
      to: "/live/$streamId",
      params: {
        streamId: stream.id
      }
    });
  };
  const streams = data?.streams ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[100dvh] pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "flex items-center gap-2 font-display text-2xl font-bold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-6 w-6 text-primary" }),
        " Live"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: goLive, disabled: starting, className: "flex items-center gap-1.5 rounded-full bg-gradient-fire px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Go Live"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-2xl px-4 py-4", children: streams.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center px-6 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-fire shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-10 w-10 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-6 font-display text-xl font-bold", children: "No one is live right now" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-xs text-sm text-muted-foreground", children: "Be the first to go live. Your fans get notified and can gift you ViralCoins in real time." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: goLive, disabled: starting, className: "mt-6 rounded-full bg-gradient-fire px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60", children: "Start your stream" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: streams.map((s) => {
      const p = data?.profiles.get(s.creator_id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/live/$streamId", params: {
        streamId: s.id
      }, className: "group relative aspect-[9/14] overflow-hidden rounded-2xl bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-ember opacity-80" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-white" }),
          " Live"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
          " ",
          compact(s.viewer_count)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          p?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.avatar_url, alt: p.username, className: "h-8 w-8 rounded-full border border-white object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full border border-white bg-gradient-fire text-xs font-bold text-primary-foreground", children: (p?.display_name ?? "C").charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-xs font-semibold text-white", children: [
              "@",
              p?.username ?? "creator"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-0.5 text-[10px] text-gold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-2.5 w-2.5" }),
              " ",
              compact(s.total_gifts),
              " gifts"
            ] })
          ] })
        ] }) })
      ] }, s.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  LivePage as component
};
