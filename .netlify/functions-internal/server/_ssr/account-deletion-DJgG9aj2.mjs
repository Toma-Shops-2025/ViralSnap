import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as LegalLayout, a as LegalSection } from "./legal-layout-gn4XHtJj.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function AccountDeletionPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(LegalLayout, { title: "Delete Your Empire Account", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm text-foreground/90", children: [
      "You can permanently delete your TomaAI account and all associated data for ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "ViralSnap" }),
      " and ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Helix Empire" }),
      " at any time."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(LegalSection, { title: "Delete from inside our apps", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Open ViralSnap or Helix Empire and sign in." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Go to Settings (or Skins in Helix Empire) → scroll to the bottom." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "Tap ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Delete account" }),
          " (or Sign Out/Request Deletion) and confirm."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The deletion is immediate. You'll be signed out and your data removed across the entire network." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(LegalSection, { title: "Delete by email", children: [
      "If you can't access your account, email",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-gold", href: "mailto:support@viralsnap.online?subject=Account%20Deletion%20Request", children: "support@viralsnap.online" }),
      " ",
      "from the address on your account with the subject ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: '"Account Deletion Request"' }),
      ". We process requests within 7 days."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegalSection, { title: "What gets deleted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Your profile (username, display name, avatar, bio, links)." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "All posts you created, including the video files." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Your comments, likes, follows, and follower relationships." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Your account credentials and authentication records." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Your coin balance and any blocks you've created." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegalSection, { title: "What we may retain", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Payment records" }),
        " — coin, gift, and subscription transaction history is retained for up to 7 years as required by tax and financial regulations. These records are tied to your previous user ID but do not include profile information."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Moderation records" }),
        " — if your account was actioned for policy violations, we retain a minimal record (user ID, date, reason) to prevent ban evasion."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Backups" }),
        " — encrypted backups are purged on a rolling 30-day schedule."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegalSection, { title: "Cancel subscriptions first", children: "Deleting your account does NOT automatically cancel active paid subscriptions to creators or ViralSnap Pro. Please cancel them from your settings first, or email us and we'll handle it together." })
  ] });
}
export {
  AccountDeletionPage as component
};
