import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useParams, u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as Button, b as buttonVariants } from "./button-DA2gxxPy.mjs";
import { D as Dialog, a as DialogContent, d as DialogHeader, e as DialogTitle, c as DialogFooter } from "./dialog-CU0WvJwq.mjs";
import { R as Root2, P as Portal2, a as Content2, T as Title2, D as Description2, C as Cancel, A as Action, O as Overlay2 } from "../_libs/radix-ui__react-alert-dialog.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { L as Label } from "./checkbox-SZ4443Uy.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { B as BottomNav } from "./bottom-nav-Bx8ufx_y.mjs";
import { V as VideoCard } from "./video-card-DsuuXof8.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { u as useAuth, R as Route$4 } from "./router-QVK_Sz8y.mjs";
import { u as useStripeCheckout } from "./useStripeCheckout-lWL6EZ3N.mjs";
import { c as compact } from "./format-DD3jW9wI.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/hls.js.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import "../_libs/stripe__react-stripe-js.mjs";
import "../_libs/stripe__stripe-js.mjs";
import { s as Flame, a as ArrowLeft, O as Pencil, a1 as Trash2, y as LoaderCircle, W as Settings, X as Share2, I as LogOut, L as Link$1, t as Gift, w as HeartHandshake, Q as Play, v as Heart } from "../_libs/lucide-react.mjs";
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
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "./server-Dx3nuNLW.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-Co1FUz65.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "./client.server-U_pH-Evd.mjs";
import "./stripe.server-CgDo0qox.mjs";
import "node:process";
import "events";
import "http";
import "https";
import "os";
import "./stripe-B2IM9WNU.mjs";
import "./payments.functions-oTpZTTWw.mjs";
import "../_libs/prop-types.mjs";
const AlertDialog = Root2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
const SUPPORTER_PRICE_LABEL = "$4.99/mo";
async function fetchProfileData(username, viewerId) {
  const {
    data: profile
  } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
  if (!profile) return null;
  const [{
    count: followers
  }, {
    count: following
  }, {
    data: videos
  }, followRow] = await Promise.all([supabase.from("follows").select("*", {
    count: "exact",
    head: true
  }).eq("following_id", profile.id), supabase.from("follows").select("*", {
    count: "exact",
    head: true
  }).eq("follower_id", profile.id), supabase.from("videos").select("*").eq("creator_id", profile.id).eq("status", "published").order("created_at", {
    ascending: false
  }), viewerId ? supabase.from("follows").select("id").eq("follower_id", viewerId).eq("following_id", profile.id).maybeSingle() : Promise.resolve({
    data: null
  })]);
  return {
    profile,
    followers: followers ?? 0,
    following: following ?? 0,
    videos: videos ?? [],
    isFollowing: !!followRow.data
  };
}
function ProfilePage() {
  const {
    username
  } = useParams({
    from: "/u/$username"
  });
  const {
    user,
    profile: myProfile,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showGift, setShowGift] = reactExports.useState(false);
  const [viewMode, setViewMode] = reactExports.useState("grid");
  const [activeIdx, setActiveIdx] = reactExports.useState(0);
  const [muted, setMuted] = reactExports.useState(true);
  const [editingVideo, setEditingPost] = reactExports.useState(null);
  const [editTitle, setEditTitle] = reactExports.useState("");
  const [editCaption, setEditCaption] = reactExports.useState("");
  const [editPinnedComment, setEditPinnedComment] = reactExports.useState("");
  const [editThumbnailUrl, setEditThumbnailUrl] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [uploadingThumb, setUploadingThumb] = reactExports.useState(false);
  const [deletingPostId, setDeletingPostId] = reactExports.useState(null);
  const [postBusy, setPostBusy] = reactExports.useState(false);
  const thumbInputRef = reactExports.useRef(null);
  const feedContainerRef = reactExports.useRef(null);
  const {
    openCheckout
  } = useStripeCheckout();
  const loaderData = Route$4.useLoaderData();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["profile", username, user?.id],
    queryFn: () => fetchProfileData(username, user?.id),
    initialData: loaderData ? {
      ...loaderData,
      isFollowing: false
    } : void 0
  });
  const creatorId = data?.profile?.id;
  const isMe = myProfile?.username === username;
  reactExports.useEffect(() => {
    if (viewMode === "feed" && feedContainerRef.current) {
      const target = feedContainerRef.current.children[activeIdx];
      if (target) {
        target.scrollIntoView({
          behavior: "auto"
        });
      }
    }
  }, [viewMode, activeIdx]);
  const onThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingThumb(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/thumb-${Date.now()}.${ext}`;
      const {
        error
      } = await supabase.storage.from("covers").upload(path, file);
      if (error) throw error;
      const {
        data: pub
      } = supabase.storage.from("covers").getPublicUrl(path);
      setEditThumbnailUrl(pub.publicUrl);
      toast.success("Thumbnail uploaded. Remember to save changes.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingThumb(false);
    }
  };
  const savePostEdit = async () => {
    if (!editingVideo) return;
    setSaving(true);
    try {
      const {
        error
      } = await supabase.from("videos").update({
        title: editTitle.trim(),
        caption: editCaption.trim(),
        pinned_comment: editPinnedComment.trim() || null,
        cover_url: editThumbnailUrl || editingVideo.cover_url
      }).eq("id", editingVideo.id);
      if (error) throw error;
      toast.success("Video updated");
      queryClient.invalidateQueries({
        queryKey: ["profile", username]
      });
      setEditingPost(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };
  const confirmDelete = async () => {
    if (!deletingPostId) return;
    setPostBusy(true);
    try {
      const {
        error
      } = await supabase.from("videos").delete().eq("id", deletingPostId);
      if (error) throw error;
      toast.success("Video deleted");
      queryClient.invalidateQueries({
        queryKey: ["profile", username]
      });
      setDeletingPostId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setPostBusy(false);
    }
  };
  const handleSupport = () => {
    if (!user) return navigate({
      to: "/welcome"
    });
    if (!creatorId) return;
    openCheckout({
      creatorId,
      userId: user.id,
      customerEmail: user.email ?? void 0,
      returnUrl: `${window.location.origin}/u/${username}?support=success`
    });
  };
  const handleFollow = async () => {
    if (!user) return navigate({
      to: "/welcome"
    });
    if (!data) return;
    if (data.isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", data.profile.id);
    } else {
      await supabase.from("follows").insert({
        follower_id: user.id,
        following_id: data.profile.id
      });
    }
    queryClient.invalidateQueries({
      queryKey: ["profile", username]
    });
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[100dvh] items-center justify-center text-muted-foreground", children: "Loading…" });
  if (!data) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-[100dvh] flex-col items-center justify-center gap-3 px-6 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-10 w-10 text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold", children: "Creator not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-sm text-primary", children: "Back to feed" })
  ] });
  const {
    profile,
    followers,
    following,
    videos,
    isFollowing
  } = data;
  if (viewMode === "feed") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[100dvh] w-full overflow-hidden bg-black", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "absolute inset-x-0 top-0 z-30 flex items-center gap-3 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewMode("grid"), className: "flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-sm font-bold text-white drop-shadow", children: [
          "@",
          profile.username,
          "'s Videos"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: feedContainerRef, className: "h-full snap-y snap-mandatory overflow-y-scroll no-scrollbar", children: videos.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full w-full snap-start relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(VideoCard, { video: {
          ...v,
          creator: profile,
          liked: false
        }, isActive: i === activeIdx, isMuted: muted, onToggleMute: () => setMuted(!muted) }),
        isMe && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setEditingPost(v);
            setEditTitle(v.title || "");
            setEditCaption(v.caption || "");
            setEditPinnedComment(v.pinned_comment || "");
            setEditThumbnailUrl(v.cover_url || "");
          }, className: "h-10 w-10 grid place-items-center rounded-full bg-black/40 text-white backdrop-blur border border-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDeletingPostId(v.id), className: "h-10 w-10 grid place-items-center rounded-full bg-black/40 text-destructive backdrop-blur border border-destructive/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-5 w-5" }) })
        ] })
      ] }, v.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editingVideo, onOpenChange: (o) => !o && setEditingPost(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90dvh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit post" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Thumbnail" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: editThumbnailUrl || editingVideo?.cover_url || "", className: "h-24 w-16 rounded-md object-cover bg-secondary", alt: "Thumb" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => thumbInputRef.current?.click(), disabled: uploadingThumb, children: uploadingThumb ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Change Image" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: thumbInputRef, type: "file", accept: "image/*", className: "hidden", onChange: onThumbnailUpload })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editTitle, onChange: (e) => setEditTitle(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Caption" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: editCaption, onChange: (e) => setEditCaption(e.target.value), rows: 3 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Pinned Comment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: editPinnedComment, onChange: (e) => setEditPinnedComment(e.target.value), placeholder: "Add a comment to pin at the top...", rows: 2 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditingPost(null), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: savePostEdit, disabled: saving, className: "bg-gradient-fire text-white", children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Save Changes" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deletingPostId, onOpenChange: (o) => !o && setDeletingPostId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this video?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This permanently removes the video and all its data. This cannot be undone." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: confirmDelete, className: "bg-destructive text-white", children: postBusy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Delete forever" })
        ] })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[100dvh] pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-4 pt-[calc(1.25rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        profile.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profile.avatar_url, alt: profile.username, className: "h-20 w-20 rounded-full border-2 border-primary object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-20 w-20 items-center justify-center rounded-full bg-gradient-fire text-2xl font-bold text-primary-foreground", children: profile.display_name.charAt(0).toUpperCase() }),
        isMe && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", onClick: () => navigate({
            to: "/settings"
          }), className: "rounded-full border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", onClick: () => navigate({
            to: "/share"
          }), className: "rounded-full border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", onClick: async () => {
            await signOut();
            toast.success("Signed out");
            navigate({
              to: "/"
            });
          }, className: "rounded-full border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-display text-xl font-bold", children: profile.display_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "@",
        profile.username
      ] }),
      profile.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm", children: profile.bio }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-col gap-1.5", children: profile.links && Array.isArray(profile.links) ? profile.links.map((link, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: link, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link$1, { className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: link.replace(/^https?:\/\//, "") })
      ] }, i)) : profile.link_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: profile.link_url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link$1, { className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: profile.link_url.replace(/^https?:\/\//, "") })
      ] }) : null }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Followers", value: followers }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Following", value: following }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Earned", value: profile.total_earned, gold: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex gap-2", children: isMe ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/upload", className: "flex-1 rounded-full bg-gradient-fire py-2 text-center text-sm font-semibold text-primary-foreground shadow-glow", children: "Upload video" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleFollow, className: `flex-1 rounded-full ${isFollowing ? "bg-secondary text-foreground hover:bg-secondary/80" : "bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90"}`, children: isFollowing ? "Following" : "Follow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowGift(true), variant: "outline", className: "rounded-full border-gold/50 bg-card text-gold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4" }),
          " Gift"
        ] })
      ] }) }),
      !isMe && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSupport, className: "mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-ember py-2.5 text-sm font-semibold text-white shadow-glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HeartHandshake, { className: "h-4 w-4" }),
        "Support ",
        SUPPORTER_PRICE_LABEL
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto mt-6 max-w-2xl px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1", children: videos.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        setActiveIdx(i);
        setViewMode("feed");
      }, className: "group relative aspect-[9/14] overflow-hidden rounded-lg bg-card", children: [
        v.cover_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: v.cover_url, alt: v.title, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: v.media_url ?? void 0, muted: true, playsInline: true, preload: "metadata", className: "h-full w-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-1.5 left-1.5 flex items-center gap-2 text-[10px] text-white/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-2.5 w-2.5 fill-white" }),
            " ",
            compact(v.view_count)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-2.5 w-2.5 fill-white" }),
            " ",
            compact(v.like_count)
          ] })
        ] })
      ] }, v.id)) }),
      videos.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-16 text-center text-sm text-muted-foreground", children: "No videos yet." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
function Stat({
  label,
  value,
  gold
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-display text-lg font-bold ${gold ? "text-gold" : ""}`, children: compact(value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label })
  ] });
}
export {
  ProfilePage as component
};
