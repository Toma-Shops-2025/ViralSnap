import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useInfiniteQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { V as VideoCard, i as isPlayableFeedVideo } from "./video-card-DsuuXof8.mjs";
import { B as BottomNav } from "./bottom-nav-Bx8ufx_y.mjs";
import { u as useAuth } from "./router-QVK_Sz8y.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import "../_libs/hls.js.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { c as Bell, S as Radio, s as Flame, a0 as Sparkles, l as Coins, v as Heart, a6 as Upload, ad as X, g as ChevronRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./format-DD3jW9wI.mjs";
import "./dialog-CU0WvJwq.mjs";
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
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./button-DA2gxxPy.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./textarea-DSyJ1nlY.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "./checkbox-SZ4443Uy.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./server-Dx3nuNLW.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-Co1FUz65.mjs";
import "../_libs/zod.mjs";
import "./client.server-U_pH-Evd.mjs";
import "./stripe.server-CgDo0qox.mjs";
import "node:process";
import "events";
import "http";
import "https";
import "os";
import "../_libs/tailwind-merge.mjs";
const FEED_PAGE_SIZE = 12;
function shuffle(input) {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
async function attachCreatorsAndLikes(videos) {
  if (videos.length === 0) return [];
  const creatorIds = [...new Set(videos.map((v) => v.creator_id))];
  const videoIds = videos.map((v) => v.id);
  const { data: profiles } = await supabase.from("profiles").select("id, username, display_name, avatar_url").in("id", creatorIds);
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  let likedSet = /* @__PURE__ */ new Set();
  const { data: auth } = await supabase.auth.getUser();
  if (auth.user) {
    const { data: likes } = await supabase.from("likes").select("video_id").eq("user_id", auth.user.id).in("video_id", videoIds);
    likedSet = new Set((likes ?? []).map((l) => l.video_id));
  }
  return videos.map((v) => ({
    ...v,
    creator: profileMap.get(v.creator_id) ?? null,
    liked: likedSet.has(v.id)
  }));
}
async function fetchFeedPage(page = 0, seed = 0) {
  const { count } = await supabase.from("videos").select("id", { count: "exact", head: true }).eq("status", "published");
  const total = count ?? 0;
  if (total === 0) return { items: [], hasMore: false, page };
  const seedOffset = seed % Math.max(1, total - FEED_PAGE_SIZE);
  const effectiveOffset = (seedOffset + page * FEED_PAGE_SIZE) % Math.max(1, total);
  const { data, error } = await supabase.from("videos").select("*").eq("status", "published").range(effectiveOffset, effectiveOffset + FEED_PAGE_SIZE - 1);
  if (error) throw error;
  let rows = (data ?? []).filter(isPlayableFeedVideo);
  return {
    items: shuffle(await attachCreatorsAndLikes(rows)),
    hasMore: total > (page + 1) * FEED_PAGE_SIZE,
    page
  };
}
async function fetchFollowingFeedPage(page = 0) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { items: [], hasMore: false, page };
  const { data: follows } = await supabase.from("follows").select("following_id").eq("follower_id", auth.user.id);
  const ids = (follows ?? []).map((f) => f.following_id);
  if (ids.length === 0) return { items: [], hasMore: false, page };
  const from = page * FEED_PAGE_SIZE;
  const to = from + FEED_PAGE_SIZE - 1;
  const { data, error } = await supabase.from("videos").select("*").eq("status", "published").in("creator_id", ids).order("created_at", { ascending: false }).range(from, to);
  if (error) throw error;
  const rows = (data ?? []).filter(isPlayableFeedVideo);
  return {
    items: shuffle(await attachCreatorsAndLikes(rows)),
    hasMore: (data ?? []).length === FEED_PAGE_SIZE,
    page
  };
}
const STORAGE_KEY = "viralsnap-onboarded";
const slides = [
  {
    icon: Flame,
    title: "Welcome to ViralSnap",
    body: "An endless feed of short videos from creators who actually get paid. Swipe up to keep watching — it never runs out."
  },
  {
    icon: Coins,
    title: "Earn & spend ViralCoins",
    body: "You start with 500 ViralCoins. Send gifts to creators you love, and earn coins when people support you."
  },
  {
    icon: Heart,
    title: "Follow & support creators",
    body: "Like, comment, follow, and gift. Your support puts real money in creators' pockets."
  },
  {
    icon: Upload,
    title: "Become a creator",
    body: "Post your own videos, add a link in bio, sell products in-feed, and cash out your earnings."
  }
];
function OnboardingWalkthrough() {
  const { user } = useAuth();
  const [open, setOpen] = reactExports.useState(false);
  const [step, setStep] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!user) {
      setOpen(false);
      return;
    }
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
      }
    } catch {
    }
  }, [user]);
  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
    }
    setOpen(false);
  };
  if (!open) return null;
  const slide = slides[step];
  const Icon = slide.icon;
  const isLast = step === slides.length - 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-sm rounded-t-3xl border border-border bg-card p-6 pb-8 shadow-glow sm:rounded-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: finish,
        className: "absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground",
        "aria-label": "Skip",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-fire shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-8 w-8 text-primary-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-5 font-display text-2xl font-bold", children: slide.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: slide.body }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex items-center justify-center gap-1.5", children: slides.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-border"}`
      },
      i
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: finish, className: "text-sm font-medium text-muted-foreground", children: "Skip" }),
      isLast ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: finish,
          className: "flex items-center gap-1 rounded-full bg-gradient-fire px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow",
          children: "Get started"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setStep((s) => s + 1),
          className: "flex items-center gap-1 rounded-full bg-gradient-fire px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow",
          children: [
            "Next ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
          ]
        }
      )
    ] })
  ] }) });
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("animate-pulse rounded-md bg-primary/10", className), ...props });
}
function FeedPage() {
  const [muted, setMuted] = reactExports.useState(true);
  const [tab, setTab] = reactExports.useState("foryou");
  const {
    user
  } = useAuth();
  const [sessionSeed] = reactExports.useState(() => Math.floor(Math.random() * 1e3));
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["feed", tab, user?.id, sessionSeed],
    initialPageParam: 0,
    queryFn: ({
      pageParam
    }) => tab === "following" ? fetchFollowingFeedPage(pageParam) : fetchFeedPage(pageParam, sessionSeed),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : void 0
  });
  const sentinelRef = reactExports.useRef(null);
  const [activeIndex, setActiveIndex] = reactExports.useState(0);
  const feedRef = reactExports.useRef(null);
  const items = reactExports.useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((page, pageIndex) => page.items.map((video) => ({
      video,
      key: `${video.id}-${pageIndex}`
    })));
  }, [data]);
  reactExports.useEffect(() => {
    const root = feedRef.current;
    if (!root || items.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const idx = Number(entry.target.dataset.idx);
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      });
    }, {
      root,
      threshold: [0.6]
    });
    root.querySelectorAll("[data-feed-item]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);
  reactExports.useEffect(() => {
    const el = sentinelRef.current;
    if (!el || items.length === 0 || !hasNextPage) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) {
        void fetchNextPage();
      }
    }, {
      rootMargin: "0px 0px 200% 0px"
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length, hasNextPage, isFetchingNextPage, fetchNextPage]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[100dvh] w-full overflow-hidden bg-black", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/activity", className: "flex w-16 items-center gap-1 text-white drop-shadow", "aria-label": "Activity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, { active: tab === "following", onClick: () => setTab("following"), children: "Following" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-px bg-white/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, { active: tab === "foryou", onClick: () => setTab("foryou"), children: "For You" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/live", className: "flex w-16 items-center justify-end gap-1 text-xs font-bold uppercase text-white drop-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-4 w-4 text-primary" }),
        " Live"
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-full w-full bg-secondary/40" }) }) : items.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: feedRef, className: "h-full snap-y snap-mandatory overflow-y-scroll no-scrollbar", children: [
      items.map(({
        video,
        key
      }, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-feed-item": true, "data-idx": idx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(VideoCard, { video, isActive: idx === activeIndex, isMuted: muted, onToggleMute: () => setMuted((m) => !m) }) }, key)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: sentinelRef, className: "h-px w-full", "aria-hidden": true }),
      isFetchingNextPage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-full bg-black", "aria-hidden": true })
    ] }) : tab === "following" ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyFollowing, { signedIn: !!user }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyFeed, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OnboardingWalkthrough, {})
  ] });
}
function TabButton({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: cn("font-display text-base font-bold tracking-tight drop-shadow transition-colors", active ? "text-white" : "text-white/60"), children });
}
function EmptyFollowing({
  signedIn
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center px-6 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-fire shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-10 w-10 text-primary-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-display text-2xl font-bold text-white", children: signedIn ? "Nothing here yet" : "Sign in to follow creators" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-xs text-sm text-white/70", children: signedIn ? "Follow creators to see their latest drops here." : "Create an account to build your own personal feed." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: signedIn ? "/discover" : "/welcome", className: "mt-6 rounded-full bg-gradient-fire px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow", children: signedIn ? "Discover creators" : "Get started" })
  ] });
}
function EmptyFeed() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center px-6 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-fire shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-10 w-10 text-primary-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-display text-2xl font-bold text-white", children: "The feed is warming up" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-xs text-sm text-white/70", children: "No videos yet. Be the first creator to drop something viral." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/upload", className: "mt-6 rounded-full bg-gradient-fire px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow", children: "Upload a video" })
  ] });
}
export {
  FeedPage as component
};
