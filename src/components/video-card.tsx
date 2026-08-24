import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Link2,
  MoreVertical,
  Gift,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { compact } from "@/lib/format";
import { getVideoPlaybackUrl, getVideoPosterUrl } from "@/lib/video";
import { VideoPlayer } from "./video-player";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ReportDialog } from "./report-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoCardProps {
  video: any;
  isActive: boolean;
  isMuted: boolean;
  volume?: number;
  onToggleMute: () => void;
}

export function VideoCard({
  video,
  isActive,
  isMuted,
  volume = 1,
  onToggleMute,
}: VideoCardProps) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video.like_count || 0);
  const [following, setFollowing] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // Check initial like/follow status
  useEffect(() => {
    if (!user || !video) return;

    const checkStatus = async () => {
      const { data: like } = await supabase
        .from("likes")
        .select("id")
        .eq("video_id", video.id)
        .eq("user_id", user.id)
        .maybeSingle();
      setLiked(!!like);

      const { data: follow } = await supabase
        .from("follows")
        .select("id")
        .eq("following_id", video.creator_id)
        .eq("follower_id", user.id)
        .maybeSingle();
      setFollowing(!!follow);
    };

    checkStatus();
  }, [user, video]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate({ to: "/welcome" });
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev: number) => (newLiked ? prev + 1 : prev - 1));

    if (newLiked) {
      await supabase.from("likes").insert({ video_id: video.id, user_id: user.id });
    } else {
      await supabase.from("likes").delete().eq("video_id", video.id).eq("user_id", user.id);
    }
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate({ to: "/welcome" });
      return;
    }

    if (following) return;
    setFollowing(true);
    const { error } = await supabase.from("follows").insert({
      follower_id: user.id,
      following_id: video.creator_id,
    });
    if (error) {
      setFollowing(false);
      toast.error("Failed to follow");
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: video.title || "Check out this video on ViralSnap",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const playbackUrl = getVideoPlaybackUrl(video);
  const posterUrl = getVideoPosterUrl(video);

  return (
    <div className="relative h-[100dvh] w-full shrink-0 snap-start snap-always bg-black">
      <VideoPlayer
        url={playbackUrl}
        poster={posterUrl}
        isActive={isActive}
        isMuted={isMuted}
        volume={volume}
        onToggleMute={onToggleMute}
      />

      {/* side actions */}
      <div className="absolute bottom-24 right-3 z-20 flex flex-col items-center gap-6">
        <div className="relative mb-2">
          <Link to="/u/$username" params={{ username: video.creator.username }}>
            <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-lg">
              {video.creator.avatar_url ? (
                <img
                  src={video.creator.avatar_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600 text-white font-bold">
                  {video.creator.display_name?.[0].toUpperCase()}
                </div>
              )}
            </div>
          </Link>
          {!following && video.creator_id !== user?.id && (
            <button
              onClick={handleFollow}
              className="absolute -bottom-2 left-1/2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full bg-primary text-white ring-2 ring-black"
            >
              <Plus className="h-3 w-3" />
            </button>
          )}
        </div>

        <button
          onClick={handleLike}
          className="group flex flex-col items-center gap-1"
        >
          <div className={`rounded-full p-2.5 transition-all ${liked ? 'bg-primary shadow-glow' : 'bg-black/30 backdrop-blur-md hover:bg-black/50'}`}>
            <Heart className={`h-6 w-6 ${liked ? "fill-white text-white" : "text-white"}`} />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">
            {compact(likes)}
          </span>
        </button>

        <button
          onClick={() => {}} // Open comments
          className="flex flex-col items-center gap-1"
        >
          <div className="rounded-full bg-black/30 p-2.5 backdrop-blur-md hover:bg-black/50 transition-colors">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">
            {compact(video.comment_count)}
          </span>
        </button>

        <button
          onClick={() => {}} // Open gift dialog
          className="flex flex-col items-center gap-1"
        >
          <div className="rounded-full bg-black/30 p-2.5 backdrop-blur-md hover:bg-black/50 transition-colors">
            <Gift className="h-6 w-6 text-gold" />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">Gift</span>
        </button>

        {/* Always visible — was hidden on your own posts / clipped under Share */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More options"
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-1"
            >
              <div className="rounded-full bg-black/30 p-2.5 backdrop-blur-md hover:bg-black/50 transition-colors">
                <MoreVertical className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-bold text-white drop-shadow-md">More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="left"
            className="z-[80] min-w-[11rem]"
            onClick={(e) => e.stopPropagation()}
          >
            {video.creator_id === user?.id ? (
              <DropdownMenuItem disabled>This is your video</DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    if (!user) {
                      navigate({ to: "/welcome" });
                      return;
                    }
                    setReportOpen(true);
                  }}
                >
                  Report video
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    if (!user) {
                      navigate({ to: "/welcome" });
                      return;
                    }
                    const creatorId = video.creator_id || video.creator?.id;
                    if (!creatorId) return;
                    navigate({
                      to: "/report/user/$userId",
                      params: { userId: creatorId },
                      search: { username: video.creator?.username },
                    });
                  }}
                >
                  Report creator
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-rose-400 focus:text-rose-400"
                  onSelect={() => {
                    if (!user) {
                      navigate({ to: "/welcome" });
                      return;
                    }
                    const creatorId = video.creator_id || video.creator?.id;
                    if (!creatorId) return;
                    navigate({
                      to: "/block/$userId",
                      params: { userId: creatorId },
                      search: { username: video.creator?.username },
                    });
                  }}
                >
                  Block creator
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1"
        >
          <div className="rounded-full bg-black/30 p-2.5 backdrop-blur-md hover:bg-black/50 transition-colors">
            <Share2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">Share</span>
        </button>
      </div>

      {/* product tag */}
      {video.product_url && (
        <div className="absolute bottom-28 left-4 z-20">
          <a
            href={video.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex max-w-[70vw] items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10"
          >
            <Link2 className="h-3.5 w-3.5 shrink-0 text-gold" />
            <span className="truncate">
              {video.product_cta || video.product_title || "Visit link"}
            </span>
          </a>
        </div>
      )}

      {/* bottom info */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pb-12 pt-12">
        <div className="space-y-1.5">
          <Link
            to="/u/$username"
            params={{ username: video.creator.username }}
            className="font-display text-base font-bold text-white hover:underline"
          >
            @{video.creator.username}
          </Link>
          <p className="line-clamp-2 text-sm text-white/90 leading-snug">
            <span className="font-bold">{video.title}</span> {video.caption}
          </p>
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
              {video.tags.map((tag: string) => (
                <Link
                  key={tag}
                  to="/"
                  className="text-sm font-bold text-primary hover:underline"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        targetType="post"
        targetId={video.id}
      />
    </div>
  );
}
