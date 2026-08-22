import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as BottomNav } from "./bottom-nav-Bx8ufx_y.mjs";
import { u as useAuth } from "./router-QVK_Sz8y.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { t as timeAgo } from "./format-DD3jW9wI.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { a as ArrowLeft, c as Bell, t as Gift, K as MessageCircle, v as Heart, a9 as UserPlus } from "../_libs/lucide-react.mjs";
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
async function fetchActivity() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  const me = auth.user.id;
  const { data: myVideos } = await supabase.from("videos").select("id, cover_url").eq("creator_id", me);
  const myVideoIds = (myVideos ?? []).map((v) => v.id);
  const coverMap = new Map((myVideos ?? []).map((v) => [v.id, v.cover_url]));
  const safeIds = myVideoIds.length ? myVideoIds : ["00000000-0000-0000-0000-000000000000"];
  const [followsRes, likesRes, commentsRes, giftsRes] = await Promise.all([
    supabase.from("follows").select("id, follower_id, created_at").eq("following_id", me).order("created_at", { ascending: false }).limit(40),
    supabase.from("likes").select("id, user_id, video_id, created_at").in("video_id", safeIds).neq("user_id", me).order("created_at", { ascending: false }).limit(40),
    supabase.from("comments").select("id, user_id, video_id, text, created_at").in("video_id", safeIds).neq("user_id", me).order("created_at", { ascending: false }).limit(40),
    supabase.from("gifts").select("id, sender_id, video_id, coin_amount, created_at").eq("receiver_id", me).order("created_at", { ascending: false }).limit(40)
  ]);
  const follows = followsRes.data ?? [];
  const likes = likesRes.data ?? [];
  const comments = commentsRes.data ?? [];
  const gifts = giftsRes.data ?? [];
  const actorIds = [
    ...follows.map((f) => f.follower_id),
    ...likes.map((l) => l.user_id),
    ...comments.map((c) => c.user_id),
    ...gifts.map((g) => g.sender_id)
  ];
  const uniqueActorIds = [...new Set(actorIds)];
  let profileMap = /* @__PURE__ */ new Map();
  if (uniqueActorIds.length) {
    const { data: profs } = await supabase.from("profiles").select("id, username, display_name, avatar_url").in("id", uniqueActorIds);
    profileMap = new Map((profs ?? []).map((p) => [p.id, p]));
  }
  const items = [
    ...follows.map((f) => ({
      id: `follow-${f.id}`,
      kind: "follow",
      created_at: f.created_at,
      actor: profileMap.get(f.follower_id) ?? null
    })),
    ...likes.map((l) => ({
      id: `like-${l.id}`,
      kind: "like",
      created_at: l.created_at,
      actor: profileMap.get(l.user_id) ?? null,
      videoId: l.video_id,
      coverUrl: coverMap.get(l.video_id) ?? null
    })),
    ...comments.map((c) => ({
      id: `comment-${c.id}`,
      kind: "comment",
      created_at: c.created_at,
      actor: profileMap.get(c.user_id) ?? null,
      videoId: c.video_id,
      coverUrl: coverMap.get(c.video_id) ?? null,
      text: c.text
    })),
    ...gifts.map((g) => ({
      id: `gift-${g.id}`,
      kind: "gift",
      created_at: g.created_at,
      actor: profileMap.get(g.sender_id) ?? null,
      videoId: g.video_id ?? void 0,
      coverUrl: g.video_id ? coverMap.get(g.video_id) ?? null : null,
      coinAmount: g.coin_amount
    }))
  ];
  items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return items.slice(0, 60);
}
function ActivityPage() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/welcome",
      replace: true
    });
  }, [loading, user, navigate]);
  const {
    data: items = [],
    isLoading
  } = useQuery({
    queryKey: ["activity", user?.id],
    enabled: !!user,
    queryFn: fetchActivity
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[100dvh] pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex h-9 w-9 items-center justify-center rounded-full bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: "Activity" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md px-4 py-3", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-16 text-center text-sm text-muted-foreground", children: "Loading…" }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold", children: "No activity yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-xs text-sm text-muted-foreground", children: "Likes, comments, new followers, and gifts will show up here." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityRow, { item }, item.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
const ICONS = {
  follow: {
    Icon: UserPlus,
    cls: "bg-accent text-primary"
  },
  like: {
    Icon: Heart,
    cls: "bg-accent text-primary"
  },
  comment: {
    Icon: MessageCircle,
    cls: "bg-secondary text-foreground"
  },
  gift: {
    Icon: Gift,
    cls: "bg-accent text-gold"
  }
};
function ActivityRow({
  item
}) {
  const {
    Icon,
    cls
  } = ICONS[item.kind];
  const name = item.actor?.username ?? "someone";
  const message = item.kind === "follow" ? "started following you" : item.kind === "like" ? "liked your video" : item.kind === "comment" ? `commented: ${item.text ?? ""}` : `sent you a gift — ${item.coinAmount ?? 0} coins`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      item.actor?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.actor.avatar_url, alt: name, className: "h-11 w-11 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-full bg-gradient-fire text-base font-bold text-primary-foreground", children: (item.actor?.display_name ?? "U").charAt(0).toUpperCase() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-card ${cls}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-sm", children: [
        item.actor ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/u/$username", params: {
          username: name
        }, className: "font-semibold", children: [
          "@",
          name
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
          "@",
          name
        ] }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: timeAgo(item.created_at) })
    ] }),
    item.coverUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.coverUrl, alt: "video", className: "h-12 w-9 flex-shrink-0 rounded-md object-cover" })
  ] });
}
export {
  ActivityPage as component
};
