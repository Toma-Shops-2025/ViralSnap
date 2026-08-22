import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as BottomNav } from "./bottom-nav-Bx8ufx_y.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-CU0WvJwq.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { u as useAuth } from "./router-QVK_Sz8y.mjs";
import { t as timeAgo, c as compact } from "./format-DD3jW9wI.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { d as Briefcase, R as Plus, l as Coins, C as Calendar, aa as Users } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./server-Dx3nuNLW.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./client.server-U_pH-Evd.mjs";
import "./stripe.server-CgDo0qox.mjs";
import "node:process";
import "events";
import "http";
import "https";
import "os";
import "../_libs/tailwind-merge.mjs";
const CATEGORIES = ["fashion", "beauty", "tech", "food", "fitness", "gaming", "lifestyle", "music", "travel", "education"];
async function fetchCampaigns() {
  const {
    data: campaigns
  } = await supabase.from("campaigns").select("*").eq("status", "active").order("created_at", {
    ascending: false
  }).limit(60);
  const ids = [...new Set((campaigns ?? []).map((c) => c.brand_id))];
  const {
    data: profiles
  } = await supabase.from("profiles").select("id, username, display_name, avatar_url").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
  return {
    campaigns: campaigns ?? [],
    brands: new Map((profiles ?? []).map((p) => [p.id, p]))
  };
}
function CampaignsPage() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [filter, setFilter] = reactExports.useState("all");
  const [applyTo, setApplyTo] = reactExports.useState(null);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const {
    data
  } = useQuery({
    queryKey: ["campaigns"],
    queryFn: fetchCampaigns
  });
  const campaigns = (data?.campaigns ?? []).filter((c) => filter === "all" || c.category === filter);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[100dvh] pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 space-y-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "flex items-center gap-2 font-display text-2xl font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-6 w-6 text-primary" }),
          " Campaigns"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => user ? setShowCreate(true) : navigate({
          to: "/welcome"
        }), className: "flex items-center gap-1.5 rounded-full bg-gradient-fire px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Post"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto no-scrollbar", children: ["all", ...CATEGORIES].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(c), className: cn("whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors", filter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"), children: c }, c)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl space-y-3 px-4 py-4", children: [
      campaigns.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-16 text-center text-sm text-muted-foreground", children: "No campaigns in this category yet." }),
      campaigns.map((c) => {
        const b = data?.brands.get(c.brand_id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              b?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.avatar_url, alt: b.username, className: "h-9 w-9 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-fire text-sm font-bold text-primary-foreground", children: (b?.display_name ?? "B").charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: b?.display_name ?? "Brand" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "@",
                  b?.username ?? "brand",
                  " · ",
                  timeAgo(c.created_at)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-accent px-2.5 py-1 text-xs font-semibold capitalize text-gold", children: c.category })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-lg font-bold", children: c.title }),
          c.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: c.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-3 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 font-semibold text-gold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-4 w-4" }),
              " ",
              compact(c.budget),
              " coins"
            ] }),
            c.deadline && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
              " ",
              new Date(c.deadline).toLocaleDateString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
              " ",
              c.application_count,
              " applied"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => user ? setApplyTo(c) : navigate({
            to: "/welcome"
          }), disabled: user?.id === c.brand_id, className: "mt-4 w-full rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90", children: user?.id === c.brand_id ? "Your campaign" : "Apply now" })
        ] }, c.id);
      })
    ] }),
    applyTo && /* @__PURE__ */ jsxRuntimeExports.jsx(ApplyDialog, { campaign: applyTo, onClose: () => setApplyTo(null), onApplied: () => {
      setApplyTo(null);
      qc.invalidateQueries({
        queryKey: ["campaigns"]
      });
    } }),
    showCreate && user && /* @__PURE__ */ jsxRuntimeExports.jsx(CreateDialog, { brandId: user.id, onClose: () => setShowCreate(false), onCreated: () => {
      setShowCreate(false);
      qc.invalidateQueries({
        queryKey: ["campaigns"]
      });
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
function ApplyDialog({
  campaign,
  onClose,
  onApplied
}) {
  const {
    user
  } = useAuth();
  const [pitch, setPitch] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async () => {
    if (!user) return;
    setBusy(true);
    const {
      error
    } = await supabase.from("campaign_applications").insert({
      campaign_id: campaign.id,
      creator_id: user.id,
      pitch: pitch.trim()
    });
    setBusy(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "You already applied to this campaign." : error.message);
      return;
    }
    toast.success("Application sent!", {
      description: "The brand will review your pitch."
    });
    onApplied();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display", children: [
        "Apply to “",
        campaign.title,
        "”"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Tell the brand why you're the perfect creator for this campaign." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: pitch, onChange: (e) => setPitch(e.target.value), placeholder: "Share your audience, ideas, and why this fits your style…", rows: 5, maxLength: 800, className: "bg-secondary/40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy || !pitch.trim(), className: "w-full rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90", children: "Send application" }) })
  ] }) });
}
function CreateDialog({
  brandId,
  onClose,
  onCreated
}) {
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [budget, setBudget] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("lifestyle");
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async () => {
    if (!title.trim()) return;
    setBusy(true);
    const {
      error
    } = await supabase.from("campaigns").insert({
      brand_id: brandId,
      title: title.trim(),
      description: description.trim(),
      budget: parseInt(budget || "0", 10) || 0,
      category,
      status: "active"
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Campaign posted!");
    onCreated();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Post a campaign" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Find creators to make content for your brand." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Campaign title", maxLength: 120, className: "bg-secondary/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "What are you looking for?", rows: 3, maxLength: 600, className: "bg-secondary/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: budget, onChange: (e) => setBudget(e.target.value.replace(/\D/g, "")), placeholder: "Budget in coins", inputMode: "numeric", className: "bg-secondary/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCategory(c), className: cn("rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors", category === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"), children: c }, c)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy || !title.trim(), className: "w-full rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90", children: "Post campaign" }) })
  ] }) });
}
export {
  CampaignsPage as component
};
