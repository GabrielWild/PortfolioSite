import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoThumbnail from "./VideoThumbnail";

import type { Video } from "@/lib/api";

interface VideoGridProps {
  videos?: Video[];
}

const SLIDE_DURATION = 8000; // 8 seconds per slide

const VideoGrid = ({ videos = [] }: VideoGridProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [videos.length]);

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-black">
      <div className="relative h-full w-full">
        <AnimatePresence mode="wait">
          {videos.length > 0 && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <VideoThumbnail
                id={videos[currentIndex].id}
                thumbnail_url={videos[currentIndex].thumbnail_url}
                video_url={videos[currentIndex].video_url}
                title={videos[currentIndex].title}
                client={videos[currentIndex].client}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slideshow numbers */}
        {videos.length > 0 && (
          <div className="absolute bottom-24 left-8 flex items-center gap-4">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`text-2xl font-medium ${index === currentIndex ? "text-white" : "text-white/40"}`}
              >
                {(index + 1).toString().padStart(2, "0")}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGrid;
