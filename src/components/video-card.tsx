import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, MessageCircle, Gift, Share2, Play, Volume2, VolumeX, ShoppingBag } from "lucide-react";
import Hls from "hls.js";
import { cn } from "@/lib/utils";
import { compact } from "@/lib/format";
import { toggleLike, type FeedVideo } from "@/lib/feed";
import { useAuth } from "@/hooks/use-auth";
import { GiftDialog } from "@/components/gift-dialog";
import { CommentsSheet } from "@/components/comments-sheet";
import { toast } from "sonner";
import { getVideoAssetStatus, getVideoPlaybackUrl, getVideoPosterUrl, isAdaptiveStream } from "@/lib/video";

type Props = {
  video: FeedVideo;
  muted: boolean;
  onToggleMute: () => void;
};

export function VideoCard({ video, muted, onToggleMute }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [nearView, setNearView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState(video.liked);
  const [likeCount, setLikeCount] = useState(video.like_count);
  const [showGift, setShowGift] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [volume, setVolume] = useState(1);
  const playbackUrl = useMemo(() => getVideoPlaybackUrl(video), [video]);
  const posterUrl = useMemo(() => getVideoPosterUrl(video), [video]);
  const adaptive = useMemo(() => isAdaptiveStream(video), [video]);
  const assetReady = getVideoAssetStatus(video) !== "errored";

  useEffect(() => {
    const el = videoRef.current;
    if (el) el.volume = volume;
  }, [volume, inView]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !nearView || !assetReady || !playbackUrl) return;

    if (adaptive) {
      if (el.canPlayType("application/vnd.apple.mpegurl")) {
        if (el.src !== playbackUrl) {
          el.src = playbackUrl;
          el.load();
        }
        return;
      }

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          maxBufferLength: 20,
          backBufferLength: 60,
        });
        hls.loadSource(playbackUrl);
        hls.attachMedia(el);
        return () => hls.destroy();
      }
    }

    if (el.src !== playbackUrl) {
      el.src = playbackUrl;
      el.load();
    }
  }, [adaptive, assetReady, nearView, playbackUrl]);

  // Two observers: one to preload nearby clips, one to decide playback.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const playObserver = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.6),
      { threshold: [0, 0.6, 1] },
    );
    const nearObserver = new IntersectionObserver(
      ([entry]) => setNearView(entry.isIntersecting),
      { rootMargin: "250% 0px" },
    );

    playObserver.observe(el);
    nearObserver.observe(el);
    return () => {
      playObserver.disconnect();
      nearObserver.disconnect();
    };
  }, []);

  // Drive playback off the active clip only, guarding against play/pause races.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (inView && !paused) {
      const p = el.play();
      if (p) p.catch(() => {});
    } else if (!el.paused) {
      el.pause();
    }
  }, [inView, paused, nearView]);


  const handleLike = async () => {
    if (!user) return navigate({ to: "/auth" });
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    try {
      await toggleLike(video.id, liked);
    } catch {
      setLiked(!next);
      setLikeCount((c) => c + (next ? -1 : 1));
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/u/${video.creator?.username ?? ""}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title || "ViralSnap", url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-full snap-start overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        poster={posterUrl ?? undefined}
        loop
        muted={muted}
        playsInline
        preload={nearView ? "metadata" : "none"}
        onClick={() => setPaused((p) => !p)}
        className="absolute inset-0 h-full w-full object-cover"
      />


      {/* dark gradient for legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {paused && (
        <button
          onClick={() => setPaused(false)}
          className="absolute inset-0 z-10 flex items-center justify-center"
          aria-label="Play"
        >
          <Play className="h-16 w-16 fill-white/90 text-white/90 drop-shadow-lg" />
        </button>
      )}

      {/* mute toggle + volume slider (top left) */}
      <div className="absolute left-2 top-[calc(4rem+env(safe-area-inset-top))] z-20 flex flex-col items-center gap-2">
        <button
          onClick={onToggleMute}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <VolumeX className="h-4 w-4 text-white" />
          ) : (
            <Volume2 className="h-4 w-4 text-white" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => {
            const v = Number(e.target.value);
            setVolume(v);
            if (v > 0 && muted) onToggleMute();
            if (v === 0 && !muted) onToggleMute();
          }}
          aria-label="Volume"
          style={{ WebkitAppearance: "slider-vertical" }}
          className="volume-slider h-20 w-1.5 cursor-pointer accent-primary"
        />
      </div>


      {/* right action rail */}
      <div className="absolute bottom-28 right-3 z-20 flex flex-col items-center gap-5 text-white">
        <Link to="/u/$username" params={{ username: video.creator?.username ?? "" }}>
          {video.creator?.avatar_url ? (
            <img
              src={video.creator.avatar_url}
              alt={video.creator.username}
              className="h-12 w-12 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gradient-fire text-lg font-bold">
              {(video.creator?.display_name ?? "C").charAt(0).toUpperCase()}
            </div>
          )}
        </Link>

        <RailButton onClick={handleLike} count={likeCount}>
          <Heart className={cn("h-8 w-8", liked && "fill-primary text-primary")} />
        </RailButton>

        <RailButton onClick={() => setShowComments(true)} count={video.comment_count}>
          <MessageCircle className="h-8 w-8" />
        </RailButton>

        <RailButton onClick={() => setShowGift(true)} label="Gift">
          <Gift className="h-8 w-8 text-gold" />
        </RailButton>

        <RailButton onClick={handleShare} label="Share">
          <Share2 className="h-8 w-8" />
        </RailButton>
      </div>

      {/* bottom meta */}
      <div className="absolute inset-x-0 bottom-24 z-10 px-4 pr-20 text-white">
        <Link
          to="/u/$username"
          params={{ username: video.creator?.username ?? "" }}
          className="font-display text-base font-bold"
        >
          @{video.creator?.username ?? "creator"}
        </Link>
        {video.caption && <p className="mt-1 line-clamp-2 text-sm">{video.caption}</p>}
        {video.tags?.length > 0 && (
          <p className="mt-1 text-sm font-medium text-gold">
            {video.tags.map((t) => `#${t}`).join(" ")}
          </p>
        )}

        {video.product_url && (
          <a
            href={video.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2 rounded-2xl border border-gold/40 bg-black/50 px-3 py-2 backdrop-blur"
          >
            <ShoppingBag className="h-5 w-5 text-gold" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{video.product_title ?? "Shop this"}</p>
              {video.product_description && (
                <p className="line-clamp-1 text-xs text-white/70">
                  {video.product_description}
                </p>
              )}
            </div>
            <span className="rounded-full bg-gradient-fire px-3 py-1 text-xs font-semibold">
              {video.product_cta ?? "Shop"}
            </span>
          </a>
        )}
      </div>

      {showGift && video.creator && (
        <GiftDialog
          open={showGift}
          onOpenChange={setShowGift}
          receiverId={video.creator.id}
          receiverName={video.creator.username}
          videoId={video.id}
        />
      )}
      <CommentsSheet
        open={showComments}
        onOpenChange={setShowComments}
        videoId={video.id}
      />
    </div>
  );
}

function RailButton({
  children,
  onClick,
  count,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  count?: number;
  label?: string;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      {children}
      <span className="text-xs font-semibold drop-shadow">
        {count !== undefined ? compact(count) : label}
      </span>
    </button>
  );
}
