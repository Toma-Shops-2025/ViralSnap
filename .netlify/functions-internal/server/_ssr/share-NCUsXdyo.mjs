import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-DJnjoRwr.mjs";
import { B as BottomNav } from "./bottom-nav-5QQReJYK.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { a as ArrowLeft, u as Flame, W as Share2, g as Check, o as Copy, D as Download } from "../_libs/lucide-react.mjs";
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
import "./router-DDjFEyQJ.mjs";
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
const version = 1;
const asset_id = "bb97b196-ba52-4a99-9175-b20c17505404";
const project_id = "8a67f22f-ae9a-403a-a8dd-be7967687b58";
const url = "/__l5e/assets-v1/bb97b196-ba52-4a99-9175-b20c17505404/viralsnap-qr.png";
const r2_key = "a/v1/8a67f22f-ae9a-403a-a8dd-be7967687b58/bb97b196-ba52-4a99-9175-b20c17505404/viralsnap-qr.png";
const original_filename = "viralsnap-qr.png";
const size = 81645;
const content_type = "image/png";
const created_at = "2026-06-18T13:20:55Z";
const qrAsset = {
  version,
  asset_id,
  project_id,
  url,
  r2_key,
  original_filename,
  size,
  content_type,
  created_at
};
const SHARE_URL = "https://viralsnap.online";
function SharePage() {
  const [copied, setCopied] = reactExports.useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy link");
    }
  };
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ViralSnap",
          text: "Check out ViralSnap — short videos that pay creators.",
          url: SHARE_URL
        });
      } catch {
      }
    } else {
      await handleCopy();
    }
  };
  const handleDownload = async () => {
    try {
      const res = await fetch(qrAsset.url);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = "viralsnap-qr.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);
    } catch {
      toast.error("Could not download the QR code");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[100dvh] pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "flex h-9 w-9 items-center justify-center rounded-full bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: "Share ViralSnap" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-md flex-col items-center px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2 text-gradient-fire", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold", children: "Spread the fire" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-6 text-center text-sm text-muted-foreground", children: "Scan the code or copy the link to invite friends to ViralSnap." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs rounded-3xl bg-white p-6 shadow-glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square w-full overflow-hidden rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: qrAsset.url, alt: "QR code to viralsnap.online", className: "h-full w-full object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center font-display text-base font-bold text-[#1a1326]", children: "viralsnap.online" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid w-full max-w-xs grid-cols-1 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleShare, className: "h-12 rounded-full bg-gradient-fire text-base font-semibold shadow-glow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "mr-2 h-5 w-5" }),
          " Share"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleCopy, variant: "secondary", className: "h-12 rounded-full text-sm font-semibold", children: [
            copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-2 h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "mr-2 h-4 w-4" }),
            copied ? "Copied" : "Copy link"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleDownload, variant: "secondary", className: "h-12 rounded-full text-sm font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
            " Download QR"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  SharePage as component
};
