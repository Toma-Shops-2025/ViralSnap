import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Send } from "lucide-react";
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

async function fetchComments(videoId: string): Promise<CommentItem[]> {
  const { data: comments } = await supabase
    .from("comments")
    .select("id, text, created_at, user_id")
    .eq("video_id", videoId)
    .order("created_at", { ascending: false });
  if (!comments || comments.length === 0) return [];
  const ids = [...new Set(comments.map((c) => c.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", ids);
  const map = new Map((profiles ?? []).map((p) => [p.id, p]));
  return comments.map((c) => {
    const p = map.get(c.user_id);
    return {
      ...c,
      username: p?.username ?? "creator",
      display_name: p?.display_name ?? "Creator",
      avatar_url: p?.avatar_url ?? null,
    };
  });
}

export function CommentsSheet({ open, onOpenChange, videoId }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => fetchComments(videoId),
    enabled: open,
  });

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
          <SheetTitle className="font-display text-base">
            {comments.length} comment{comments.length === 1 ? "" : "s"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3 no-scrollbar">
          {comments.length === 0 && (
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
