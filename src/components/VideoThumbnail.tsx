import { useState, useRef, useEffect } from "react";

interface VideoThumbnailProps {
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  client: string;
  onLoad?: () => void;
}

const generateBlurDataUrl = async (url: string) => {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Error generating blur data URL:", error);
    return null;
  }
};

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

    let isMounted = true;
    const loadVideo = async () => {
      try {
        // Start with lower quality on mobile
        const isMobile = window.innerWidth < 768;
        const quality = isMobile ? "low" : "medium";
        const optimizedUrl = getOptimizedVideoUrl(videoUrl, { quality });

        // Preload video
        await preloadVideo(optimizedUrl);

        if (isMounted && videoRef.current) {
          videoRef.current.src = optimizedUrl;
          setIsVideoLoaded(true);
          if (onLoad) onLoad();
        }
      } catch (error) {
        console.error("Error loading video:", error);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVideoLoaded) {
          loadVideo();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px", // Start loading slightly before the video comes into view
      },
    );

    observer.observe(containerRef.current);

    return () => {
      isMounted = false;
      observer.disconnect();
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
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-opacity duration-300"
        style={{
          opacity: isVideoLoaded ? 0 : 1,
          filter: !isVideoLoaded ? "blur(20px)" : "none",
          transform: !isVideoLoaded ? "scale(1.1)" : "scale(1)",
        }}
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
