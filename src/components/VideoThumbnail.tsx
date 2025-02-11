import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-media-query";

const getVideoEmbedUrl = (url: string) => {
  if (!url) return "";

  // YouTube
  const youtubeRegExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const youtubeMatch = url.match(youtubeRegExp);
  if (youtubeMatch && youtubeMatch[2].length === 11) {
    return `https://www.youtube.com/embed/${youtubeMatch[2]}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1`;
  }

  // Vimeo
  const vimeoRegExp =
    /(?:vimeo\.com\/|player\.vimeo\.com\/)(?:video\/|embed\/)?([0-9]+)/;
  const vimeoMatch = url.match(vimeoRegExp);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&background=1`;
  }

  return url;
};

type VideoThumbnailProps = {
  id?: string;
  thumbnail_url?: string;
  video_url?: string;
  mobile_thumbnail_url?: string;
  mobile_video_url?: string;
  title?: string;
  client?: string;
  onVideoEnd?: () => void;
};

function VideoThumbnail({
  id = "1",
  thumbnail_url = "https://images.unsplash.com/photo-1536240478700-b869070f9279",
  video_url = "https://example.com/video.mp4",
  mobile_thumbnail_url,
  mobile_video_url,
  title = "Sample Project",
  client = "Client Name",
  onVideoEnd,
}: VideoThumbnailProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const activeVideoUrl =
    isMobile && mobile_video_url ? mobile_video_url : video_url;
  const activeThumbnailUrl =
    isMobile && mobile_thumbnail_url ? mobile_thumbnail_url : thumbnail_url;

  useEffect(() => {
    const timer = setTimeout(() => setShouldLoadVideo(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const fullscreenStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    height: "auto",
    minWidth: "100%",
    minHeight: "100%",
    maxWidth: "none",
    objectFit: "cover" as const,
  };

  // Handle video end for embedded videos
  useEffect(() => {
    if (!shouldLoadVideo || !onVideoEnd) return;

    const handleMessage = (event: MessageEvent) => {
      // YouTube player state change
      if (event.data === 0) {
        // Video ended
        onVideoEnd();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [shouldLoadVideo, onVideoEnd]);

  return (
    <div className="fixed inset-0 h-screen w-screen">
      <div className="relative h-full w-full overflow-hidden bg-black">
        <img
          src={activeThumbnailUrl}
          alt={title}
          className="absolute inset-0"
          style={{
            ...fullscreenStyle,
            opacity: isVideoPlaying ? 0 : 1,
            transition: "opacity 0.5s ease-in-out",
          }}
        />
        {shouldLoadVideo &&
          (activeVideoUrl?.includes("youtube.com") ||
          activeVideoUrl?.includes("youtu.be") ||
          activeVideoUrl?.includes("vimeo.com") ? (
            <iframe
              onLoad={() => setIsVideoLoaded(true)}
              className="absolute inset-0"
              src={getVideoEmbedUrl(activeVideoUrl)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                ...fullscreenStyle,
                border: "none",
                width: "200vw",
                height: "200vh",
              }}
            />
          ) : (
            <video
              className="absolute inset-0"
              style={{
                ...fullscreenStyle,
                width: "200vw",
                height: "200vh",
              }}
              autoPlay
              muted
              playsInline
              preload="auto"
              onLoadedData={(e) => {
                const video = e.target as HTMLVideoElement;
                setIsVideoLoaded(true);
                video
                  .play()
                  .then(() => setIsVideoPlaying(true))
                  .catch(console.error);
              }}
              style={{
                ...fullscreenStyle,
                width: "200vw",
                height: "200vh",
                opacity: isVideoPlaying ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
              }}
              onEnded={onVideoEnd}
            >
              <source src={activeVideoUrl} type="video/mp4" />
            </video>
          ))}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium uppercase tracking-wider text-white">
              {title}
            </h3>
            <p className="text-sm font-medium uppercase tracking-wider text-white/80">
              {client}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoThumbnail;
