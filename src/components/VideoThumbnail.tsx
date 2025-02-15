import { useState, useRef, useEffect } from "react";

interface VideoThumbnailProps {
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  client: string;
  onLoad?: () => void;
}

const VideoThumbnail = ({
  thumbnailUrl,
  videoUrl,
  title,
  client,
  onLoad,
}: VideoThumbnailProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVideoLoaded) {
          const video = videoRef.current;
          if (video) {
            video.src = videoUrl;
            video.load();
            setIsVideoLoaded(true);
            if (onLoad) onLoad();
          }
        }
      },
      { threshold: 0.1 },
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videoUrl, isVideoLoaded, onLoad]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full overflow-hidden bg-black"
    >
      <img
        src={thumbnailUrl}
        alt={title}
        className="h-full w-full object-cover transition-opacity duration-300"
        style={{ opacity: isVideoLoaded ? 0 : 1 }}
      />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: isVideoLoaded ? 1 : 0 }}
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-4 opacity-0 transition-opacity duration-300 hover:opacity-100">
        <h3 className="text-sm font-medium uppercase tracking-wider text-white">
          {title}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-wider text-white/70">
          {client}
        </p>
      </div>
    </div>
  );
};

export default VideoThumbnail;
