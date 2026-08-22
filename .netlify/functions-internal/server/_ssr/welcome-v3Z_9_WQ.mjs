import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { s as Flame, a0 as Sparkles, a3 as TrendingUp, l as Coins, T as Rocket } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
function WelcomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-[100dvh] bg-black text-white overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-fire opacity-20 blur-[100px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-[80px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative z-10 flex items-center justify-between px-6 py-6 max-w-5xl mx-auto pt-[calc(1.5rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-7 w-7 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-2xl font-bold", children: [
          "Viral",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-fire", children: "Snap" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "text-sm font-semibold text-white/70 hover:text-white transition-colors", children: "Sign in" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative z-10 px-6 pt-12 pb-24 max-w-4xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
        " Creators Deserve More"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100", children: [
        "Go Viral ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-fire", children: "in Seconds." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-xl mx-auto text-lg text-white/70 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200", children: "The first feed that prioritizes creator monetization. Post videos, earn ViralCoins, and build a real business from your content." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "w-full sm:w-auto h-14 px-8 rounded-full bg-gradient-fire text-lg font-bold text-white shadow-glow hover:opacity-90 transition-all active:scale-95", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: "Create Account" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "w-full sm:w-auto h-14 px-8 rounded-full border-white/20 bg-white/5 text-lg font-bold text-white backdrop-blur hover:bg-white/10 transition-all active:scale-95", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Watch the Feed" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-sm text-white/40 animate-in fade-in delay-500", children: "No account needed to browse." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-6 w-6 text-orange-500" }), title: "Discovery First", description: "Our algorithm finds great content from new creators, not just the famous ones." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-6 w-6 text-yellow-500" }), title: "Real Earnings", description: "Earn ViralCoins from your fans and cash them out for real money instantly." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "h-6 w-6 text-red-500" }), title: "Creator Tools", description: "Link in bio, in-feed product sales, and deeper audience analytics built-in." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "relative z-10 border-t border-white/10 bg-black/50 backdrop-blur px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-6 w-6 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold", children: "ViralSnap" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: "hover:text-white transition-colors", children: "Terms" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "hover:text-white transition-colors", children: "Privacy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/guidelines", className: "hover:text-white transition-colors", children: "Guidelines" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "hover:text-white transition-colors", children: "Contact" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-white/30", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " ViralSnap",
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] opacity-30 mt-2 uppercase font-black tracking-tighter", children: "Build v2.1.8-master" })
      ] })
    ] }) })
  ] });
}
function FeatureCard({
  icon,
  title,
  description
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-primary/30 transition-all duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 group-hover:bg-primary/20 transition-colors", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-2 group-hover:text-primary transition-colors", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/60 leading-relaxed", children: description })
  ] });
}
export {
  WelcomePage as component
};
