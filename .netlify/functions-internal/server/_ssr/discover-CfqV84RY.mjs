import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as BottomNav } from "./bottom-nav-5QQReJYK.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { c as compact } from "./format-DD3jW9wI.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { T as Search, R as Radio, e as Briefcase, O as Play, x as Heart } from "../_libs/lucide-react.mjs";
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
import "./utils-BB9uwBYF.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./router-DDjFEyQJ.mjs";
import "./server-CauiqJuS.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./client.server-U_pH-Evd.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./stripe.server-DSl7M_sI.mjs";
import "node:process";
import "events";
import "http";
import "https";
import "os";
async function fetchTrending() {
  const {
    data: videos
  } = await supabase.from("videos").select("*").eq("status", "published").order("view_count", {
    ascending: false
  }).limit(60);
  const creatorIds = [...new Set((videos ?? []).map((v) => v.creator_id))];
  const {
    data: profiles
  } = await supabase.from("profiles").select("id, username, display_name, avatar_url").in("id", creatorIds.length ? creatorIds : ["00000000-0000-0000-0000-000000000000"]);
  return {
    videos: videos ?? [],
    profiles: new Map((profiles ?? []).map((p) => [p.id, p]))
  };
}
function DiscoverPage() {
  const {
    data
  } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending
  });
  const videos = data?.videos ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[100dvh] pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 space-y-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: "Discover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/search", className: "flex items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }),
        "Search videos, creators, #tags"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-1 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 grid grid-cols-2 gap-2 px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/live", className: "flex items-center gap-2 rounded-2xl bg-gradient-ember p-3 shadow-glow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-5 w-5 text-white" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-white", children: "Live now" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/80", children: "Watch & gift" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/campaigns", className: "flex items-center gap-2 rounded-2xl border border-gold/40 bg-card p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-5 w-5 text-gold" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: "Campaigns" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Get paid" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1", children: videos.map((v) => {
        const p = data?.profiles.get(v.creator_id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/u/$username", params: {
          username: p?.username ?? ""
        }, className: "group relative aspect-[9/14] overflow-hidden rounded-lg bg-card", children: [
          v.cover_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: v.cover_url, alt: v.title, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: v.media_url ?? void 0, muted: true, playsInline: true, preload: "metadata", className: "h-full w-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-1.5 left-1.5 right-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[11px] font-medium text-white", children: [
              "@",
              p?.username ?? "creator"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-white/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-2.5 w-2.5 fill-white" }),
                " ",
                compact(v.view_count)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-2.5 w-2.5 fill-white" }),
                " ",
                compact(v.like_count)
              ] })
            ] })
          ] })
        ] }, v.id);
      }) }),
      videos.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-16 text-center text-sm text-muted-foreground", children: "Nothing here yet. Check back soon." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  DiscoverPage as component
};
