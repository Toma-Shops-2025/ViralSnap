import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as LegalLayout } from "./legal-layout-gn4XHtJj.mjs";
import { M as Mail, X as ShieldAlert, F as FileText, p as CreditCard, a1 as TriangleAlert } from "../_libs/lucide-react.mjs";
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
function ContactPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(LegalLayout, { title: "Contact & Support", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-foreground/90", children: "The fastest way to reach us is by email. We respond within 3 business days, usually much sooner." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { icon: Mail, title: "General support", desc: "Questions, bugs, account help.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-gold", href: "mailto:support@viralsnap.online", children: "support@viralsnap.online" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { icon: ShieldAlert, title: "Report abuse or harmful content", desc: "In-app: use the report option on any post or profile. Urgent (CSAM, threats, doxxing):", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-gold", href: "mailto:support@viralsnap.online?subject=URGENT%20Trust%20%26%20Safety", children: "support@viralsnap.online" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: " (subject: URGENT)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { icon: FileText, title: "Copyright (DMCA)", desc: "See requirements on our DMCA page.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dmca", className: "text-gold", children: "DMCA & Content Policy →" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { icon: CreditCard, title: "Billing & refunds", desc: "Subscriptions, coins, gifts, refund requests.", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-gold", href: "mailto:support@viralsnap.online?subject=Billing", children: "support@viralsnap.online" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: " · " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/refunds", className: "text-gold", children: "Refund policy →" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { icon: TriangleAlert, title: "Security disclosure", desc: "Found a vulnerability? Please disclose responsibly.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-gold", href: "mailto:support@viralsnap.online?subject=Security", children: "support@viralsnap.online" }) })
    ] })
  ] });
}
function Card({
  icon: Icon,
  title,
  desc,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-medium", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: desc }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm", children })
  ] });
}
export {
  ContactPage as component
};
