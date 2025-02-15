import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VideoThumbnail from "./VideoThumbnail";
import type { Video } from "@/lib/api";
import { slugify } from "@/lib/utils";

interface VideoGridProps {
  videos?: Video[];
}

const INITIAL_LOAD_COUNT = 6;
const LOAD_MORE_COUNT = 3;

const VideoGrid = ({ videos = [] }: VideoGridProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);
  const [preloadedVideos, setPreloadedVideos] = useState<{
    [key: string]: boolean;
  }>({});
  const [nextVideoLoaded, setNextVideoLoaded] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < videos.length) {
          setVisibleCount((prev) =>
            Math.min(prev + LOAD_MORE_COUNT, videos.length),
          );
        }
      },
      { threshold: 0.1 },
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => observerRef.current?.disconnect();
  }, [visibleCount, videos.length]);

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
        {videos.slice(0, visibleCount).map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full cursor-pointer"
            onClick={handleVideoClick}
          >
            <VideoThumbnail
              thumbnailUrl={video.thumbnail_url}
              videoUrl={video.video_url}
              title={video.title}
              client={video.client}
              onLoad={() => {
                if (index === currentIndex + 1) {
                  setNextVideoLoaded(true);
                }
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Load more trigger */}
      {visibleCount < videos.length && (
        <div ref={loadMoreRef} className="h-10 w-full" />
      )}

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
              className={`text-xl font-medium md:text-2xl ${index === currentIndex ? "text-white" : "text-white/40"}`}
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
