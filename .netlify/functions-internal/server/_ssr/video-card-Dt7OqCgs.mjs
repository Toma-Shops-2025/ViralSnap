import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as compact } from "./format-DD3jW9wI.mjs";
import { H as Hls } from "../_libs/hls.js.mjs";
import { u as useAuth } from "./router-DDjFEyQJ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, b as DialogDescription, c as DialogFooter } from "./dialog-C0PDZPpH.mjs";
import { B as Button } from "./button-DJnjoRwr.mjs";
import { T as Textarea } from "./textarea-CgEwOx0M.mjs";
import { R as RadioGroup, a as RadioGroupItem } from "./radio-group-CICG3f2N.mjs";
import { L as Label, C as Checkbox } from "./checkbox-B4QQ4Tul.mjs";
import { s as submitReport } from "./safety.functions-Cq86SRs9.mjs";
import { c as Root2, T as Trigger, P as Portal2, a as Content2, I as Item2, e as SubTrigger2, d as SubContent2, C as CheckboxItem2, b as ItemIndicator2, R as RadioItem2, L as Label2, S as Separator2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { c as cn } from "./utils-BB9uwBYF.mjs";
import { Q as Plus, x as Heart, N as MessageCircle, v as Gift, E as EllipsisVertical, W as Share2, Y as ShoppingBag, h as ChevronRight, g as Check, i as Circle } from "../_libs/lucide-react.mjs";
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
function isCurrentSupabaseVideoUrl(url) {
  return url.includes(".supabase.co/storage/v1/object/public/videos/");
}
function isPlayableFeedVideo(video) {
  const url = rewriteLegacyStorageUrl(video.media_url ?? "");
  if (!url) return false;
  if (BLOCKED_MEDIA_HOSTS.some((host) => url.includes(host))) return false;
  return isCurrentSupabaseVideoUrl(url);
}
function VideoPlayer({
  url,
  poster,
  isActive,
  isMuted,
  volume = 1,
  onToggleMute
}) {
  const videoRef = reactExports.useRef(null);
  const hlsRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    hlsRef.current?.destroy();
    hlsRef.current = null;
    if (!url) {
      el.removeAttribute("src");
      el.load();
      return;
    }
    const isHls = url.endsWith(".m3u8");
    if (isHls && !el.canPlayType("application/vnd.apple.mpegurl") && Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(el);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) console.warn("HLS fatal error:", data);
      });
    } else {
      el.src = url;
      el.load();
    }
    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [url]);
  reactExports.useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isActive) {
      el.currentTime = 0;
      el.muted = isMuted;
      el.volume = Math.min(1, Math.max(0, volume));
      void el.play().catch((err) => {
        console.warn("Video play failed:", err);
      });
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [isActive, url]);
  reactExports.useEffect(() => {
    const el = videoRef.current;
    if (!el || !isActive) return;
    el.muted = isMuted;
    el.volume = Math.min(1, Math.max(0, volume));
    if (!isMuted) {
      void el.play().catch(() => {
      });
    }
  }, [isMuted, volume, isActive]);
  reactExports.useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onVisibility = () => {
      if (document.hidden) {
        el.pause();
      } else if (isActive) {
        el.muted = isMuted;
        el.volume = Math.min(1, Math.max(0, volume));
        void el.play().catch(() => {
        });
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [isActive, isMuted, volume]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-full w-full bg-black flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "video",
    {
      ref: videoRef,
      poster: poster ?? void 0,
      crossOrigin: "anonymous",
      preload: "auto",
      loop: true,
      playsInline: true,
      muted: isMuted,
      className: "h-full w-full object-cover",
      onClick: () => {
        if (isMuted) onToggleMute();
      }
    }
  ) });
}
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
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
function VideoCard({
  video,
  isActive,
  isMuted,
  volume = 1,
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
        volume,
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "aria-label": "More options",
            onClick: (e) => e.stopPropagation(),
            className: "flex flex-col items-center gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-black/30 p-2.5 backdrop-blur-md hover:bg-black/50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-6 w-6 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white drop-shadow-md", children: "More" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DropdownMenuContent,
          {
            align: "end",
            side: "left",
            className: "z-[80] min-w-[11rem]",
            onClick: (e) => e.stopPropagation(),
            children: video.creator_id === user?.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { disabled: true, children: "This is your video" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DropdownMenuItem,
                {
                  onSelect: () => {
                    if (!user) {
                      navigate({ to: "/welcome" });
                      return;
                    }
                    setReportOpen(true);
                  },
                  children: "Report video"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DropdownMenuItem,
                {
                  onSelect: () => {
                    if (!user) {
                      navigate({ to: "/welcome" });
                      return;
                    }
                    const creatorId = video.creator_id || video.creator?.id;
                    if (!creatorId) return;
                    navigate({
                      to: "/report/user/$userId",
                      params: { userId: creatorId },
                      search: { username: video.creator?.username }
                    });
                  },
                  children: "Report creator"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DropdownMenuItem,
                {
                  className: "text-rose-400 focus:text-rose-400",
                  onSelect: () => {
                    if (!user) {
                      navigate({ to: "/welcome" });
                      return;
                    }
                    const creatorId = video.creator_id || video.creator?.id;
                    if (!creatorId) return;
                    navigate({
                      to: "/block/$userId",
                      params: { userId: creatorId },
                      search: { username: video.creator?.username }
                    });
                  },
                  children: "Block creator"
                }
              )
            ] })
          }
        )
      ] }),
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
        onOpenChange: setReportOpen,
        targetType: "post",
        targetId: video.id
      }
    )
  ] });
}
export {
  VideoCard as V,
  isPlayableFeedVideo as i
};
