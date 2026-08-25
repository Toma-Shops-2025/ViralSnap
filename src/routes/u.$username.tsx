import { createFileRoute, useParams, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo, useRef } from "react";
import { Play, Heart, Settings, LogOut, Gift, Flame, HeartHandshake, Share2, LinkIcon, X, Pencil, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BottomNav } from "@/components/bottom-nav";
import { GiftDialog } from "@/components/gift-dialog";
import { VideoCard } from "@/components/video-card";
import { VideoGridThumb } from "@/components/video-grid-thumb";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { getStripeEnvironment } from "@/lib/stripe";
import { SUPPORTER_PRICE_LABEL } from "@/lib/subscriptions";
import { compact } from "@/lib/format";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import { PayoutSetupBanner } from "@/components/payout-setup-banner";
import { getPublicProfile } from "@/lib/profile.functions";

export const Route = createFileRoute("/u/$username")({
  loader: ({ params }) => getPublicProfile({ data: { username: params.username } }),
  head: ({ loaderData }) => {
    const p = loaderData?.profile;
    if (!p) return { meta: [{ title: "Creator — ViralSnap" }] };
    const title = `${p.display_name} (@${p.username}) — ViralSnap`;
    const description =
      p.bio && p.bio.trim()
        ? p.bio.trim().slice(0, 160)
        : `Watch ${p.display_name}'s short videos and support them on ViralSnap.`;
    const url = `https://viralsnap.online/u/${p.username}`;
    const image = p.avatar_url ?? undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: url },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(image ? [{ name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ProfilePage,
});

type Vid = Tables<"videos">;

async function fetchProfileData(username: string, viewerId?: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (!profile) return null;

  const [{ count: followers }, { count: following }, { data: videos }, followRow] =
    await Promise.all([
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", profile.id),
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", profile.id),
      supabase
        .from("videos")
        .select("*")
        .eq("creator_id", profile.id)
        .eq("status", "published")
        .order("created_at", { ascending: false }),
      viewerId
        ? supabase
            .from("follows")
            .select("id")
            .eq("follower_id", viewerId)
            .eq("following_id", profile.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  return {
    profile,
    followers: followers ?? 0,
    following: following ?? 0,
    videos: (videos ?? []) as Vid[],
    isFollowing: !!followRow.data,
  };
}

function ProfilePage() {
  const { username } = useParams({ from: "/u/$username" });
  const { user, profile: myProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showGift, setShowGift] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "feed">("grid");
  const [activeIdx, setActiveIdx] = useState(0);
  const [muted, setMuted] = useState(true);

  // Ownership Edit State
  const [editingVideo, setEditingPost] = useState<Vid | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editPinnedComment, setEditPinnedComment] = useState("");
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [postBusy, setPostBusy] = useState(false);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const feedContainerRef = useRef<HTMLDivElement>(null);

  const { openCheckout, closeCheckout, isOpen, checkoutElement } = useStripeCheckout();
  const loaderData = Route.useLoaderData();

  const { data, isLoading } = useQuery({
    queryKey: ["profile", username, user?.id],
    queryFn: () => fetchProfileData(username, user?.id),
    initialData: loaderData ? { ...loaderData, isFollowing: false } : undefined,
  });

  const creatorId = data?.profile?.id;
  const isMe = myProfile?.username === username;

  // Scroll to active index when switching to feed
  useEffect(() => {
    if (viewMode === "feed" && feedContainerRef.current) {
      const target = feedContainerRef.current.children[activeIdx] as HTMLElement;
      if (target) {
        target.scrollIntoView({ behavior: "auto" });
      }
    }
  }, [viewMode, activeIdx]);

  const onThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingThumb(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/thumb-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("covers").upload(path, file);
      if (error) throw error;
      const { data: pub } = supabase.storage.from("covers").getPublicUrl(path);
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
      const { error } = await supabase
        .from("videos")
        .update({
          title: editTitle.trim(),
          caption: editCaption.trim(),
          pinned_comment: editPinnedComment.trim() || null,
          cover_url: editThumbnailUrl || editingVideo.cover_url
        })
        .eq("id", editingVideo.id);
      if (error) throw error;
      toast.success("Video updated");
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
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
      const { error } = await supabase.from("videos").delete().eq("id", deletingPostId);
      if (error) throw error;
      toast.success("Video deleted");
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
      setDeletingPostId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setPostBusy(false);
    }
  };

  const handleSupport = () => {
    if (!user) return navigate({ to: "/welcome" });
    if (!creatorId) return;
    openCheckout({
      creatorId,
      userId: user.id,
      customerEmail: user.email ?? undefined,
      returnUrl: `${window.location.origin}/u/${username}?support=success`,
    });
  };

  const handleFollow = async () => {
    if (!user) return navigate({ to: "/welcome" });
    if (!data) return;
    if (data.isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", data.profile.id);
    } else {
      await supabase.from("follows").insert({ follower_id: user.id, following_id: data.profile.id });
    }
    queryClient.invalidateQueries({ queryKey: ["profile", username] });
  };

  if (isLoading) return <div className="flex min-h-[100dvh] items-center justify-center text-muted-foreground">Loading…</div>;
  if (!data) return <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 px-6 text-center"><Flame className="h-10 w-10 text-primary" /><p className="font-display text-lg font-bold">Creator not found</p><Link to="/" className="text-sm text-primary">Back to feed</Link></div>;

  const { profile, followers, following, videos, isFollowing } = data;

  if (viewMode === "feed") {
    return (
      <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
        <header className="absolute inset-x-0 top-0 z-30 flex items-center gap-3 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))]">
          <button onClick={() => setViewMode("grid")} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 text-center">
            <p className="font-display text-sm font-bold text-white drop-shadow">@{profile.username}'s Videos</p>
          </div>
          <div className="w-9" />
        </header>
        <div ref={feedContainerRef} className="h-full snap-y snap-mandatory overflow-y-scroll no-scrollbar">
          {videos.map((v: Vid, i: number) => (
            <div key={v.id} className="h-full w-full snap-start relative">
              <VideoCard
                video={{ ...v, creator: profile, liked: false }}
                isActive={i === activeIdx}
                isMuted={muted}
                onToggleMute={() => setMuted(!muted)}
              />
              {isMe && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
                  <button onClick={() => {
                    setEditingPost(v);
                    setEditTitle(v.title || "");
                    setEditCaption(v.caption || "");
                    setEditPinnedComment((v as any).pinned_comment || "");
                    setEditThumbnailUrl(v.cover_url || "");
                  }} className="h-10 w-10 grid place-items-center rounded-full bg-black/40 text-white backdrop-blur border border-white/20">
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button onClick={() => setDeletingPostId(v.id)} className="h-10 w-10 grid place-items-center rounded-full bg-black/40 text-destructive backdrop-blur border border-destructive/20">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <Dialog open={!!editingVideo} onOpenChange={(o) => !o && setEditingPost(null)}>
          <DialogContent className="max-h-[90dvh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit post</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Thumbnail</Label>
                <div className="mt-2 flex items-center gap-4">
                  <img src={editThumbnailUrl || editingVideo?.cover_url || ""} className="h-24 w-16 rounded-md object-cover bg-secondary" alt="Thumb" />
                  <Button variant="outline" size="sm" onClick={() => thumbInputRef.current?.click()} disabled={uploadingThumb}>
                    {uploadingThumb ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change Image"}
                  </Button>
                  <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={onThumbnailUpload} />
                </div>
              </div>
              <div>
                <Label>Title</Label>
                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>
              <div>
                <Label>Caption</Label>
                <Textarea value={editCaption} onChange={(e) => setEditCaption(e.target.value)} rows={3} />
              </div>
              <div>
                <Label>Pinned Comment</Label>
                <Textarea value={editPinnedComment} onChange={(e) => setEditPinnedComment(e.target.value)} placeholder="Add a comment to pin at the top..." rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
              <Button onClick={savePostEdit} disabled={saving} className="bg-gradient-fire text-white">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deletingPostId} onOpenChange={(o) => !o && setDeletingPostId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this video?</AlertDialogTitle>
              <AlertDialogDescription>This permanently removes the video and all its data. This cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white">{postBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete forever"}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="px-4 pt-[calc(1.25rem+env(safe-area-inset-top))]">
        <div className="flex items-start justify-between">
          {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.username} className="h-20 w-20 rounded-full border-2 border-primary object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-fire text-2xl font-bold text-primary-foreground">{profile.display_name.charAt(0).toUpperCase()}</div>}
          {isMe && (
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => navigate({ to: "/settings" })} className="rounded-full border-border bg-card"><Settings className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => navigate({ to: "/share" })} className="rounded-full border-border bg-card"><Share2 className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={async () => { await signOut(); toast.success("Signed out"); navigate({ to: "/" }); }} className="rounded-full border-border bg-card"><LogOut className="h-4 w-4" /></Button>
            </div>
          )}
        </div>
        <h1 className="mt-3 font-display text-xl font-bold">{profile.display_name}</h1>
        <p className="text-sm text-muted-foreground">@{profile.username}</p>
        {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}

        <div className="mt-2 flex flex-col gap-1.5">
          {(profile as any).links && Array.isArray((profile as any).links) ? (
            (profile as any).links.map((link: string, i: number) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{link.replace(/^https?:\/\//, "")}</span>
              </a>
            ))
          ) : profile.link_url ? (
            <a
              href={profile.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <LinkIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{profile.link_url.replace(/^https?:\/\//, "")}</span>
            </a>
          ) : null}
        </div>

        <div className="mt-4 flex gap-6">
          <Stat label="Followers" value={followers} />
          <Stat label="Following" value={following} />
          <Stat label="Earned" value={profile.total_earned} gold />
        </div>
        <div className="mt-4 flex gap-2">
          {isMe ? (
            <Link
              to="/upload"
              className="flex-1 rounded-full bg-gradient-fire py-2 text-center text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Upload video
            </Link>
          ) : (
            <>
              <Button
                onClick={handleFollow}
                className={`flex-1 rounded-full ${
                  isFollowing
                    ? "bg-secondary text-foreground hover:bg-secondary/80"
                    : "bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button
                onClick={() => setShowGift(true)}
                variant="outline"
                className="rounded-full border-gold/50 bg-card text-gold"
              >
                <Gift className="h-4 w-4" /> Gift
              </Button>
            </>
          )}
        </div>
        {!isMe && (
          <button
            onClick={handleSupport}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-ember py-2.5 text-sm font-semibold text-white shadow-glow"
          >
            <HeartHandshake className="h-4 w-4" />
            Support {SUPPORTER_PRICE_LABEL}
          </button>
        )}
      </header>

      <div className="mx-auto mt-6 max-w-2xl px-1">
        <div className="grid grid-cols-3 gap-1">
          {videos.map((v: Vid, i: number) => (
            <button key={v.id} onClick={() => { setActiveIdx(i); setViewMode("feed"); }} className="group relative aspect-[9/14] overflow-hidden rounded-lg bg-card">
              <VideoGridThumb video={v} alt={v.title || "Video"} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-2 text-[10px] text-white/90">
                <span className="flex items-center gap-0.5"><Play className="h-2.5 w-2.5 fill-white" /> {compact(v.view_count)}</span>
                <span className="flex items-center gap-0.5"><Heart className="h-2.5 w-2.5 fill-white" /> {compact(v.like_count)}</span>
              </div>
            </button>
          ))}
        </div>
        {videos.length === 0 && <p className="py-16 text-center text-sm text-muted-foreground">No videos yet.</p>}
      </div>

      <BottomNav />

      {!isMe && data?.profile && (
        <GiftDialog
          open={showGift}
          onOpenChange={setShowGift}
          receiverId={data.profile.id}
          receiverName={data.profile.username}
        />
      )}
    </div>
  );
}

function Stat({ label, value, gold }: { label: string; value: number; gold?: boolean }) {
  return (
    <div>
      <p className={`font-display text-lg font-bold ${gold ? "text-gold" : ""}`}>{compact(value)}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
