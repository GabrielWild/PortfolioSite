import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VideoThumbnail from "./VideoThumbnail";
import type { Video } from "@/lib/api";
import { slugify } from "@/lib/utils";

interface VideoGridProps {
  videos?: Video[];
}

const VideoGrid = ({ videos = [] }: VideoGridProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preloadedVideos, setPreloadedVideos] = useState<{
    [key: string]: boolean;
  }>({});
  const [nextVideoLoaded, setNextVideoLoaded] = useState(false);

  const preloadVideo = useCallback(
    (index: number) => {
      if (!videos[index] || preloadedVideos[videos[index].id]) return;

      const video = videos[index];

      // Preload thumbnail
      const img = new Image();
      img.src = video.thumbnail_url;

      // Preload video if it's a direct video file
      if (
        video.video_url &&
        !video.video_url.includes("youtube.com") &&
        !video.video_url.includes("vimeo.com")
      ) {
        const videoEl = document.createElement("video");
        videoEl.preload = "auto";
        videoEl.src = video.video_url;

        videoEl.onloadeddata = () => {
          setPreloadedVideos((prev) => ({ ...prev, [video.id]: true }));
          if (index === (currentIndex + 1) % videos.length) {
            setNextVideoLoaded(true);
          }
        };
      } else {
        // For embedded videos, just mark as preloaded
        setPreloadedVideos((prev) => ({ ...prev, [video.id]: true }));
        if (index === (currentIndex + 1) % videos.length) {
          setNextVideoLoaded(true);
        }
      }
    },
    [videos, currentIndex, preloadedVideos],
  );
  const navigate = useNavigate();

  const handleVideoEnd = useCallback(() => {
    const nextIndex = (currentIndex + 1) % videos.length;
    setCurrentIndex(nextIndex);
    setNextVideoLoaded(false);

    // Preload the next video in the sequence
    preloadVideo((nextIndex + 1) % videos.length);
  }, [currentIndex, videos.length, preloadVideo]);

  // Initial preload of next video
  useEffect(() => {
    if (videos.length > 0) {
      preloadVideo((currentIndex + 1) % videos.length);
    }
  }, [currentIndex, videos, preloadVideo]);

  // Reset preloaded state when videos change
  useEffect(() => {
    setPreloadedVideos({});
    setNextVideoLoaded(false);
  }, [videos]);

  const handleVideoClick = () => {
    if (videos[currentIndex]) {
      navigate(`/project/${slugify(videos[currentIndex].title)}`);
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {videos.length > 0 && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="h-full w-full cursor-pointer"
            onClick={handleVideoClick}
          >
            <VideoThumbnail
              id={videos[currentIndex].id}
              thumbnail_url={videos[currentIndex].thumbnail_url}
              video_url={videos[currentIndex].video_url}
              mobile_thumbnail_url={videos[currentIndex].mobile_thumbnail_url}
              mobile_video_url={videos[currentIndex].mobile_video_url}
              title={videos[currentIndex].title}
              client={videos[currentIndex].client}
              onVideoEnd={handleVideoEnd}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slideshow numbers */}
      {videos.length > 0 && (
        <div className="absolute bottom-24 left-8 z-10 flex items-center gap-4">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // Prevent video click when clicking numbers
                setCurrentIndex(index);
              }}
              className={`text-xl md:text-2xl font-medium ${index === currentIndex ? "text-white" : "text-white/40"}`}
            >
              {(index + 1).toString().padStart(2, "0")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
