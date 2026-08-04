import { useRef, useEffect } from "react";

interface VideoPlayerProps {
  url: string;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function VideoPlayer({
  url,
  isActive,
  isMuted,
  onToggleMute,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      videoRef.current.play().catch(err => {
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
        src={url}
        loop
        playsInline
        muted={isMuted}
        className="h-full w-full object-cover"
        onClick={onToggleMute}
      />
    </div>
  );
}
