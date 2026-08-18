import { useRef, useEffect } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  url: string;
  poster?: string | null;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function VideoPlayer({
  url,
  poster,
  isActive,
  isMuted,
  onToggleMute,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !url) return;

    const isHls = url.endsWith(".m3u8");
    let hls: Hls | null = null;

    if (isHls && !el.canPlayType("application/vnd.apple.mpegurl") && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(el);
    } else {
      el.src = url;
      el.load();
    }

    return () => {
      hls?.destroy();
    };
  }, [url]);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      videoRef.current.play().catch((err) => {
        console.warn("Video play failed:", err);
      });
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        poster={poster ?? undefined}
        loop
        playsInline
        muted={isMuted}
        className="h-full w-full object-cover"
        onClick={onToggleMute}
      />
    </div>
  );
}
