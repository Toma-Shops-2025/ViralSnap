import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as LegalLayout, a as LegalSection } from "./legal-layout-gn4XHtJj.mjs";
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
import "../_libs/lucide-react.mjs";
function RefundsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(LegalLayout, { title: "Refund & Cancellation Policy", updated: "June 8, 2026", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegalSection, { title: "ViralSnap Pro subscriptions", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        "Cancel anytime in your ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "text-gold", children: "settings" }),
        " → Manage subscriptions. You keep Pro access until the end of the current billing period."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "We don't pro-rate refunds for partial months." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        "If you were billed by mistake (duplicate charge, billing after cancellation), email ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-gold", href: "mailto:support@viralsnap.online", children: "support@viralsnap.online" }),
        " within 14 days for a full refund."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegalSection, { title: "Creator subscriptions", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "You can cancel a creator subscription at any time from your settings. Access continues until the end of the paid month." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        "Creator subscriptions are non-refundable except in cases of fraud, billing error, or content that violates our ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/guidelines", className: "text-gold", children: "Community Guidelines" }),
        "."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(LegalSection, { title: "ViralCoins & gifts", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Coin purchases and gifts are ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "final and non-refundable" }),
        ". Gifts are sent directly to creators and are not subject to cancellation. Exceptions:"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Unauthorized charge / payment fraud — contact us within 14 days." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "The recipient creator account is terminated for policy violations before the gift is processed." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegalSection, { title: "EU/UK consumers", children: "If you're a consumer in the EU or UK, you may have a 14-day right of withdrawal on subscription purchases under the Consumer Rights Directive. By starting to use the digital service immediately at checkout, you waive this right — but you can still cancel future renewals at any time." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(LegalSection, { title: "How to request a refund", children: [
      "Email ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-gold", href: "mailto:support@viralsnap.online", children: "support@viralsnap.online" }),
      " from the address on your account. Include the date, amount, and what you'd like refunded. We respond within 3 business days."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegalSection, { title: "Chargebacks", children: "We prefer working directly with you. Filing a chargeback without first contacting us may result in account suspension while the dispute is investigated." })
  ] });
}
export {
  RefundsPage as component
};
