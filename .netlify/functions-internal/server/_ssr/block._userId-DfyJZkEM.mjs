import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-DJnjoRwr.mjs";
import { B as BottomNav } from "./bottom-nav-5QQReJYK.mjs";
import { b as Route$5, u as useAuth } from "./router-DDjFEyQJ.mjs";
import { t as toggleBlock } from "./safety.functions-Cq86SRs9.mjs";
import { r as rememberBlockedCreator } from "./blocked-creators-DzSNU48T.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { a as ArrowLeft, B as Ban } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-BB9uwBYF.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-jZBAtL8Q.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./server-CauiqJuS.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./client.server-U_pH-Evd.mjs";
import "./stripe.server-DSl7M_sI.mjs";
import "node:process";
import "events";
import "http";
import "https";
import "os";
import "./auth-middleware-DPXRLhra.mjs";
import "../_libs/zod.mjs";
function BlockCreatorPage() {
  const {
    userId
  } = Route$5.useParams();
  const {
    username
  } = Route$5.useSearch();
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/welcome",
      replace: true
    });
  }, [loading, user, navigate]);
  reactExports.useEffect(() => {
    if (user && user.id === userId) {
      toast.error("You can't block yourself");
      navigate({
        to: "/",
        replace: true
      });
    }
  }, [user, userId, navigate]);
  const confirmBlock = async () => {
    setBusy(true);
    try {
      const res = await toggleBlock({
        data: {
          targetUserId: userId
        }
      });
      if (res.blocked) {
        rememberBlockedCreator(userId);
        toast.success(username ? `Blocked @${username}` : "Creator blocked");
      } else {
        toast.success(username ? `Unblocked @${username}` : "Creator unblocked");
      }
      navigate({
        to: "/",
        replace: true
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to block creator");
    } finally {
      setBusy(false);
    }
  };
  if (loading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-dvh bg-background" });
  }
  const label = username ? `@${username}` : "this creator";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-dvh bg-background pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/90 px-4 py-3 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "Back", onClick: () => navigate({
        to: "/"
      }), className: "grid h-9 w-9 place-items-center rounded-full hover:bg-secondary/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold", children: "Block creator" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md space-y-6 px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 place-items-center rounded-full bg-rose-500/15 text-rose-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-8 w-8" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-bold", children: [
          "Block ",
          label,
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "You won't see their videos in your feed, and you'll unfollow each other. They won't be notified that you blocked them." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: confirmBlock, disabled: busy, className: "rounded-full bg-rose-500 text-white hover:bg-rose-500/90", children: busy ? "Blocking…" : `Block ${label}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => navigate({
          to: "/"
        }), className: "rounded-full", children: "Cancel" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  BlockCreatorPage as component
};
