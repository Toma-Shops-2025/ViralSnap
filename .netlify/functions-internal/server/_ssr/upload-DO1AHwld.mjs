import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, c as createSsrRpc } from "./router-QVK_Sz8y.mjs";
import { u as useProSubscription } from "./use-pro-uwbyDMJB.mjs";
import { a as createServerFn } from "./server-Dx3nuNLW.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Co1FUz65.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import "../_libs/stripe.mjs";
import "../_libs/stripe__stripe-js.mjs";
import "../_libs/seroval.mjs";
import { y as LoaderCircle, a as ArrowLeft, a6 as Upload, P as PanelsTopLeft, $ as Smartphone, ad as X, a5 as Type, H as Hash, N as Music, g as ChevronRight, J as MapPin, Y as Shield } from "../_libs/lucide-react.mjs";
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
import "./stripe-B2IM9WNU.mjs";
const STORAGE_BASE = `${process.env.SUPABASE_URL ?? ""}/storage/v1/object/public/`;
const isVideosBucketUrl = (u) => STORAGE_BASE !== "/storage/v1/object/public/" && u.startsWith(`${STORAGE_BASE}videos/`);
const publishVideo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  mediaUrl: stringType().url().refine(isVideosBucketUrl, "mediaUrl must point to the videos bucket"),
  coverUrl: stringType().url().refine((u) => STORAGE_BASE !== "/storage/v1/object/public/" && u.startsWith(`${STORAGE_BASE}covers/`), "coverUrl must point to the covers bucket").nullish(),
  title: stringType().min(1).max(140),
  caption: stringType().max(2e3).optional(),
  tags: arrayType(stringType().min(1).max(40)).max(15).optional()
}).parse(input)).handler(createSsrRpc("9dc2a96700ef0a093e0b587aaab6f32df94416bea3ce7e29c1cfb5bf14f68360"));
function UploadPage() {
  const {
    user,
    profile,
    loading
  } = useAuth();
  const {
    isPro
  } = useProSubscription();
  const navigate = useNavigate();
  const [step, setTab] = reactExports.useState("file");
  const [file, setFile] = reactExports.useState(null);
  const [preview, setPreview] = reactExports.useState(null);
  const [title, setTitle] = reactExports.useState("");
  const [caption, setCaption] = reactExports.useState("");
  const [tags, setTags] = reactExports.useState("");
  const [uploading, setUploading] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const fileInputRef = reactExports.useRef(null);
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
    setPreview(URL.createObjectURL(f));
    setTab("details");
  };
  const uploadVideoFile = async (videoFile) => {
    const ext = videoFile.name.split(".").pop() ?? "mp4";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const {
      data: sessionData
    } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) throw new Error("Not signed in");
    const baseUrl = "https://ylfrcrigmazlptxnlzqm.supabase.co";
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsZnJjcmlnbWF6bHB0eG5senFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTkyMzQsImV4cCI6MjA5MzkzNTIzNH0.8Q8zNUl2c9gijT8B25wvwmK2HoWMX8M21hzu5Ipo9ec";
    const url = `${baseUrl}/storage/v1/object/videos/${path}`;
    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.setRequestHeader("apikey", apiKey);
      xhr.setRequestHeader("Content-Type", videoFile.type || "video/mp4");
      xhr.setRequestHeader("x-upsert", "false");
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round(e.loaded / e.total * 85));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error("Upload failed"));
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(videoFile);
    });
    return supabase.storage.from("videos").getPublicUrl(path).data.publicUrl;
  };
  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);
    setTab("processing");
    setProgress(5);
    try {
      const mediaUrl = await uploadVideoFile(file);
      setProgress(90);
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
      toast.success("Video uploaded!");
      navigate({
        to: "/me",
        replace: true
      });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
      setTab("details");
      setUploading(false);
      setProgress(0);
    }
  };
  if (step === "processing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-dvh flex-col items-center justify-center p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-8 h-32 w-32", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 animate-pulse rounded-full bg-primary/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-4 rounded-full bg-card shadow-inner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-10 w-10 animate-spin text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "absolute inset-0 h-full w-full -rotate-90", children: /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "64", cy: "64", r: "60", fill: "none", stroke: "currentColor", strokeWidth: "8", className: "text-primary", strokeDasharray: 2 * Math.PI * 60, style: {
          strokeDashoffset: 2 * Math.PI * 60 * (1 - (progress || 10) / 100),
          transition: "stroke-dashoffset 0.5s ease"
        } }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold", children: "Uploading..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: progress < 100 ? `Sending your masterpiece to the cloud (${progress}%)` : "Publishing to your feed..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-dvh bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => step === "details" ? setTab("file") : navigate({
          to: -1
        }), className: "flex h-9 w-9 items-center justify-center rounded-full bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold", children: step === "file" ? "New Video" : "Details" })
      ] }),
      step === "details" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleUpload, disabled: uploading || !title, className: "rounded-full bg-primary px-5 py-1.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50", children: "Post" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md p-4", children: step === "file" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => fileInputRef.current?.click(), className: "group relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border bg-card transition-all hover:border-primary/50 hover:bg-secondary/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-primary/10 p-5 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: "Choose a video" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground px-8", children: [
              "Vertical videos (9:16) work best. Up to ",
              isPro ? "500MB" : "100MB",
              "."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", accept: "video/*", className: "hidden", onChange: onFileChange })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PanelsTopLeft, { className: "h-5 w-5 text-primary mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold italic", children: "Portrait" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-tight", children: "Aspect Ratio 9:16" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-5 w-5 text-primary mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold italic", children: "High Res" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-tight", children: "Up to 4K Supported" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[9/16] w-24 overflow-hidden rounded-xl border border-border bg-black shadow-lg", children: [
          preview && /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: preview, className: "h-full w-full object-cover opacity-60", muted: true, playsInline: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab("file"), className: "rounded-full bg-black/50 p-1.5 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-white" }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: true, placeholder: "Title your video...", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm font-medium outline-none focus:border-primary/50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "Add a description...", value: caption, onChange: (e) => setCaption(e.target.value), rows: 3, className: "w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary/50 resize-none" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5" }),
            " Hashtags"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "#dance #funny #tutorial", value: tags, onChange: (e) => setTags(e.target.value), className: "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary/50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "h-5 w-5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Add Sound" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Location" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-gold/20 bg-gold/5 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "mt-0.5 h-4 w-4 text-gold" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-gold uppercase tracking-wider italic", children: "Safety Check" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-muted-foreground leading-relaxed", children: "By posting, you agree to our Content Policy. AI safety filters will review your video during processing." })
          ] })
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  UploadPage as component
};
