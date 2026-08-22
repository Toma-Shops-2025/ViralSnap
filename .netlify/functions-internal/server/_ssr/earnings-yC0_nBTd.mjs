import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as BottomNav } from "./bottom-nav-Bx8ufx_y.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-CU0WvJwq.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { u as useAuth } from "./router-QVK_Sz8y.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { c as compact } from "./format-DD3jW9wI.mjs";
import { a as getStripeEnvironment } from "./stripe-B2IM9WNU.mjs";
import { s as supabaseAdmin } from "./client.server-U_pH-Evd.mjs";
import { c as createStripeClient, g as getStripeErrorMessage } from "./stripe.server-CgDo0qox.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe__stripe-js.mjs";
import "../_libs/stripe.mjs";
import { a as ArrowLeft, l as Coins, i as CircleCheck, y as LoaderCircle, B as Banknote, Q as Play, v as Heart, K as MessageCircle, t as Gift, _ as ShoppingBag, ab as Video, a3 as TrendingUp, ad as X, p as ExternalLink } from "../_libs/lucide-react.mjs";
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
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./server-Dx3nuNLW.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "node:process";
import "events";
import "http";
import "https";
import "os";
async function fetchEarnings() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const me = auth.user.id;
  const [{ data: videos }, { data: profile }, giftsRes] = await Promise.all([
    supabase.from("videos").select("*").eq("creator_id", me).order("view_count", { ascending: false }),
    supabase.from("profiles").select("total_earned").eq("id", me).maybeSingle(),
    supabase.from("gifts").select("coin_amount").eq("receiver_id", me)
  ]);
  const vids = videos ?? [];
  const gifts = giftsRes.data ?? [];
  return {
    totalViews: vids.reduce((s, v) => s + (v.view_count ?? 0), 0),
    totalLikes: vids.reduce((s, v) => s + (v.like_count ?? 0), 0),
    totalComments: vids.reduce((s, v) => s + (v.comment_count ?? 0), 0),
    totalProductClicks: vids.reduce((s, v) => s + (v.product_clicks ?? 0), 0),
    videoCount: vids.length,
    giftCoins: gifts.reduce((s, g) => s + (g.coin_amount ?? 0), 0),
    giftCount: gifts.length,
    totalEarned: profile?.total_earned ?? 0,
    topVideos: vids.slice(0, 5)
  };
}
const getConnectStatus = async ({ data, context }) => {
  const { supabase: supabase2, userId } = context;
  const { data: profile } = await supabase2.from("profiles").select("stripe_connect_account_id").eq("id", userId).maybeSingle();
  const accountId = profile?.stripe_connect_account_id;
  if (!accountId) {
    return { hasAccount: false, payoutsEnabled: false, detailsSubmitted: false };
  }
  try {
    const stripe = createStripeClient(data.environment);
    const account = await stripe.accounts.retrieve(accountId);
    const payoutsEnabled = !!account.payouts_enabled;
    await supabaseAdmin.from("profiles").update({ payouts_enabled: payoutsEnabled }).eq("id", userId);
    return {
      hasAccount: true,
      payoutsEnabled,
      detailsSubmitted: !!account.details_submitted
    };
  } catch (error) {
    return { error: getStripeErrorMessage(error) };
  }
};
const createConnectOnboardingLink = async ({ data, context }) => {
  const { supabase: supabase2, userId } = context;
  try {
    const stripe = createStripeClient(data.environment);
    const { data: profile } = await supabase2.from("profiles").select("stripe_connect_account_id, username, display_name, bio").eq("id", userId).maybeSingle();
    let accountId = profile?.stripe_connect_account_id;
    const profileUrl = profile?.username ? `https://viralsnap.online/u/${profile.username}` : "https://viralsnap.online";
    const businessName = profile?.display_name || profile?.username || "ViralSnap creator";
    const productDescription = profile?.bio && profile.bio.trim() || "Short-form video creator earning tips, gifts and supporter subscriptions on ViralSnap.";
    const businessProfile = {
      url: profileUrl,
      name: businessName,
      product_description: productDescription
    };
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        business_type: "individual",
        ...data.email && { email: data.email },
        // Transfers-only payout model (separate charges & transfers); the
        // platform collects payments, then transfers earnings on payout.
        capabilities: { transfers: { requested: true } },
        business_profile: businessProfile,
        metadata: { userId }
      });
      accountId = account.id;
      await supabaseAdmin.from("profiles").update({ stripe_connect_account_id: accountId }).eq("id", userId);
    } else {
      try {
        await stripe.accounts.update(accountId, {
          business_profile: businessProfile
        });
      } catch {
      }
    }
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: data.returnUrl,
      return_url: data.returnUrl,
      type: "account_onboarding"
    });
    return { url: link.url };
  } catch (error) {
    return { error: getStripeErrorMessage(error) };
  }
};
const requestCreatorPayout = async ({ data, context }) => {
  const { supabase: supabase2, userId } = context;
  const { data: profile } = await supabase2.from("profiles").select("stripe_connect_account_id, payouts_enabled").eq("id", userId).maybeSingle();
  const accountId = profile?.stripe_connect_account_id;
  if (!accountId || !profile?.payouts_enabled) {
    return { error: "Connect a payout account before requesting a payout." };
  }
  const { data: reserved, error: reserveError } = await supabase2.rpc("request_payout", {
    _coins: data.coins
  });
  if (reserveError) return { error: reserveError.message };
  const result = reserved;
  try {
    const stripe = createStripeClient(data.environment);
    const transfer = await stripe.transfers.create({
      amount: result.amount_cents,
      currency: "usd",
      destination: accountId,
      metadata: { userId, payoutRequestId: result.request_id }
    });
    await supabaseAdmin.from("payout_requests").update({
      status: "paid",
      stripe_transfer_id: transfer.id,
      processed_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", result.request_id);
    return { success: true, amountCents: result.amount_cents, balance: result.balance };
  } catch (error) {
    await supabaseAdmin.rpc("refund_payout", { _request_id: result.request_id });
    return { error: getStripeErrorMessage(error) };
  }
};
function PayoutOnboardDialog({
  url,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!url, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "border-border bg-card sm:max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Continue payout setup" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Your secure payout setup link is ready. It opens in a new tab where you'll verify your identity and add a bank account." })
    ] }),
    url && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: url,
        target: "_blank",
        rel: "noopener noreferrer",
        onClick: onClose,
        className: "mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-fire py-3 text-sm font-bold text-primary-foreground shadow-glow transition-opacity hover:opacity-90",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4" }),
          "Open payout setup"
        ]
      }
    )
  ] }) });
}
function PayoutSetupBanner({ returnPath = "/earnings" }) {
  const { user } = useAuth();
  const [dismissed, setDismissed] = reactExports.useState(false);
  const [connecting, setConnecting] = reactExports.useState(false);
  const [onboardUrl, setOnboardUrl] = reactExports.useState(null);
  const statusFn = getConnectStatus;
  const onboardFn = createConnectOnboardingLink;
  const { data: connect } = useQuery({
    queryKey: ["connect-status", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const res = await statusFn({ data: { environment: getStripeEnvironment() } });
      if ("error" in res) throw new Error(res.error);
      return res;
    }
  });
  if (!user || dismissed || !connect || connect.payoutsEnabled) return null;
  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await onboardFn({
        data: {
          email: user.email ?? void 0,
          returnUrl: `${window.location.origin}${returnPath}`,
          environment: getStripeEnvironment()
        }
      });
      if ("error" in res) throw new Error(res.error);
      setOnboardUrl(res.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start payout setup");
    } finally {
      setConnecting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-2xl bg-gradient-ember p-4 shadow-glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setDismissed(true),
          "aria-label": "Dismiss",
          className: "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-white/80 hover:text-white",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 pr-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-bold text-white", children: "Finish your payout setup" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-white/85", children: "Connect a payout account so you can cash out your ViralCoins earnings." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleConnect,
              disabled: connecting,
              className: "mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-primary transition-opacity hover:opacity-90 disabled:opacity-60",
              children: [
                connecting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : null,
                "Set up payouts"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PayoutOnboardDialog, { url: onboardUrl, onClose: () => setOnboardUrl(null) })
  ] });
}
const COIN_TO_USD = 5 / 1e3;
const MIN_PAYOUT_COINS = 1e3;
function EarningsPage() {
  const {
    user,
    profile,
    loading,
    refreshProfile
  } = useAuth();
  const navigate = useNavigate();
  const [payoutOpen, setPayoutOpen] = reactExports.useState(false);
  const [coinsToCashOut, setCoinsToCashOut] = reactExports.useState("");
  const [connecting, setConnecting] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [onboardUrl, setOnboardUrl] = reactExports.useState(null);
  const statusFn = getConnectStatus;
  const onboardFn = createConnectOnboardingLink;
  const payoutFn = requestCreatorPayout;
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/welcome",
      replace: true
    });
  }, [loading, user, navigate]);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["earnings", user?.id],
    enabled: !!user,
    queryFn: fetchEarnings
  });
  const {
    data: connect,
    refetch: refetchConnect
  } = useQuery({
    queryKey: ["connect-status", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const res = await statusFn({
        data: {
          environment: getStripeEnvironment()
        },
        context: {
          supabase,
          userId: user?.id
        }
      });
      if ("error" in res) throw new Error(res.error);
      return res;
    }
  });
  const balance = profile?.coin_balance ?? 0;
  const cashValue = (balance * COIN_TO_USD).toFixed(2);
  const canPayout = balance >= MIN_PAYOUT_COINS;
  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await onboardFn({
        data: {
          email: user?.email ?? void 0,
          returnUrl: `${window.location.origin}/earnings`,
          environment: getStripeEnvironment()
        },
        context: {
          supabase,
          userId: user?.id
        }
      });
      if ("error" in res) throw new Error(res.error);
      setOnboardUrl(res.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start onboarding");
    } finally {
      setConnecting(false);
    }
  };
  const handlePayout = async () => {
    const coins = Number(coinsToCashOut);
    if (!Number.isInteger(coins) || coins < MIN_PAYOUT_COINS) {
      toast.error(`Minimum payout is ${MIN_PAYOUT_COINS.toLocaleString()} coins.`);
      return;
    }
    if (coins > balance) {
      toast.error("You don't have that many coins.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await payoutFn({
        data: {
          coins,
          environment: getStripeEnvironment()
        },
        context: {
          supabase,
          userId: user?.id
        }
      });
      if ("error" in res) throw new Error(res.error);
      toast.success(`Payout of $${(res.amountCents / 100).toFixed(2)} sent!`);
      setPayoutOpen(false);
      setCoinsToCashOut("");
      await refreshProfile();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payout failed");
    } finally {
      setSubmitting(false);
    }
  };
  const openPayout = () => {
    if (!canPayout) {
      toast.info(`Payouts open at ${MIN_PAYOUT_COINS.toLocaleString()} coins. Keep creating!`);
      return;
    }
    if (!connect?.payoutsEnabled) {
      handleConnect();
      return;
    }
    setCoinsToCashOut(String(balance));
    setPayoutOpen(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[100dvh] pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/wallet", className: "flex h-9 w-9 items-center justify-center rounded-full bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: "Earnings" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md space-y-6 px-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PayoutSetupBanner, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-gradient-ember p-6 shadow-glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-white/80", children: "Available to cash out" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-end gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-4xl font-bold text-white", children: [
            "$",
            cashValue
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 text-sm text-white/70", children: "USD" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 flex items-center gap-1 text-sm text-white/80", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-4 w-4" }),
          " ",
          balance.toLocaleString(),
          " ViralCoins"
        ] }),
        connect?.payoutsEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 flex items-center gap-1 text-xs text-white/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
          " Payout account connected"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: openPayout, disabled: connecting, className: "mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-black/25 py-2.5 text-sm font-semibold text-white backdrop-blur transition-opacity hover:opacity-90 disabled:opacity-60", children: [
          connecting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "h-4 w-4" }),
          connect?.payoutsEnabled ? "Request payout" : canPayout ? "Connect payout account" : "Request payout"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-center text-[11px] text-white/60", children: [
          "Min ",
          MIN_PAYOUT_COINS.toLocaleString(),
          " coins = $5.00"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-display text-lg font-bold", children: "Performance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { icon: Play, label: "Views", value: data?.totalViews ?? 0, loading: isLoading }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { icon: Heart, label: "Likes", value: data?.totalLikes ?? 0, loading: isLoading }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { icon: MessageCircle, label: "Comments", value: data?.totalComments ?? 0, loading: isLoading }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { icon: Gift, label: "Gifts received", value: data?.giftCount ?? 0, loading: isLoading }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { icon: ShoppingBag, label: "Product clicks", value: data?.totalProductClicks ?? 0, loading: isLoading }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { icon: Video, label: "Videos", value: data?.videoCount ?? 0, loading: isLoading })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-3 flex items-center gap-1.5 font-display text-lg font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-gold" }),
          " Top videos"
        ] }),
        (data?.topVideos.length ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-2xl border border-border bg-card py-8 text-center text-sm text-muted-foreground", children: "Upload videos to start earning." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: data?.topVideos.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold text-muted-foreground", children: i + 1 }),
          v.cover_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: v.cover_url, alt: v.title, className: "h-14 w-10 rounded-md object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: v.media_url ?? void 0, muted: true, playsInline: true, preload: "metadata", className: "h-14 w-10 rounded-md object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: v.title || v.caption || "Untitled" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3" }),
                " ",
                compact(v.view_count)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-3 w-3" }),
                " ",
                compact(v.like_count)
              ] })
            ] })
          ] })
        ] }, v.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: payoutOpen, onOpenChange: (o) => !o && setPayoutOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "border-border bg-card sm:max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Request payout" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Coins are converted at 1,000 coins = $5.00 and transferred to your connected account." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: MIN_PAYOUT_COINS, max: balance, value: coinsToCashOut, onChange: (e) => setCoinsToCashOut(e.target.value), className: "rounded-xl bg-secondary/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "You'll receive",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
            "$",
            ((Number(coinsToCashOut) || 0) * COIN_TO_USD).toFixed(2)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setPayoutOpen(false), className: "rounded-full border-border", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handlePayout, disabled: submitting, className: "rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90", children: submitting ? "Sending…" : "Cash out" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PayoutOnboardDialog, { url: onboardUrl, onClose: () => setOnboardUrl(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
function MetricCard({
  icon: Icon,
  label,
  value,
  loading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-display text-2xl font-bold", children: loading ? "—" : compact(value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label })
  ] });
}
export {
  EarningsPage as component
};
