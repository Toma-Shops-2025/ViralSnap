import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useInfiniteQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { V as VideoCard, i as isPlayableFeedVideo } from "./video-card-Dt7OqCgs.mjs";
import { B as BottomNav } from "./bottom-nav-5QQReJYK.mjs";
import { u as useAuth } from "./router-DDjFEyQJ.mjs";
import { c as cn } from "./utils-BB9uwBYF.mjs";
import { g as getBlockedCreatorIds } from "./blocked-creators-DzSNU48T.mjs";
import "../_libs/hls.js.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { d as Bell, a9 as VolumeX, a8 as Volume2, R as Radio, u as Flame, Z as Sparkles, m as Coins, x as Heart, a2 as Upload, ab as X, h as ChevronRight } from "../_libs/lucide-react.mjs";
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
import "./dialog-C0PDZPpH.mjs";
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
import "./button-DJnjoRwr.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./textarea-CgEwOx0M.mjs";
import "./radio-group-CICG3f2N.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "./checkbox-B4QQ4Tul.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./safety.functions-Cq86SRs9.mjs";
import "./server-CauiqJuS.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-DPXRLhra.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "./client.server-U_pH-Evd.mjs";
import "./stripe.server-DSl7M_sI.mjs";
import "node:process";
import "events";
import "http";
import "https";
import "os";
import "../_libs/tailwind-merge.mjs";
function createRng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = Math.imul(s, 1664525) + 1013904223 >>> 0;
    return s / 4294967296;
  };
}
function shuffleWithSeed(input, seed) {
  const arr = [...input];
  const rand = createRng(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function newSessionSeed() {
  return (Date.now() ^ Math.floor(Math.random() * 2147483647)) >>> 0;
}
const FEED_PAGE_SIZE = 12;
const BATCH = 500;
const shuffledLibraryCache = /* @__PURE__ */ new Map();
const followingLibraryCache = /* @__PURE__ */ new Map();
async function fetchAllPublishedVideos() {
  const rows = [];
  for (let from = 0; ; from += BATCH) {
    const { data, error } = await supabase.from("videos").select("*").eq("status", "published").order("created_at", { ascending: false }).range(from, from + BATCH - 1);
    if (error) throw error;
    const batch = data ?? [];
    rows.push(...batch);
    if (batch.length < BATCH) break;
  }
  return rows.filter(isPlayableFeedVideo);
}
async function getShuffledForYouLibrary(seed) {
  const hit = shuffledLibraryCache.get(seed);
  if (hit) return hit;
  const shuffled = shuffleWithSeed(await fetchAllPublishedVideos(), seed);
  shuffledLibraryCache.set(seed, shuffled);
  return shuffled;
}
async function attachCreatorsAndLikes(videos) {
  if (videos.length === 0) return [];
  const creatorIds = [...new Set(videos.map((v) => v.creator_id))];
  const videoIds = videos.map((v) => v.id);
  let profiles = null;
  const withBan = await supabase.from("profiles").select("id, username, display_name, avatar_url, is_banned").in("id", creatorIds);
  if (withBan.error && /is_banned/i.test(withBan.error.message)) {
    const fallback = await supabase.from("profiles").select("id, username, display_name, avatar_url").in("id", creatorIds);
    profiles = fallback.data;
  } else {
    profiles = withBan.data;
  }
  const profileMap = new Map(
    (profiles ?? []).filter((p) => !p.is_banned).map((p) => [p.id, p])
  );
  let likedSet = /* @__PURE__ */ new Set();
  const { data: auth } = await supabase.auth.getUser();
  if (auth.user) {
    const { data: likes } = await supabase.from("likes").select("video_id").eq("user_id", auth.user.id).in("video_id", videoIds);
    likedSet = new Set((likes ?? []).map((l) => l.video_id));
  }
  return videos.filter((v) => profileMap.has(v.creator_id)).map((v) => ({
    ...v,
    creator: profileMap.get(v.creator_id) ?? null,
    liked: likedSet.has(v.id)
  }));
}
async function fetchFeedPage(page = 0, seed = 0) {
  const library = await getShuffledForYouLibrary(seed);
  const from = page * FEED_PAGE_SIZE;
  const slice = library.slice(from, from + FEED_PAGE_SIZE);
  return {
    items: await attachCreatorsAndLikes(slice),
    hasMore: from + FEED_PAGE_SIZE < library.length,
    page
  };
}
async function fetchFollowingFeedPage(page = 0, seed = 0) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { items: [], hasMore: false, page };
  const cacheKey = `${auth.user.id}:${seed}`;
  let library = followingLibraryCache.get(cacheKey);
  if (!library) {
    const { data: follows } = await supabase.from("follows").select("following_id").eq("follower_id", auth.user.id);
    const ids = (follows ?? []).map((f) => f.following_id);
    if (ids.length === 0) return { items: [], hasMore: false, page };
    const rows = [];
    for (let from2 = 0; ; from2 += BATCH) {
      const { data, error } = await supabase.from("videos").select("*").eq("status", "published").in("creator_id", ids).order("created_at", { ascending: false }).range(from2, from2 + BATCH - 1);
      if (error) throw error;
      const batch = data ?? [];
      rows.push(...batch);
      if (batch.length < BATCH) break;
    }
    library = shuffleWithSeed(rows.filter(isPlayableFeedVideo), seed);
    followingLibraryCache.set(cacheKey, library);
  }
  const from = page * FEED_PAGE_SIZE;
  const slice = library.slice(from, from + FEED_PAGE_SIZE);
  return {
    items: await attachCreatorsAndLikes(slice),
    hasMore: from + FEED_PAGE_SIZE < library.length,
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
  const [volume, setVolume] = reactExports.useState(1);
  const [tab, setTab] = reactExports.useState("foryou");
  const {
    user
  } = useAuth();
  const unmuteFeed = () => {
    setMuted(false);
    setVolume(1);
  };
  const toggleMute = () => {
    if (muted) unmuteFeed();
    else setMuted(true);
  };
  const setFeedVolume = (v) => {
    setVolume(v);
    if (v > 0) {
      setMuted(false);
    } else {
      setMuted(true);
    }
  };
  const [sessionSeed] = reactExports.useState(() => newSessionSeed());
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
    }) => tab === "following" ? fetchFollowingFeedPage(pageParam, sessionSeed) : fetchFeedPage(pageParam, sessionSeed),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : void 0
  });
  const sentinelRef = reactExports.useRef(null);
  const [activeIndex, setActiveIndex] = reactExports.useState(0);
  const feedRef = reactExports.useRef(null);
  const [blockedTick, setBlockedTick] = reactExports.useState(0);
  reactExports.useEffect(() => {
    setBlockedTick((t) => t + 1);
    const onFocus = () => setBlockedTick((t) => t + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);
  const items = reactExports.useMemo(() => {
    const blocked = new Set(getBlockedCreatorIds());
    const pages = data?.pages ?? [];
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const page of pages) {
      for (const video of page.items) {
        if (blocked.has(video.creator_id) || seen.has(video.id)) continue;
        seen.add(video.id);
        out.push({
          video,
          key: video.id
        });
      }
    }
    return out;
  }, [data, blockedTick]);
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-4 pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-auto flex w-16 flex-col items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/activity", className: "flex items-center justify-center text-white drop-shadow", "aria-label": "Activity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": muted ? "Unmute" : "Mute", onClick: toggleMute, className: "grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur", children: muted || volume === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: (e) => e.stopPropagation(), className: "flex h-24 w-9 flex-col items-center justify-center rounded-full bg-black/40 px-1 py-2 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 0, max: 1, step: 0.01, value: muted ? 0 : volume, onChange: (e) => {
          const v = Number.parseFloat(e.target.value);
          setFeedVolume(v);
        }, "aria-label": "Volume", className: "volume-slider h-20 w-1 cursor-pointer appearance-none rounded-full bg-white/25 [writing-mode:vertical-lr] [direction:rtl]" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-auto flex items-center gap-4 pt-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, { active: tab === "following", onClick: () => setTab("following"), children: "Following" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-px bg-white/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, { active: tab === "foryou", onClick: () => setTab("foryou"), children: "For You" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/live", className: "pointer-events-auto flex w-16 items-center justify-end gap-1 pt-0.5 text-xs font-bold uppercase text-white drop-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-4 w-4 text-primary" }),
        " Live"
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-full w-full bg-secondary/40" }) }) : items.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: feedRef, className: "h-full snap-y snap-mandatory overflow-y-scroll no-scrollbar", children: [
      items.map(({
        video,
        key
      }, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-feed-item": true, "data-idx": idx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(VideoCard, { video, isActive: idx === activeIndex, isMuted: muted, volume, onToggleMute: toggleMute }) }, key)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: sentinelRef, className: "h-px w-full", "aria-hidden": true }),
      isFetchingNextPage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-full bg-black", "aria-hidden": true }),
      !hasNextPage && items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-[40vh] items-center justify-center bg-black px-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.3em] text-white/35", children: "You’ve seen every video — reopen the app for a fresh shuffle" }) })
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
