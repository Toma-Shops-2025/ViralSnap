import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { b as createRouter, a as createRootRouteWithContext, e as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, b as getServerFnById } from "./server-Dx3nuNLW.mjs";
import { s as supabaseAdmin } from "./client.server-U_pH-Evd.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { v as verifyWebhook } from "./stripe.server-CgDo0qox.mjs";
import process$1 from "node:process";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/stripe.mjs";
import "events";
import "http";
import "https";
import "os";
const AuthContext = reactExports.createContext(void 0);
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState(null);
  const [profile, setProfile] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const loadProfile = reactExports.useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    setProfile(data ?? null);
  }, []);
  const refreshProfile = reactExports.useCallback(async () => {
    await loadProfile(user?.id);
  }, [loadProfile, user?.id]);
  reactExports.useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setTimeout(() => loadProfile(nextSession?.user?.id), 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      loadProfile(data.session?.user?.id).finally(() => setLoading(false));
    });
    return () => subscription.unsubscribe();
  }, [loadProfile]);
  const signOut = reactExports.useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthContext.Provider,
    {
      value: { user, session, profile, loading, refreshProfile, signOut },
      children
    }
  );
}
function useAuth() {
  const ctx = reactExports.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
const STORAGE_KEY = "viralsnap-theme";
const ThemeContext = reactExports.createContext(void 0);
function getSystemTheme() {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyTheme(resolved) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}
function ThemeProvider({ children }) {
  const [theme, setThemeState] = reactExports.useState("system");
  const [resolvedTheme, setResolvedTheme] = reactExports.useState("dark");
  reactExports.useEffect(() => {
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      setThemeState(stored);
    }
  }, []);
  reactExports.useEffect(() => {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(resolved);
    applyTheme(resolved);
    if (theme !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = mq.matches ? "dark" : "light";
      setResolvedTheme(next);
      applyTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);
  const setTheme = reactExports.useCallback((next) => {
    setThemeState(next);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeContext.Provider, { value: { theme, resolvedTheme, setTheme }, children });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const appCss = "/assets/styles-DHyLRBDD.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$q = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "ViralSnap — Short Video, Real Money" },
      { name: "description", content: "Create, share, and monetize short videos on ViralSnap." },
      { name: "theme-color", content: "#000000" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$q.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-black text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-center", richColors: true })
  ] }) }) }) });
}
const $$splitComponentImporter$m = () => import("./welcome-v3Z_9_WQ.mjs");
const Route$p = createFileRoute("/welcome")({
  head: () => ({
    meta: [{
      title: "Welcome to ViralSnap — Go Viral in Seconds"
    }, {
      name: "description",
      content: "ViralSnap is the short-video platform built for creators to earn real money and grow their audience."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./wallet-BIlA52ul.mjs");
const Route$o = createFileRoute("/wallet")({
  head: () => ({
    meta: [{
      title: "Wallet — ViralSnap"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./upload-DO1AHwld.mjs");
const Route$n = createFileRoute("/upload")({
  head: () => ({
    meta: [{
      title: "Upload — ViralSnap"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./terms-CrwnFxMK.mjs");
const Route$m = createFileRoute("/terms")({
  head: () => ({
    meta: [{
      title: "Terms of Service — ViralSnap"
    }, {
      name: "description",
      content: "The rules for using ViralSnap — accounts, content, payments, and AI features."
    }, {
      property: "og:title",
      content: "Terms of Service — ViralSnap"
    }, {
      property: "og:description",
      content: "Rules for using ViralSnap."
    }, {
      property: "og:url",
      content: "https://viralsnap.online/terms"
    }],
    links: [{
      rel: "canonical",
      href: "https://viralsnap.online/terms"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./share-D1u3slQD.mjs");
const Route$l = createFileRoute("/share")({
  head: () => ({
    meta: [{
      title: "Share ViralSnap"
    }, {
      name: "description",
      content: "Share ViralSnap with friends — scan the QR code or copy the link to viralsnap.online."
    }, {
      property: "og:title",
      content: "Share ViralSnap"
    }, {
      property: "og:description",
      content: "Scan the QR code or copy the link to join ViralSnap."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./settings-BGENa_gr.mjs");
const Route$k = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "Settings — ViralSnap"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./search-BQzfhhMz.mjs");
const Route$j = createFileRoute("/search")({
  head: () => ({
    meta: [{
      title: "Search — ViralSnap"
    }, {
      name: "description",
      content: "Search ViralSnap creators, videos, and hashtags."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./refunds-DVC56oAr.mjs");
const Route$i = createFileRoute("/refunds")({
  head: () => ({
    meta: [{
      title: "Refund Policy — ViralSnap"
    }, {
      name: "description",
      content: "Refund and cancellation policy for ViralSnap Pro, creator subscriptions, coins, and gifts."
    }, {
      property: "og:title",
      content: "Refund Policy — ViralSnap"
    }, {
      property: "og:description",
      content: "How refunds and cancellations work on ViralSnap."
    }, {
      property: "og:url",
      content: "https://viralsnap.online/refunds"
    }],
    links: [{
      rel: "canonical",
      href: "https://viralsnap.online/refunds"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./privacy-BDL70LWu.mjs");
const Route$h = createFileRoute("/privacy")({
  head: () => ({
    meta: [{
      title: "Privacy Policy — ViralSnap"
    }, {
      name: "description",
      content: "How ViralSnap collects, uses, and protects your data."
    }, {
      property: "og:title",
      content: "Privacy Policy — ViralSnap"
    }, {
      property: "og:description",
      content: "How ViralSnap collects, uses, and protects your data."
    }, {
      property: "og:url",
      content: "https://viralsnap.online/privacy"
    }],
    links: [{
      rel: "canonical",
      href: "https://viralsnap.online/privacy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./guidelines-D-5faCxR.mjs");
const Route$g = createFileRoute("/guidelines")({
  head: () => ({
    meta: [{
      title: "Community Guidelines — ViralSnap"
    }, {
      name: "description",
      content: "What's allowed and what isn't on ViralSnap, and how we keep the platform safe."
    }, {
      property: "og:title",
      content: "Community Guidelines — ViralSnap"
    }, {
      property: "og:description",
      content: "What's allowed and what isn't on ViralSnap."
    }, {
      property: "og:url",
      content: "https://viralsnap.online/guidelines"
    }],
    links: [{
      rel: "canonical",
      href: "https://viralsnap.online/guidelines"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./earnings-yC0_nBTd.mjs");
const Route$f = createFileRoute("/earnings")({
  head: () => ({
    meta: [{
      title: "Earnings — ViralSnap"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./dmca-DmoEu7s6.mjs");
const Route$e = createFileRoute("/dmca")({
  head: () => ({
    meta: [{
      title: "DMCA & Content Policy — ViralSnap"
    }, {
      name: "description",
      content: "How to report copyright infringement or other policy violations on ViralSnap."
    }, {
      property: "og:title",
      content: "DMCA & Content Policy — ViralSnap"
    }, {
      property: "og:description",
      content: "Report copyright infringement on ViralSnap."
    }, {
      property: "og:url",
      content: "https://viralsnap.online/dmca"
    }],
    links: [{
      rel: "canonical",
      href: "https://viralsnap.online/dmca"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./discover-D5METZkG.mjs");
const Route$d = createFileRoute("/discover")({
  head: () => ({
    meta: [{
      title: "Discover — ViralSnap"
    }, {
      name: "description",
      content: "Discover trending creators and viral videos on ViralSnap."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./contact-BQY79BNL.mjs");
const Route$c = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact & Support — ViralSnap"
    }, {
      name: "description",
      content: "Get in touch with ViralSnap support, report abuse, or send a copyright notice."
    }, {
      property: "og:title",
      content: "Contact & Support — ViralSnap"
    }, {
      property: "og:description",
      content: "Contact ViralSnap support."
    }, {
      property: "og:url",
      content: "https://viralsnap.online/contact"
    }],
    links: [{
      rel: "canonical",
      href: "https://viralsnap.online/contact"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./child-safety-BVBaJjGL.mjs");
const Route$b = createFileRoute("/child-safety")({
  head: () => ({
    meta: [{
      title: "Child Safety Standards — ViralSnap"
    }, {
      name: "description",
      content: "ViralSnap's standards against child sexual abuse and exploitation (CSAE), including our prohibitions, reporting, and enforcement practices."
    }, {
      property: "og:title",
      content: "Child Safety Standards — ViralSnap"
    }, {
      property: "og:description",
      content: "ViralSnap's standards against child sexual abuse and exploitation (CSAE)."
    }, {
      property: "og:url",
      content: "https://viralsnap.online/child-safety"
    }],
    links: [{
      rel: "canonical",
      href: "https://viralsnap.online/child-safety"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./campaigns-DHdNWxZF.mjs");
const Route$a = createFileRoute("/campaigns")({
  head: () => ({
    meta: [{
      title: "Brand Campaigns — ViralSnap"
    }, {
      name: "description",
      content: "Browse paid brand campaigns and apply to get paid for your content on ViralSnap."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./auth-D0p1lcSt.mjs");
const Route$9 = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Join ViralSnap — Sign in"
    }, {
      name: "description",
      content: "Create your ViralSnap creator account and start earning."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./activity-DNKyAwxR.mjs");
const Route$8 = createFileRoute("/activity")({
  head: () => ({
    meta: [{
      title: "Activity — ViralSnap"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./account-deletion-DJgG9aj2.mjs");
const Route$7 = createFileRoute("/account-deletion")({
  head: () => ({
    meta: [{
      title: "Delete your ViralSnap account"
    }, {
      name: "description",
      content: "Instructions for permanently deleting your ViralSnap account and all associated data."
    }, {
      property: "og:title",
      content: "Delete your ViralSnap account"
    }, {
      property: "og:description",
      content: "How to permanently delete your ViralSnap account."
    }, {
      property: "og:url",
      content: "https://viralsnap.online/account-deletion"
    }],
    links: [{
      rel: "canonical",
      href: "https://viralsnap.online/account-deletion"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./index-D3Qbwylo.mjs");
const Route$6 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "ViralSnap — Creators Deserve More"
    }, {
      name: "description",
      content: "Scroll the ViralSnap feed: short videos from creators who earn real money with ViralCoins and sell products in-feed."
    }, {
      property: "og:title",
      content: "ViralSnap — Creators Deserve More"
    }, {
      property: "og:description",
      content: "The short-video platform that pays creators what they're worth."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./live.index-CVb0P90x.mjs");
const Route$5 = createFileRoute("/live/")({
  head: () => ({
    meta: [{
      title: "Live — ViralSnap"
    }, {
      name: "description",
      content: "Watch creators go live, chat in real time, and send ViralCoin gifts."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getPublicProfile = createServerFn({
  method: "GET"
}).inputValidator((data) => data).handler(createSsrRpc("4bf0d871c1b1448bf83ecae994053dfefc9592abecd0f940b98c0f46242944f0"));
const $$splitComponentImporter$1 = () => import("./u._username-Bmwwaob7.mjs");
const Route$4 = createFileRoute("/u/$username")({
  loader: ({
    params
  }) => getPublicProfile({
    data: {
      username: params.username
    }
  }),
  head: ({
    loaderData
  }) => {
    const p = loaderData?.profile;
    if (!p) return {
      meta: [{
        title: "Creator — ViralSnap"
      }]
    };
    const title = `${p.display_name} (@${p.username}) — ViralSnap`;
    const description = p.bio && p.bio.trim() ? p.bio.trim().slice(0, 160) : `Watch ${p.display_name}'s short videos and support them on ViralSnap.`;
    const url = `https://viralsnap.online/u/${p.username}`;
    const image = p.avatar_url ?? void 0;
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: description
      }, {
        property: "og:title",
        title
      }, {
        property: "og:description",
        content: description
      }, {
        property: "og:type",
        content: "profile"
      }, {
        property: "og:url",
        content: url
      }, ...image ? [{
        property: "og:image",
        content: image
      }] : [], {
        name: "twitter:card",
        content: image ? "summary_large_image" : "summary"
      }, {
        name: "twitter:title",
        content: title
      }, {
        name: "twitter:description",
        content: description
      }, ...image ? [{
        name: "twitter:image",
        content: image
      }] : []],
      links: [{
        rel: "canonical",
        href: url
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./live._streamId-KR-f7Hr6.mjs");
const Route$3 = createFileRoute("/live/$streamId")({
  head: () => ({
    meta: [{
      title: "Live stream — ViralSnap"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const BUCKETS = ["avatars", "videos", "covers"];
async function restoreViralSnapPlayback() {
  const created = [];
  const existing = [];
  for (const id of BUCKETS) {
    const { data: bucket } = await supabaseAdmin.storage.getBucket(id);
    if (bucket) {
      existing.push(id);
      continue;
    }
    const { error } = await supabaseAdmin.storage.createBucket(id, { public: true });
    if (error && !/already exists/i.test(error.message)) {
      throw new Error(`Bucket ${id}: ${error.message}`);
    }
    created.push(id);
  }
  const { count: publishedBefore } = await supabaseAdmin.from("videos").select("id", { count: "exact", head: true }).eq("status", "published");
  const { error: hideErr } = await supabaseAdmin.from("videos").update({ status: "removed" }).eq("status", "published").is("mux_playback_id", null);
  if (hideErr) throw new Error(hideErr.message);
  const { count: publishedAfter } = await supabaseAdmin.from("videos").select("id", { count: "exact", head: true }).eq("status", "published");
  return {
    buckets: { created, existing },
    publishedBefore: publishedBefore ?? 0,
    publishedAfter: publishedAfter ?? 0,
    note: "Storage policies still require restore-playback.sql if uploads fail. Re-upload videos to repopulate the feed."
  };
}
const Route$2 = createFileRoute("/api/admin/restore-media")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.MEDIA_RESTORE_SECRET;
        if (!secret) {
          return new Response(JSON.stringify({ error: "MEDIA_RESTORE_SECRET not configured" }), {
            status: 503,
            headers: { "Content-Type": "application/json" }
          });
        }
        let body = {};
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        if (body.secret !== secret) {
          return new Response(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
            headers: { "Content-Type": "application/json" }
          });
        }
        try {
          const result = await restoreViralSnapPlayback();
          return new Response(JSON.stringify({ ok: true, ...result }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } catch (e) {
          console.error("restore-media failed:", e);
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Restore failed" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }
  }
});
let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return _supabase;
}
async function handleCheckoutCompleted(session) {
  if (session.mode && session.mode !== "payment") return;
  if (session.payment_status !== "paid") return;
  const userId = session.metadata?.userId;
  const coins = Number(session.metadata?.coins ?? 0);
  if (!userId || !coins) {
    console.error("Checkout session missing userId/coins metadata", session.id);
    return;
  }
  const { error } = await getSupabase().rpc("credit_coin_purchase", {
    _user_id: userId,
    _coins: coins,
    _amount_cents: session.amount_total ?? 0,
    _session_id: session.id
  });
  if (error) {
    console.error("Failed to credit coins:", error);
    throw new Error(error.message);
  }
}
async function handleProSubscriptionUpsert(subscription, env) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("Pro subscription missing userId metadata", subscription.id);
    return;
  }
  const item = subscription.items?.data?.[0];
  const priceId = item?.price?.lookup_key || item?.price?.id || "";
  const periodEnd = item?.current_period_end ?? subscription.current_period_end ?? null;
  await getSupabase().from("pro_subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      price_id: priceId,
      status: subscription.status,
      current_period_end: periodEnd ? new Date(periodEnd * 1e3).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      environment: env,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    { onConflict: "stripe_subscription_id" }
  );
}
async function handleSubscriptionUpsert(subscription, env) {
  const meta = subscription.metadata ?? {};
  const item = subscription.items?.data?.[0];
  const priceLookup = item?.price?.lookup_key || "";
  if (meta.plan === "pro" || priceLookup === "pro_monthly") {
    await handleProSubscriptionUpsert(subscription, env);
    return;
  }
  const subscriberId = meta.userId;
  const creatorId = meta.creatorId;
  const coins = Number(meta.coins ?? 0);
  if (!subscriberId || !creatorId) {
    console.error("Subscription missing subscriber/creator metadata", subscription.id);
    return;
  }
  const priceId = item?.price?.lookup_key || item?.price?.id || "";
  const amountCents = item?.price?.unit_amount ?? 0;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end ?? null;
  await getSupabase().from("creator_subscriptions").upsert(
    {
      subscriber_id: subscriberId,
      creator_id: creatorId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      price_id: priceId,
      monthly_coins: coins,
      status: subscription.status,
      current_period_end: periodEnd ? new Date(periodEnd * 1e3).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      environment: env,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    { onConflict: "stripe_subscription_id" }
  );
  const latestInvoice = typeof subscription.latest_invoice === "string" ? subscription.latest_invoice : subscription.latest_invoice?.id;
  if (latestInvoice && coins > 0 && (subscription.status === "active" || subscription.status === "trialing")) {
    const { error } = await getSupabase().rpc("credit_subscription_invoice", {
      _creator_id: creatorId,
      _subscriber_id: subscriberId,
      _coins: coins,
      _amount_cents: amountCents,
      _invoice_id: latestInvoice
    });
    if (error) console.error("Failed to credit subscription invoice:", error);
  }
}
async function handleSubscriptionDeleted(subscription, env) {
  await getSupabase().from("pro_subscriptions").update({ status: "canceled", updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("stripe_subscription_id", subscription.id).eq("environment", env);
  await getSupabase().from("creator_subscriptions").update({ status: "canceled", updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("stripe_subscription_id", subscription.id).eq("environment", env);
}
async function handleAccountUpdated(account) {
  const userId = account.metadata?.userId;
  const payoutsEnabled = !!account.payouts_enabled;
  const query = getSupabase().from("profiles").update({ payouts_enabled: payoutsEnabled });
  if (userId) {
    await query.eq("id", userId);
  } else {
    await query.eq("stripe_connect_account_id", account.id);
  }
}
async function handleWebhook(req, env) {
  const event = await verifyWebhook(req, env);
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionUpsert(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object, env);
      break;
    case "account.updated":
      await handleAccountUpdated(event.data.object);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}
const Route$1 = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook received with invalid env query parameter:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env = rawEnv;
        try {
          await handleWebhook(request, env);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      }
    }
  }
});
function getEnv(key) {
  const value = process$1.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
}
async function verifyMuxSignature(rawBody, header) {
  if (!header) return false;
  const secret = getEnv("MUX_WEBHOOK_SIGNING_SECRET");
  let timestamp;
  const signatures = [];
  for (const part of header.split(",")) {
    const [key2, value] = part.split("=", 2);
    if (key2 === "t") timestamp = value;
    if (key2 === "v1") signatures.push(value);
  }
  if (!timestamp || signatures.length === 0) return false;
  const age = Math.abs(Date.now() / 1e3 - Number(timestamp));
  if (Number.isNaN(age) || age > 300) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${rawBody}`)
  );
  const expected = Buffer.from(new Uint8Array(signed)).toString("hex");
  return signatures.includes(expected);
}
async function handleEvent(event) {
  const asset = event.data ?? {};
  const videoId = asset.passthrough;
  switch (event.type) {
    case "video.asset.ready": {
      if (!videoId) return;
      const playbackId = asset.playback_ids?.find((p) => p.policy === "public")?.id ?? asset.playback_ids?.[0]?.id ?? null;
      await supabaseAdmin.from("videos").update({
        mux_asset_id: asset.id ?? null,
        mux_playback_id: playbackId,
        mux_asset_status: "ready",
        status: "published"
      }).eq("id", videoId);
      break;
    }
    case "video.asset.errored": {
      if (!videoId) return;
      await supabaseAdmin.from("videos").update({ mux_asset_status: "errored", status: "errored" }).eq("id", videoId);
      break;
    }
    case "video.upload.cancelled":
    case "video.upload.errored": {
      const uploadId = asset.id ?? asset.upload_id;
      if (!uploadId) return;
      await supabaseAdmin.from("videos").update({ mux_asset_status: "errored", status: "errored" }).eq("mux_upload_id", uploadId);
      break;
    }
  }
}
const Route = createFileRoute("/api/public/mux/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const signature = request.headers.get("mux-signature");
        const valid = await verifyMuxSignature(body, signature);
        if (!valid) {
          return new Response("Invalid signature", { status: 401 });
        }
        try {
          await handleEvent(JSON.parse(body));
          return Response.json({ received: true });
        } catch (e) {
          console.error("Mux webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      }
    }
  }
});
const WelcomeRoute = Route$p.update({
  id: "/welcome",
  path: "/welcome",
  getParentRoute: () => Route$q
});
const WalletRoute = Route$o.update({
  id: "/wallet",
  path: "/wallet",
  getParentRoute: () => Route$q
});
const UploadRoute = Route$n.update({
  id: "/upload",
  path: "/upload",
  getParentRoute: () => Route$q
});
const TermsRoute = Route$m.update({
  id: "/terms",
  path: "/terms",
  getParentRoute: () => Route$q
});
const ShareRoute = Route$l.update({
  id: "/share",
  path: "/share",
  getParentRoute: () => Route$q
});
const SettingsRoute = Route$k.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$q
});
const SearchRoute = Route$j.update({
  id: "/search",
  path: "/search",
  getParentRoute: () => Route$q
});
const RefundsRoute = Route$i.update({
  id: "/refunds",
  path: "/refunds",
  getParentRoute: () => Route$q
});
const PrivacyRoute = Route$h.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$q
});
const GuidelinesRoute = Route$g.update({
  id: "/guidelines",
  path: "/guidelines",
  getParentRoute: () => Route$q
});
const EarningsRoute = Route$f.update({
  id: "/earnings",
  path: "/earnings",
  getParentRoute: () => Route$q
});
const DmcaRoute = Route$e.update({
  id: "/dmca",
  path: "/dmca",
  getParentRoute: () => Route$q
});
const DiscoverRoute = Route$d.update({
  id: "/discover",
  path: "/discover",
  getParentRoute: () => Route$q
});
const ContactRoute = Route$c.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$q
});
const ChildSafetyRoute = Route$b.update({
  id: "/child-safety",
  path: "/child-safety",
  getParentRoute: () => Route$q
});
const CampaignsRoute = Route$a.update({
  id: "/campaigns",
  path: "/campaigns",
  getParentRoute: () => Route$q
});
const AuthRoute = Route$9.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$q
});
const ActivityRoute = Route$8.update({
  id: "/activity",
  path: "/activity",
  getParentRoute: () => Route$q
});
const AccountDeletionRoute = Route$7.update({
  id: "/account-deletion",
  path: "/account-deletion",
  getParentRoute: () => Route$q
});
const IndexRoute = Route$6.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$q
});
const LiveIndexRoute = Route$5.update({
  id: "/live/",
  path: "/live/",
  getParentRoute: () => Route$q
});
const UUsernameRoute = Route$4.update({
  id: "/u/$username",
  path: "/u/$username",
  getParentRoute: () => Route$q
});
const LiveStreamIdRoute = Route$3.update({
  id: "/live/$streamId",
  path: "/live/$streamId",
  getParentRoute: () => Route$q
});
const ApiAdminRestoreMediaRoute = Route$2.update({
  id: "/api/admin/restore-media",
  path: "/api/admin/restore-media",
  getParentRoute: () => Route$q
});
const ApiPublicPaymentsWebhookRoute = Route$1.update({
  id: "/api/public/payments/webhook",
  path: "/api/public/payments/webhook",
  getParentRoute: () => Route$q
});
const ApiPublicMuxWebhookRoute = Route.update({
  id: "/api/public/mux/webhook",
  path: "/api/public/mux/webhook",
  getParentRoute: () => Route$q
});
const rootRouteChildren = {
  IndexRoute,
  AccountDeletionRoute,
  ActivityRoute,
  AuthRoute,
  CampaignsRoute,
  ChildSafetyRoute,
  ContactRoute,
  DiscoverRoute,
  DmcaRoute,
  EarningsRoute,
  GuidelinesRoute,
  PrivacyRoute,
  RefundsRoute,
  SearchRoute,
  SettingsRoute,
  ShareRoute,
  TermsRoute,
  UploadRoute,
  WalletRoute,
  WelcomeRoute,
  LiveStreamIdRoute,
  UUsernameRoute,
  LiveIndexRoute,
  ApiAdminRestoreMediaRoute,
  ApiPublicMuxWebhookRoute,
  ApiPublicPaymentsWebhookRoute
};
const routeTree = Route$q._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$4 as R,
  Route$3 as a,
  createSsrRpc as c,
  router as r,
  useAuth as u
};
