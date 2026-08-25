import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Send, Pin } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { timeAgo } from "@/lib/format";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
  onCommentAdded?: () => void;
};

type CommentItem = {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
};

async function fetchCommentsAndMetadata(videoId: string) {
  const [{ data: video }, { data: comments }] = await Promise.all([
    supabase.from("videos").select("pinned_comment, creator_id").eq("id", videoId).maybeSingle(),
    supabase.from("comments").select("id, text, created_at, user_id").eq("video_id", videoId).order("created_at", { ascending: false })
  ]);

  if (!comments || comments.length === 0) return { video, comments: [] };

  const userIds = [...new Set(comments.map((c) => c.user_id))];
  if (video?.creator_id) userIds.push(video.creator_id);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", userIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const items = comments.map((c) => {
    const p = profileMap.get(c.user_id);
    return {
      ...c,
      username: p?.username ?? "creator",
      display_name: p?.display_name ?? "Creator",
      avatar_url: p?.avatar_url ?? null,
    };
  });

  let pinned = null;
  if (video?.pinned_comment && video.creator_id) {
    const p = profileMap.get(video.creator_id);
    pinned = {
      text: video.pinned_comment,
      username: p?.username ?? "creator",
      display_name: p?.display_name ?? "Creator",
      avatar_url: p?.avatar_url ?? null,
    };
  }

  return { video, comments: items, pinned };
}

export function CommentsSheet({ open, onOpenChange, videoId, onCommentAdded }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  const { data } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => fetchCommentsAndMetadata(videoId),
    enabled: open,
  });

  const comments = data?.comments ?? [];
  const pinned = data?.pinned;

  const submit = async () => {
    if (!user) {
      onOpenChange(false);
      navigate({ to: "/welcome" });
      return;
    }
    const value = text.trim();
    if (!value) return;
    setPosting(true);
    const { error } = await supabase
      .from("comments")
      .insert({ video_id: videoId, user_id: user.id, text: value });
    setPosting(false);
    if (!error) {
      setText("");
      onCommentAdded?.();
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[70vh] rounded-t-3xl border-border bg-card p-0"
      >
        <SheetHeader className="border-b border-border px-4 py-3">
          <SheetTitle className="font-display text-base text-left">
            {comments.length} comment{comments.length === 1 ? "" : "s"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 no-scrollbar">
          {pinned && (
            <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3 mb-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 mb-2 text-primary font-bold text-[10px] uppercase tracking-wider">
                <Pin className="h-3 w-3" /> Pinned by Creator
              </div>
              <div className="flex gap-3">
                {pinned.avatar_url ? (
                  <img src={pinned.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover border-2 border-primary/20" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-fire text-xs font-bold text-primary-foreground">
                    {pinned.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs text-primary/80 font-semibold">@{pinned.username}</p>
                  <p className="text-sm text-foreground">{pinned.text}</p>
                </div>
              </div>
            </div>
          )}

          {comments.length === 0 && !pinned && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Be the first to comment.
            </p>
          )}

          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              {c.avatar_url ? (
                <img src={c.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-fire text-xs font-bold text-primary-foreground">
                  {c.display_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  @{c.username} · {timeAgo(c.created_at)}
                </p>
                <p className="text-sm">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={user ? "Add a comment…" : "Sign in to comment"}
            className="rounded-full bg-secondary"
          />
          <Button
            size="icon"
            onClick={submit}
            disabled={posting}
            className="shrink-0 rounded-full bg-gradient-fire text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
