import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, d as createSsrRpc } from "./router-DDjFEyQJ.mjs";
import { u as useProSubscription } from "./use-pro-DnWleJ0H.mjs";
import { a as createServerFn } from "./server-CauiqJuS.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DPXRLhra.mjs";
import { a as getStripeEnvironment } from "./stripe-B2IM9WNU.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { t as toastErrorMessage } from "./utils-BB9uwBYF.mjs";
import { a as assertContentAllowed } from "./content-policy-BiVAVm1B.mjs";
import "../_libs/stripe.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe__stripe-js.mjs";
import { a as ArrowLeft, Z as Sparkles, t as Film, a2 as Upload, I as LoaderCircle } from "../_libs/lucide-react.mjs";
import { o as objectType, a as arrayType, s as stringType } from "../_libs/zod.mjs";
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
import "./stripe.server-DSl7M_sI.mjs";
import "node:process";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "events";
import "http";
import "https";
import "os";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const isVideosBucketUrl = (u) => {
  try {
    const path = new URL(u).pathname;
    return path.includes("/storage/v1/object/public/videos/");
  } catch {
    return false;
  }
};
const publishVideo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  mediaUrl: stringType().url().refine(isVideosBucketUrl, "mediaUrl must point to the videos bucket"),
  coverUrl: stringType().url().refine((u) => {
    try {
      return new URL(u).pathname.includes("/storage/v1/object/public/covers/");
    } catch {
      return false;
    }
  }, "coverUrl must point to the covers bucket").nullish(),
  title: stringType().min(1).max(140),
  caption: stringType().max(2e3).optional(),
  tags: arrayType(stringType().min(1).max(40)).max(15).optional()
}).parse(input)).handler(createSsrRpc("9dc2a96700ef0a093e0b587aaab6f32df94416bea3ce7e29c1cfb5bf14f68360"));
const generatePostContent = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => {
  const idea = (data.idea ?? "").trim();
  if (idea.length < 2) throw new Error("Add a short idea first");
  return {
    idea: idea.slice(0, 400),
    environment: data.environment
  };
}).handler(createSsrRpc("1d773a27b431444d3e166725cb92462780a3c84b3616e1d5fd7f8947b5c82859"));
function UploadPage() {
  const {
    user,
    loading
  } = useAuth();
  const {
    isPro
  } = useProSubscription();
  const navigate = useNavigate();
  const [file, setFile] = reactExports.useState(null);
  const [title, setTitle] = reactExports.useState("");
  const [caption, setCaption] = reactExports.useState("");
  const [tags, setTags] = reactExports.useState("");
  const [idea, setIdea] = reactExports.useState("");
  const [genMetaLoading, setGenMetaLoading] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [busyLabel, setBusyLabel] = reactExports.useState("");
  const [progress, setProgress] = reactExports.useState(0);
  const fileInputRef = reactExports.useRef(null);
  const preview = reactExports.useMemo(() => file ? URL.createObjectURL(file) : null, [file]);
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/welcome",
      replace: true
    });
  }, [loading, user, navigate]);
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    if (f.size > (isPro ? 500 : 100) * 1024 * 1024) {
      toast.error(isPro ? "Video too large (max 500MB)" : "Video too large (max 100MB). Upgrade to Pro for more!");
      return;
    }
    setFile(f);
  };
  const handleGenerateMeta = async () => {
    if (!isPro) {
      toast.error("AI captions are a ViralSnap Pro feature");
      navigate({
        to: "/settings"
      });
      return;
    }
    const seed = idea.trim() || title.trim() || caption.trim();
    if (!seed) {
      toast.error("Type a quick idea or title first");
      return;
    }
    setGenMetaLoading(true);
    try {
      const meta = await generatePostContent({
        data: {
          idea: seed,
          environment: getStripeEnvironment()
        }
      });
      if ("error" in meta) {
        toast.error(toastErrorMessage(meta.error, "Could not generate caption"));
        return;
      }
      if (meta.titleOptions?.[0]) setTitle(meta.titleOptions[0]);
      if (meta.caption) setCaption(meta.caption);
      if (meta.hashtags?.length) {
        setTags(meta.hashtags.map((h) => `#${h}`).join(" "));
      }
      toast.success("Title, caption & hashtags generated");
    } catch (e) {
      toast.error(toastErrorMessage(e, "Could not generate caption"));
    } finally {
      setGenMetaLoading(false);
    }
  };
  const uploadVideoFile = async (videoFile) => {
    const ext = videoFile.name.split(".").pop() ?? "mp4";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const {
      error
    } = await supabase.storage.from("videos").upload(path, videoFile, {
      contentType: videoFile.type || "video/mp4",
      upsert: false
    });
    if (error) {
      const msg = error.message || "Upload failed";
      if (/invalid api key/i.test(msg)) {
        throw new Error("Supabase storage rejected the API key. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Netlify match your Supabase project anon key, then redeploy.");
      }
      if (/maximum allowed size|exceeded/i.test(msg)) {
        throw new Error("Upload exceeds storage size limit. In Supabase SQL Editor, run supabase/migrations/20260823120000_storage_videos_size_limit.sql, then try again.");
      }
      throw new Error(msg);
    }
    setProgress(85);
    return supabase.storage.from("videos").getPublicUrl(path).data.publicUrl;
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!file || !user) return toast.error("Pick a video file");
    if (!title.trim()) return toast.error("Add a title");
    setBusy(true);
    setBusyLabel("Uploading…");
    setProgress(5);
    try {
      assertContentAllowed({
        title: title.trim(),
        caption: caption.trim(),
        tags: tags.split(/[,\s]+/).map((t) => t.replace(/^#/, "").trim().toLowerCase()).filter(Boolean)
      });
      const mediaUrl = await uploadVideoFile(file);
      setProgress(90);
      setBusyLabel("Publishing…");
      const tagList = tags.split(/[,\s]+/).map((t) => t.replace(/^#/, "").trim().toLowerCase()).filter(Boolean);
      await publishVideo({
        data: {
          mediaUrl,
          title: title.trim(),
          caption: caption.trim(),
          tags: tagList
        }
      });
      setProgress(100);
      toast.success("Posted");
      navigate({
        to: "/",
        replace: true
      });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      setBusyLabel("");
      setProgress(0);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-dvh bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => navigate({
        to: -1
      }), className: "flex h-9 w-9 items-center justify-center rounded-full bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl tracking-tight text-gradient-gold", children: "New post" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Video. Made to go viral." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md px-5 pb-24 pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      !isPro && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/settings", className: "block rounded-md border border-gold/40 bg-gradient-to-r from-gold/10 to-transparent p-3 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 font-medium text-gold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
          " Unlock AI features with Pro"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block text-muted-foreground", children: "AI title, caption & hashtags are Pro perks. Upgrade in Settings →" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block cursor-pointer rounded-md border border-dashed border-border bg-card/40 p-4 hover:border-gold/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-md bg-background text-gold", children: file ? /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "Media (video)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs text-muted-foreground", children: file ? file.name : `Tap to choose a file · up to ${isPro ? "500MB" : "100MB"}` })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", accept: "video/*", className: "hidden", onChange: onFileChange })
      ] }),
      preview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-md border border-gold/20 bg-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: preview, className: "mx-auto max-h-56 w-full object-contain", muted: true, playsInline: true, controls: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, maxLength: 140, value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Title your video...", className: "w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-gold/50" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-md border border-gold/20 bg-card/30 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Quick idea (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: idea, onChange: (e) => setIdea(e.target.value), maxLength: 400, placeholder: "e.g. funny cooking fail with grandma", className: "w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-gold/50" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: genMetaLoading, onClick: handleGenerateMeta, className: "flex w-full items-center justify-center gap-2 rounded-md border border-gold/40 bg-card/40 px-3 py-2 text-xs uppercase tracking-[0.18em] text-gold hover:bg-card disabled:opacity-50", children: [
          genMetaLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
          genMetaLoading ? "Writing…" : "Generate title, caption & hashtags"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Type a short idea (or just a title) and let AI write the rest." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Caption", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, maxLength: 2e3, value: caption, onChange: (e) => setCaption(e.target.value), placeholder: "Add a description...", className: "w-full resize-none rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-gold/50" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Hashtags", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: tags, onChange: (e) => setTags(e.target.value), placeholder: "#dance #funny #tutorial", className: "w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-gold/50" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-gold/20 bg-gold/5 p-3 text-[11px] leading-relaxed text-muted-foreground", children: "By posting, you agree to our Content Policy. AI safety filters may review your video during processing." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: busy || !file, type: "submit", className: "flex w-full items-center justify-center gap-2 rounded-md bg-gradient-gold px-4 py-3 text-sm font-medium text-primary-foreground shadow-gold disabled:opacity-50", children: [
        busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        busy ? busyLabel || `Uploading… ${progress}%` : "Publish to the feed"
      ] })
    ] }) })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground", children: label }),
    children
  ] });
}
export {
  UploadPage as component
};
