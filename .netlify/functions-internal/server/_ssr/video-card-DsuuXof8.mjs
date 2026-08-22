import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as compact } from "./format-DD3jW9wI.mjs";
import { H as Hls } from "../_libs/hls.js.mjs";
import { u as useAuth, c as createSsrRpc } from "./router-QVK_Sz8y.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-CU0WvJwq.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { R as Root2, a as Item2, I as Indicator } from "../_libs/radix-ui__react-radio-group.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { L as Label, C as Checkbox } from "./checkbox-SZ4443Uy.mjs";
import { a as createServerFn } from "./server-Dx3nuNLW.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Co1FUz65.mjs";
import { R as Plus, v as Heart, K as MessageCircle, t as Gift, X as Share2, E as EllipsisVertical, _ as ShoppingBag, h as Circle } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, e as enumType } from "../_libs/zod.mjs";
const LEGACY_SUPABASE_HOSTS = [
  "gmvpdlefvsafqrblbpfi.supabase.co",
  "goorydexknxspyetdnsi.supabase.co"
];
function rewriteLegacyStorageUrl(url) {
  const current = "https://ylfrcrigmazlptxnlzqm.supabase.co";
  const origin = current.split("/rest/v1")[0].replace(/\/$/, "");
  if (!origin || !url) return url;
  let resolved = url;
  for (const legacy of LEGACY_SUPABASE_HOSTS) {
    resolved = resolved.replaceAll(`https://${legacy}`, origin);
  }
  return resolved;
}
function getVideoPlaybackUrl(video) {
  const mediaUrl = rewriteLegacyStorageUrl(video.media_url ?? "");
  if (mediaUrl) return mediaUrl;
  const muxPlaybackId = "mux_playback_id" in video ? video.mux_playback_id : null;
  if (muxPlaybackId) {
    return `https://stream.mux.com/${muxPlaybackId}.m3u8`;
  }
  return "";
}
function getVideoPosterUrl(video) {
  if (video.cover_url) return rewriteLegacyStorageUrl(video.cover_url);
  const muxPlaybackId = "mux_playback_id" in video ? video.mux_playback_id : null;
  if (muxPlaybackId) {
    return `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg?time=0`;
  }
  return null;
}
const BLOCKED_MEDIA_HOSTS = [
  "commondatastorage.googleapis.com/gtv-videos-bucket/sample"
];
function isPlayableFeedVideo(video) {
  if (video.mux_playback_id) return true;
  const url = rewriteLegacyStorageUrl(video.media_url ?? "");
  if (!url) return false;
  if (BLOCKED_MEDIA_HOSTS.some((host) => url.includes(host))) return false;
  if (url.includes(".supabase.co/storage/v1/object/public/videos/")) return true;
  return false;
}
function VideoPlayer({
  url,
  poster,
  isActive,
  isMuted,
  onToggleMute
}) {
  const videoRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!url) {
      el.removeAttribute("src");
      el.load();
      return;
    }
    let hls = null;
    let cancelled = false;
    const tryPlay = () => {
      if (cancelled || !isActive) return;
      el.play().catch((err) => {
        console.warn("Video play failed:", err);
      });
    };
    const pauseAndReset = () => {
      el.pause();
      el.currentTime = 0;
    };
    const isHls = url.endsWith(".m3u8");
    if (isHls && !el.canPlayType("application/vnd.apple.mpegurl") && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(el);
      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) console.warn("HLS fatal error:", data);
      });
    } else {
      const onCanPlay = () => tryPlay();
      el.src = url;
      el.load();
      el.addEventListener("canplay", onCanPlay, { once: true });
      return () => {
        cancelled = true;
        el.removeEventListener("canplay", onCanPlay);
        hls?.destroy();
        pauseAndReset();
      };
    }
    if (!isActive) pauseAndReset();
    return () => {
      cancelled = true;
      hls?.destroy();
      pauseAndReset();
    };
  }, [url, isActive]);
  reactExports.useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = isMuted;
  }, [isMuted]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-full w-full bg-black flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "video",
    {
      ref: videoRef,
      poster: poster ?? void 0,
      loop: true,
      playsInline: true,
      muted: isMuted,
      className: "h-full w-full object-cover",
      onClick: onToggleMute
    }
  ) });
}
const RadioGroup = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { className: cn("grid gap-2", className), ...props, ref });
});
RadioGroup.displayName = Root2.displayName;
const RadioGroupItem = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3.5 w-3.5 fill-primary" }) })
    }
  );
});
RadioGroupItem.displayName = Item2.displayName;
const REPORT_REASONS = ["spam", "harassment", "hate", "sexual", "violence", "csam", "impersonation", "ip_violation", "self_harm", "illegal", "other"];
const submitReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  targetType: enumType(["post", "comment", "user"]),
  targetId: stringType().uuid(),
  reason: enumType(REPORT_REASONS),
  details: stringType().max(1e3).optional()
}).parse(input)).handler(createSsrRpc("10550da1dd81c3125cbe8efccc913114a86d2be9c39f4fa8d629540563305455"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  targetUserId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("cd0be731928c8620a4ed002ddad5164e00790d9f214a0843964831bfee0483ca"));
const REASONS = [
  { value: "spam", label: "Spam or scam" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate", label: "Hate speech" },
  { value: "sexual", label: "Sexual content / nudity" },
  { value: "violence", label: "Violence or gore" },
  { value: "csam", label: "Child sexual abuse material" },
  { value: "self_harm", label: "Self-harm or suicide" },
  { value: "impersonation", label: "Impersonation" },
  { value: "ip_violation", label: "Copyright / IP violation" },
  { value: "illegal", label: "Illegal activity" },
  { value: "other", label: "Something else" }
];
function ReportDialog({
  open,
  onOpenChange,
  targetType,
  targetId
}) {
  const [reason, setReason] = reactExports.useState("spam");
  const [details, setDetails] = reactExports.useState("");
  const [agreed, setAgreed] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const reportFn = submitReport;
  const submit = async () => {
    if (!agreed) {
      toast.error("Please confirm you are reporting in good faith.");
      return;
    }
    setSubmitting(true);
    try {
      await reportFn({
        data: { targetType, targetId, reason, details: details.trim() || void 0 }
      });
      toast.success("Report submitted. Our team will review it.");
      onOpenChange(false);
      setDetails("");
      setReason("spam");
      setAgreed(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90dvh] overflow-y-auto sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Report ",
        targetType
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Help us keep ViralSnap safe. Please select a reason for this report." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { value: reason, onValueChange: (v) => setReason(v), className: "grid gap-2 py-2", children: REASONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Label,
      {
        className: "flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-secondary/20 px-4 py-3 text-sm hover:border-primary/40 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: r.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.label })
        ]
      },
      r.value
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "report-details", className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Additional Details (Optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          id: "report-details",
          value: details,
          onChange: (e) => setDetails(e.target.value),
          placeholder: "Please provide any specific info...",
          maxLength: 1e3,
          rows: 3,
          className: "rounded-xl bg-secondary/40"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-border/40 bg-secondary/10 p-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Checkbox,
        {
          id: "report-agree",
          checked: agreed,
          onCheckedChange: (v) => setAgreed(v === true),
          className: "mt-1"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "report-agree", className: "text-xs leading-relaxed text-muted-foreground cursor-pointer", children: "I confirm that this report is accurate and submitted in good faith. I understand that submitting false reports may result in account action." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0 mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), className: "rounded-full flex-1", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: submit,
          disabled: submitting || !agreed,
          className: "rounded-full flex-1 bg-gradient-fire text-white shadow-glow",
          children: submitting ? "Submitting…" : "Submit Report"
        }
      )
    ] })
  ] }) });
}
function VideoCard({
  video,
  isActive,
  isMuted,
  onToggleMute
}) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = reactExports.useState(false);
  const [likes, setLikes] = reactExports.useState(video.like_count || 0);
  const [following, setFollowing] = reactExports.useState(false);
  const [reportOpen, setReportOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user || !video) return;
    const checkStatus = async () => {
      const { data: like } = await supabase.from("likes").select("id").eq("video_id", video.id).eq("user_id", user.id).maybeSingle();
      setLiked(!!like);
      const { data: follow } = await supabase.from("follows").select("id").eq("following_id", video.creator_id).eq("follower_id", user.id).maybeSingle();
      setFollowing(!!follow);
    };
    checkStatus();
  }, [user, video]);
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate({ to: "/welcome" });
      return;
    }
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => newLiked ? prev + 1 : prev - 1);
    if (newLiked) {
      await supabase.from("likes").insert({ video_id: video.id, user_id: user.id });
    } else {
      await supabase.from("likes").delete().eq("video_id", video.id).eq("user_id", user.id);
    }
  };
  const handleFollow = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate({ to: "/welcome" });
      return;
    }
    if (following) return;
    setFollowing(true);
    const { error } = await supabase.from("follows").insert({
      follower_id: user.id,
      following_id: video.creator_id
    });
    if (error) {
      setFollowing(false);
      toast.error("Failed to follow");
    }
  };
  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: video.title || "Check out this video on ViralSnap",
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };
  const playbackUrl = getVideoPlaybackUrl(video);
  const posterUrl = getVideoPosterUrl(video);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[100dvh] w-full shrink-0 snap-start snap-always bg-black", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      VideoPlayer,
      {
        url: playbackUrl,
        poster: posterUrl,
        isActive,
        isMuted,
        onToggleMute
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-24 right-3 z-20 flex flex-col items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/u/$username", params: { username: video.creator.username }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-lg", children: video.creator.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: video.creator.avatar_url,
            alt: "",
            className: "h-full w-full object-cover"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600 text-white font-bold", children: video.creator.display_name?.[0].toUpperCase() }) }) }),
        !following && video.creator_id !== user?.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleFollow,
            className: "absolute -bottom-2 left-1/2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full bg-primary text-white ring-2 ring-black",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleLike,
          className: "group flex flex-col items-center gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-full p-2.5 transition-all ${liked ? "bg-primary shadow-glow" : "bg-black/30 backdrop-blur-md hover:bg-black/50"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `h-6 w-6 ${liked ? "fill-white text-white" : "text-white"}` }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white drop-shadow-md", children: compact(likes) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
          },
          className: "flex flex-col items-center gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-black/30 p-2.5 backdrop-blur-md hover:bg-black/50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-6 w-6 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white drop-shadow-md", children: compact(video.comment_count) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
          },
          className: "flex flex-col items-center gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-black/30 p-2.5 backdrop-blur-md hover:bg-black/50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-6 w-6 text-gold" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white drop-shadow-md", children: "Gift" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleShare,
          className: "flex flex-col items-center gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-black/30 p-2.5 backdrop-blur-md hover:bg-black/50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-6 w-6 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white drop-shadow-md", children: "Share" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setReportOpen(true),
          className: "rounded-full bg-black/30 p-2.5 backdrop-blur-md hover:bg-black/50 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-6 w-6 text-white" })
        }
      )
    ] }),
    video.product_url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-28 left-4 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: video.product_url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-3.5 w-3.5 text-gold" }),
          "Shop this item"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pb-12 pt-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/u/$username",
          params: { username: video.creator.username },
          className: "font-display text-base font-bold text-white hover:underline",
          children: [
            "@",
            video.creator.username
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "line-clamp-2 text-sm text-white/90 leading-snug", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: video.title }),
        " ",
        video.caption
      ] }),
      video.tags && video.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-x-2 gap-y-0.5", children: video.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "text-sm font-bold text-primary hover:underline",
          children: [
            "#",
            tag
          ]
        },
        tag
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReportDialog,
      {
        open: reportOpen,
        onClose: () => setReportOpen(false),
        videoId: video.id
      }
    )
  ] });
}
export {
  VideoCard as V,
  isPlayableFeedVideo as i
};
