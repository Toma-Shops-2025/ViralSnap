import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as ArrowLeft } from "../_libs/lucide-react.mjs";
function LegalLayout({
  title,
  updated,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[100dvh] bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/",
          className: "flex h-9 w-9 items-center justify-center rounded-full bg-card",
          "aria-label": "Back to home",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold", children: "ViralSnap" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "mx-auto max-w-2xl px-5 pt-6 pb-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-gradient-fire", children: title }),
      updated && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground", children: [
        "Last updated: ",
        updated
      ] }),
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(LegalFooter, {})
    ] })
  ] });
}
function LegalSection({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6 text-sm text-foreground/90 space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_a]:underline-offset-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-gold", children: title }),
    children
  ] });
}
function LegalFooter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-10 flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-6 text-xs text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "text-gold", children: "Privacy" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: "text-gold", children: "Terms" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/guidelines", className: "text-gold", children: "Guidelines" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/child-safety", className: "text-gold", children: "Child Safety" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dmca", className: "text-gold", children: "DMCA" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/refunds", className: "text-gold", children: "Refunds" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account-deletion", className: "text-gold", children: "Delete account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "text-gold", children: "Contact" })
  ] });
}
export {
  LegalLayout as L,
  LegalSection as a
};
