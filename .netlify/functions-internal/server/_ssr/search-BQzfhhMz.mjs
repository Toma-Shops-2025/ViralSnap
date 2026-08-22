import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { B as BottomNav } from "./bottom-nav-Bx8ufx_y.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { c as compact } from "./format-DD3jW9wI.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { a as ArrowLeft, U as Search, H as Hash, a8 as UserCheck, Q as Play, v as Heart } from "../_libs/lucide-react.mjs";
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
import "./router-QVK_Sz8y.mjs";
import "./server-Dx3nuNLW.mjs";
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
import "./stripe.server-CgDo0qox.mjs";
import "node:process";
import "events";
import "http";
import "https";
import "os";
async function runSearch(q) {
  const term = q.trim();
  if (!term) return {
    creators: [],
    videos: [],
    tags: []
  };
  const like = `%${term}%`;
  const [{
    data: creators
  }, {
    data: videos
  }] = await Promise.all([supabase.from("profiles").select("id, username, display_name, avatar_url, bio").or(`username.ilike.${like},display_name.ilike.${like}`).limit(12), supabase.from("videos").select("*").eq("status", "published").or(`title.ilike.${like},caption.ilike.${like}`).order("view_count", {
    ascending: false
  }).limit(30)]);
  const {
    data: tagVids
  } = await supabase.from("videos").select("tags").eq("status", "published").limit(200);
  const lower = term.replace(/^#/, "").toLowerCase();
  const tagSet = /* @__PURE__ */ new Set();
  (tagVids ?? []).forEach((v) => {
    (v.tags ?? []).forEach((t) => {
      if (t.toLowerCase().includes(lower)) tagSet.add(t);
    });
  });
  return {
    creators: creators ?? [],
    videos: videos ?? [],
    tags: [...tagSet].slice(0, 12)
  };
}
function SearchPage() {
  const [q, setQ] = reactExports.useState("");
  const {
    data
  } = useQuery({
    queryKey: ["search", q],
    queryFn: () => runSearch(q),
    enabled: q.trim().length > 0
  });
  const hasResults = (data?.creators.length ?? 0) + (data?.videos.length ?? 0) + (data?.tags.length ?? 0) > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[100dvh] pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/discover", className: "flex h-9 w-9 items-center justify-center rounded-full bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { autoFocus: true, value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search creators, videos, #tags", className: "rounded-full bg-card pl-9" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl space-y-6 px-4 py-4", children: [
      !q.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-16 text-center text-sm text-muted-foreground", children: "Find creators, videos, and trending hashtags." }),
      q.trim() && !hasResults && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "py-16 text-center text-sm text-muted-foreground", children: [
        "No results for “",
        q,
        "”."
      ] }),
      (data?.tags.length ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground", children: "Hashtags" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: data?.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 rounded-full border border-gold/40 bg-card px-3 py-1.5 text-sm font-medium text-gold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5" }),
          t
        ] }, t)) })
      ] }),
      (data?.creators.length ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground", children: "Creators" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: data?.creators.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/u/$username", params: {
          username: c.username
        }, className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-3", children: [
          c.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.avatar_url, alt: c.username, className: "h-11 w-11 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-full bg-gradient-fire text-base font-bold text-primary-foreground", children: c.display_name.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold", children: c.display_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-xs text-muted-foreground", children: [
              "@",
              c.username
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-4 w-4 text-muted-foreground" })
        ] }, c.id)) })
      ] }),
      (data?.videos.length ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground", children: "Videos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1", children: data?.videos.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[9/14] overflow-hidden rounded-lg bg-card", children: [
          v.cover_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: v.cover_url, alt: v.title, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: v.media_url ?? void 0, muted: true, playsInline: true, preload: "metadata", className: "h-full w-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-1.5 left-1.5 right-1.5 flex items-center gap-2 text-[10px] text-white/90", children: [
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
        ] }, v.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  SearchPage as component
};
