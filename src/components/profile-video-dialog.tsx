import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import Hls from "hls.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { getVideoPlaybackUrl, getVideoPosterUrl, isAdaptiveStream } from "@/lib/video";
import type { Tables } from "@/integrations/supabase/types";

type Vid = Tables<"videos">;

type Props = {
  video: Vid | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOwner: boolean;
  onChanged?: () => void;
};

export function ProfileVideoDialog({ video, open, onOpenChange, isOwner, onChanged }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (video) {
      setTitle(video.title ?? "");
      setCaption(video.caption ?? "");
      setEditing(false);
    }
  }, [video]);

  // Wire up playback (HLS when needed).
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !open || !video) return;
    const url = getVideoPlaybackUrl(video);
    if (!url) return;

    if (isAdaptiveStream(video) && !el.canPlayType("application/vnd.apple.mpegurl") && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(el);
      return () => hls.destroy();
    }
    el.src = url;
    el.load();
  }, [open, video]);

  if (!video) return null;

  const poster = getVideoPosterUrl(video);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title can't be empty.");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("videos")
      .update({ title: title.trim(), caption: caption.trim() })
      .eq("id", video.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Video updated!");
    setEditing(false);
    onChanged?.();
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from("videos").delete().eq("id", video.id);
    setDeleting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Video deleted.");
    setConfirmOpen(false);
    onOpenChange(false);
    onChanged?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto border-border bg-card p-0 sm:max-w-md">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
          <video
            ref={videoRef}
            poster={poster ?? undefined}
            controls
            playsInline
            autoPlay
            className="h-full w-full object-contain"
          />
        </div>

        <div className="space-y-3 p-4">
          {editing ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">Edit video</DialogTitle>
              </DialogHeader>
              <div>
                <Label htmlFor="v-title">Title</Label>
                <Input
                  id="v-title"
                  value={title}
                  maxLength={100}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 rounded-xl bg-secondary/40"
                />
              </div>
              <div>
                <Label htmlFor="v-caption">Caption</Label>
                <Textarea
                  id="v-caption"
                  value={caption}
                  maxLength={300}
                  rows={3}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-1 rounded-xl bg-secondary/40"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  className="rounded-full border-border"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90"
                >
                  {saving ? "Saving…" : "Save"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <h2 className="font-display text-lg font-bold">{video.title}</h2>
              {video.caption && <p className="text-sm text-muted-foreground">{video.caption}</p>}
              {isOwner && (
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    onClick={() => setEditing(true)}
                    className="flex-1 rounded-full border-border"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmOpen(true)}
                    className="flex-1 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent className="border-border bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this video?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes the video and its likes and comments. This can't be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  void handleDelete();
                }}
                disabled={deleting}
                className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete forever"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
