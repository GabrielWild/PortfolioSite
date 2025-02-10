import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Video } from "@/lib/api";

const getVideoEmbedUrl = (url: string) => {
  if (!url) return "";

  // YouTube
  const youtubeRegExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const youtubeMatch = url.match(youtubeRegExp);
  if (youtubeMatch && youtubeMatch[2].length === 11) {
    return `https://www.youtube.com/embed/${youtubeMatch[2]}?autoplay=1&mute=1&loop=1&playlist=${youtubeMatch[2]}&controls=0&showinfo=0&rel=0&modestbranding=1`;
  }

  // Vimeo
  const vimeoRegExp =
    /(?:vimeo\.com\/|player\.vimeo\.com\/)(?:video\/|embed\/)?([0-9]+)/;
  const vimeoMatch = url.match(vimeoRegExp);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&loop=1&background=1`;
  }

  return url;
};

type VideoThumbnailProps = Partial<{
  id: string;
  thumbnail_url: string;
  video_url: string;
  title: string;
  client: string;
}>;

const VideoThumbnail = ({
  id = "1",
  thumbnail_url = "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=360&h=360&q=80",
  video_url = "https://example.com/placeholder-video.mp4",
  title = "Sample Project",
  client = "Client Name",
}: VideoThumbnailProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldLoadVideo(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-full w-full">
      <Link to={`/project/${id}`}>
        <motion.div className="group absolute inset-0 h-full w-full overflow-hidden bg-black">
          <div className="relative h-full w-full bg-black">
            <img
              src={thumbnail_url}
              alt={title}
              className="absolute inset-0"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "150vw",
                height: "150vh",
                transform: "translate(-50%, -50%)",
                opacity: isVideoLoaded ? 0 : 1,
                transition: "opacity 0.5s ease-in-out"
              }}
            />
            {shouldLoadVideo && (video_url?.includes("youtube.com") ||
            video_url?.includes("youtu.be") ||
            video_url?.includes("vimeo.com") ? (
              <iframe
                onLoad={() => setIsVideoLoaded(true)}
                className="absolute inset-0"
                src={getVideoEmbedUrl(video_url)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  border: "none",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "150vw",
                  height: "150vh",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ) : (
              <video
                className="absolute inset-0"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "150vw",
                  height: "150vh",
                  transform: "translate(-50%, -50%)",
                }}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onLoadedData={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.play().catch(console.error);
                  setIsVideoLoaded(true);
                }}
              >
                <source src={video_url} type="video/mp4" />
              </video>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-white/10 px-8 py-4 backdrop-blur-sm">
            <h3 className="text-lg font-medium uppercase tracking-wider text-white">
              {title}
            </h3>
            <p className="text-sm font-medium uppercase tracking-wider text-white/80">
              {client}
            </p>
          </div>
        </motion.div>
      </Link>
    </div>
  );
};

export default VideoThumbnail;
