import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, c as createSsrRpc } from "./router-QVK_Sz8y.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as createServerFn } from "./server-Dx3nuNLW.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Co1FUz65.mjs";
import { b as createSubscriptionPortalSession } from "./payments.functions-oTpZTTWw.mjs";
import { a as getStripeEnvironment } from "./stripe-B2IM9WNU.mjs";
import { u as useProSubscription } from "./use-pro-uwbyDMJB.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import "../_libs/stripe.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe__stripe-js.mjs";
import { y as LoaderCircle, a as ArrowLeft, a7 as User, e as Camera, G as Gem, M as Mail, c as Bell, z as Lock, u as Globe, k as CircleQuestionMark, g as ChevronRight, I as LogOut, a1 as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "./client.server-U_pH-Evd.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./stripe.server-CgDo0qox.mjs";
import "node:process";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "events";
import "http";
import "https";
import "os";
const deleteAccount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("605045233debcf4fbca7c93f06a21eab51d31e90e5fab3208ca6233b08e8f1d1"));
function SettingsPage() {
  const {
    user,
    profile,
    loading,
    refreshProfile,
    signOut
  } = useAuth();
  const {
    isPro
  } = useProSubscription();
  const navigate = useNavigate();
  const [busy, setBusy] = reactExports.useState(false);
  const [editName, setEditName] = reactExports.useState(false);
  const [displayName, setDisplayName] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const portalFn = createSubscriptionPortalSession;
  const deleteFn = deleteAccount;
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/welcome",
      replace: true
    });
  }, [loading, user, navigate]);
  reactExports.useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
      setBio(profile.bio || "");
    }
  }, [profile]);
  const handleSignOut = async () => {
    await signOut();
    navigate({
      to: "/welcome",
      replace: true
    });
    toast.success("Signed out");
  };
  const handleManageSubscription = async () => {
    setBusy(true);
    try {
      const res = await portalFn({
        data: {
          environment: getStripeEnvironment(),
          returnUrl: window.location.href
        },
        context: {
          supabase,
          userId: user?.id
        }
      });
      if ("error" in res) throw new Error(res.error);
      window.open(res.url, "_blank");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to open portal");
    } finally {
      setBusy(false);
    }
  };
  const updateProfile = async () => {
    setBusy(true);
    try {
      const {
        error
      } = await supabase.from("profiles").update({
        display_name: displayName.trim(),
        bio: bio.trim()
      }).eq("id", user?.id);
      if (error) throw error;
      await refreshProfile();
      setEditName(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setBusy(false);
    }
  };
  const onAvatar = async (file) => {
    if (!user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const {
      error
    } = await supabase.storage.from("avatars").upload(path, file, {
      contentType: file.type
    });
    if (error) return toast.error(error.message);
    const url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    const {
      error: updateError
    } = await supabase.from("profiles").update({
      avatar_url: url
    }).eq("id", user.id);
    if (updateError) return toast.error(updateError.message);
    await refreshProfile();
    toast.success("Avatar updated");
  };
  const handleDeleteAccount = async () => {
    const ok = window.confirm("Are you sure? This will permanently delete your account and all data. This cannot be undone.");
    if (!ok) return;
    const confirmText = window.prompt("Type 'DELETE' to confirm:");
    if (confirmText !== "DELETE") return;
    setBusy(true);
    try {
      await deleteFn({
        data: {},
        context: {
          supabase,
          userId: user?.id
        }
      });
      await signOut();
      navigate({
        to: "/welcome",
        replace: true
      });
      toast.success("Account deleted");
    } catch (err) {
      toast.error("Failed to delete account");
      setBusy(false);
    }
  };
  if (loading || !profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-dvh place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[100dvh] bg-background pb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
        to: "/me"
      }), className: "flex h-9 w-9 items-center justify-center rounded-full bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Settings" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md space-y-8 px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground", children: "Account Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "relative cursor-pointer group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 overflow-hidden rounded-full ring-2 ring-primary/20", children: profile.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profile.avatar_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full w-full place-items-center bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-8 w-8 text-muted-foreground" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-6 w-6 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => e.target.files?.[0] && onAvatar(e.target.files[0]) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: profile.display_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "@",
                profile.handle
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditName(true), className: "text-xs font-bold uppercase tracking-widest text-primary hover:opacity-80", children: "Edit" })
          ] }),
          editName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3 pt-4 border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "Display Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: displayName, onChange: (e) => setDisplayName(e.target.value), className: "w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm outline-none focus:border-primary/50" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "Bio" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: bio, onChange: (e) => setBio(e.target.value), rows: 2, className: "w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, onClick: updateProfile, className: "flex-1 rounded-full bg-primary py-2 text-sm font-bold text-primary-foreground", children: "Save" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditName(false), className: "flex-1 rounded-full border border-border py-2 text-sm", children: "Cancel" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground", children: "Subscription" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-10 w-10 place-items-center rounded-xl ${isPro ? "bg-gold/10" : "bg-secondary"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gem, { className: `h-5 w-5 ${isPro ? "text-gold" : "text-muted-foreground"}` }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "ViralSnap Pro" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isPro ? "Premium active" : "Basic Plan" })
            ] })
          ] }),
          isPro ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleManageSubscription, disabled: busy, className: "rounded-full bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold hover:bg-gold/20", children: "Manage" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pricing", className: "rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground", children: "Upgrade" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground", children: "Preferences" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { icon: Mail, label: "Email Notifications", active: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { icon: Bell, label: "Push Notifications", active: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { icon: Lock, label: "Privacy & Security" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { icon: Globe, label: "Language", value: "English" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground", children: "Support" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/welcome", className: "flex items-center justify-between p-4 transition-colors hover:bg-secondary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "h-5 w-5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Help Center" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSignOut, className: "flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-foreground transition-colors hover:bg-secondary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-5 w-5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Sign Out" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleDeleteAccount, disabled: busy, className: "flex w-full items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-destructive transition-colors hover:bg-destructive/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Delete Account" })
        ] })
      ] }) })
    ] })
  ] });
}
function SettingRow({
  icon: Icon,
  label,
  value,
  active
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 transition-colors hover:bg-secondary/20 cursor-pointer", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      value && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: value }),
      active !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-5 w-9 rounded-full p-1 transition-colors ${active ? "bg-primary" : "bg-muted"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-3 w-3 rounded-full bg-white transition-transform ${active ? "translate-x-4" : "translate-x-0"}` }) }),
      !active && !value && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
    ] })
  ] });
}
export {
  SettingsPage as component
};
