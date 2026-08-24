import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as BottomNav } from "./bottom-nav-5QQReJYK.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { u as useAuth } from "./router-DDjFEyQJ.mjs";
import { t as timeAgo } from "./format-DD3jW9wI.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle } from "./dialog-C0PDZPpH.mjs";
import { u as useStripeCheckout } from "./useStripeCheckout-Ey-l0WbU.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import "../_libs/stripe__react-stripe-js.mjs";
import "../_libs/stripe__stripe-js.mjs";
import { a0 as TrendingUp, m as Coins, $ as TrendingDown, Z as Sparkles, v as Gift, A as ArrowDownLeft, b as ArrowUpRight } from "../_libs/lucide-react.mjs";
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
import "./utils-BB9uwBYF.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
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
import "./stripe-B2IM9WNU.mjs";
import "./payments.functions-CPIpWfq4.mjs";
import "./auth-middleware-DPXRLhra.mjs";
import "../_libs/prop-types.mjs";
const clientToken = "pk_live_51TfueWEstVb6DbcqpxNFrEi63uWVMeaW0EYeo61vdEkgZsVTUVrctXfJizR9fBB9Vuo8GGq7U5sep0rIx9N21FYz00qKhnpTVD";
function PaymentTestModeBanner() {
  if (clientToken.startsWith("pk_test_")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full border-b border-gold/40 bg-gold/10 px-4 py-2 text-center text-sm text-gold", children: [
      "Test mode — use card 4242 4242 4242 4242 to try a purchase.",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "https://docs.lovable.dev/features/payments#test-and-live-environments",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "font-medium underline",
          children: "Read more"
        }
      )
    ] });
  }
  return null;
}
const PACKS = [{
  coins: 500,
  price: "$4.99",
  priceId: "coins_500"
}, {
  coins: 1200,
  price: "$9.99",
  priceId: "coins_1200"
}, {
  coins: 3e3,
  price: "$19.99",
  priceId: "coins_3000"
}, {
  coins: 8e3,
  price: "$49.99",
  priceId: "coins_8000"
}];
function WalletPage() {
  const {
    user,
    profile,
    loading,
    refreshProfile
  } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    openCheckout,
    closeCheckout,
    isOpen,
    checkoutElement
  } = useStripeCheckout();
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/welcome",
      replace: true
    });
  }, [loading, user, navigate]);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      toast.success("Payment complete!", {
        description: "Your ViralCoins are being added to your balance."
      });
      const refresh = () => {
        refreshProfile();
        queryClient.invalidateQueries({
          queryKey: ["transactions"]
        });
      };
      refresh();
      const t = setTimeout(refresh, 2500);
      window.history.replaceState({}, "", "/wallet");
      return () => clearTimeout(t);
    }
  }, [refreshProfile, queryClient]);
  const handleBuy = (priceId) => {
    if (!user) {
      navigate({
        to: "/welcome"
      });
      return;
    }
    openCheckout({
      priceId,
      customerEmail: user.email ?? void 0,
      userId: user.id,
      returnUrl: `${window.location.origin}/wallet?checkout=success`
    });
  };
  const {
    data: txns = []
  } = useQuery({
    queryKey: ["transactions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("coin_transactions").select("*").order("created_at", {
        ascending: false
      }).limit(50);
      return data ?? [];
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[100dvh] pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentTestModeBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between px-4 pt-[calc(1rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: "Wallet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/earnings", className: "flex items-center gap-1 rounded-full border border-gold/40 bg-card px-3 py-1.5 text-sm font-semibold text-gold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }),
        " Earnings"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md space-y-6 px-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-gradient-ember p-6 shadow-glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-white/80", children: "ViralCoins balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-8 w-8 text-white" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-4xl font-bold text-white", children: (profile?.coin_balance ?? 0).toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-black/20 p-3 backdrop-blur", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-white/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5" }),
              " Earned"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 font-display text-lg font-bold text-white", children: (profile?.total_earned ?? 0).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-black/20 p-3 backdrop-blur", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-white/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3.5 w-3.5" }),
              " Spent"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 font-display text-lg font-bold text-white", children: (profile?.total_spent ?? 0).toLocaleString() })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-display text-lg font-bold", children: "Top up" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: PACKS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleBuy(p.priceId), className: "flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-gold/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-gold" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold", children: p.coins.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "coins" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 rounded-full bg-gradient-fire px-3 py-0.5 text-xs font-semibold text-primary-foreground", children: p.price })
        ] }, p.coins)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-display text-lg font-bold", children: "Activity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          txns.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-sm text-muted-foreground", children: "No transactions yet." }),
          txns.map((t) => {
            const positive = t.amount >= 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-9 w-9 items-center justify-center rounded-full ${positive ? "bg-accent text-gold" : "bg-secondary text-muted-foreground"}`, children: t.type === "gift_received" || t.type === "welcome" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4" }) : positive ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: t.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: timeAgo(t.created_at) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-display text-sm font-bold ${positive ? "text-gold" : "text-muted-foreground"}`, children: [
                positive ? "+" : "",
                t.amount.toLocaleString()
              ] })
            ] }, t.id);
          })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: (o) => !o && closeCheckout(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90dvh] overflow-y-auto sm:max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Buy ViralCoins" }) }),
      checkoutElement
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  WalletPage as component
};
