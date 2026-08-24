import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-DJnjoRwr.mjs";
import { T as Textarea } from "./textarea-CgEwOx0M.mjs";
import { R as RadioGroup, a as RadioGroupItem } from "./radio-group-CICG3f2N.mjs";
import { L as Label, C as Checkbox } from "./checkbox-B4QQ4Tul.mjs";
import { B as BottomNav } from "./bottom-nav-5QQReJYK.mjs";
import { c as Route$4, u as useAuth } from "./router-DDjFEyQJ.mjs";
import { s as submitReport } from "./safety.functions-Cq86SRs9.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { a as ArrowLeft } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
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
const REASONS = [{
  value: "spam",
  label: "Spam or scam"
}, {
  value: "harassment",
  label: "Harassment or bullying"
}, {
  value: "hate",
  label: "Hate speech"
}, {
  value: "sexual",
  label: "Sexual content / nudity"
}, {
  value: "violence",
  label: "Violence or gore"
}, {
  value: "csam",
  label: "Child sexual abuse material"
}, {
  value: "self_harm",
  label: "Self-harm or suicide"
}, {
  value: "impersonation",
  label: "Impersonation"
}, {
  value: "ip_violation",
  label: "Copyright / IP violation"
}, {
  value: "illegal",
  label: "Illegal activity"
}, {
  value: "other",
  label: "Something else"
}];
function ReportCreatorPage() {
  const {
    userId
  } = Route$4.useParams();
  const {
    username
  } = Route$4.useSearch();
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [reason, setReason] = reactExports.useState("spam");
  const [details, setDetails] = reactExports.useState("");
  const [agreed, setAgreed] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/welcome",
      replace: true
    });
  }, [loading, user, navigate]);
  reactExports.useEffect(() => {
    if (user && user.id === userId) {
      toast.error("You can't report yourself");
      navigate({
        to: "/",
        replace: true
      });
    }
  }, [user, userId, navigate]);
  const submit = async () => {
    if (!agreed) {
      toast.error("Please confirm you are reporting in good faith.");
      return;
    }
    setSubmitting(true);
    try {
      await submitReport({
        data: {
          targetType: "user",
          targetId: userId,
          reason,
          details: details.trim() || void 0
        }
      });
      toast.success("Report submitted. Our team will review it.");
      navigate({
        to: "/",
        replace: true
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit report");
    } finally {
      setSubmitting(false);
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold", children: "Report creator" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md space-y-5 px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Help us keep ViralSnap safe. Select a reason for reporting ",
        label,
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { value: reason, onValueChange: (v) => setReason(v), className: "grid gap-2", children: REASONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-secondary/20 px-4 py-3 text-sm hover:border-primary/40 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: r.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.label })
      ] }, r.value)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "report-details", className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Additional details (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "report-details", value: details, onChange: (e) => setDetails(e.target.value), placeholder: "Please provide any specific info...", maxLength: 1e3, rows: 3, className: "rounded-xl bg-secondary/40" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-border/40 bg-secondary/10 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { id: "report-agree", checked: agreed, onCheckedChange: (v) => setAgreed(v === true), className: "mt-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "report-agree", className: "cursor-pointer text-xs leading-relaxed text-muted-foreground", children: "I confirm that this report is accurate and submitted in good faith. I understand that submitting false reports may result in account action." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => navigate({
          to: "/"
        }), className: "flex-1 rounded-full", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: submitting || !agreed, className: "flex-1 rounded-full bg-gradient-fire text-white shadow-glow", children: submitting ? "Submitting…" : "Submit report" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  ReportCreatorPage as component
};
