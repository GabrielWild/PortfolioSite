import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoThumbnail from "./VideoThumbnail";

interface VideoGridProps {
  videos?: Array<{
    id: string;
    thumbnailUrl: string;
    videoUrl: string;
    title: string;
    client?: string;
  }>;
}

const SLIDE_DURATION = 8000; // 8 seconds per slide

const VideoGrid = ({
  videos = [
    {
      thumbnailUrl:
        "https://images.unsplash.com/photo-1536240478700-b869070f9279",
      videoUrl: "https://example.com/video1.mp4",
      title: "Cinematic Wedding",
    },
    {
      thumbnailUrl:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
      videoUrl: "https://example.com/video2.mp4",
      title: "Urban Documentary",
    },
    {
      thumbnailUrl:
        "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9",
      videoUrl: "https://example.com/video3.mp4",
      title: "Music Festival Highlights",
    },
    {
      thumbnailUrl:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728",
      videoUrl: "https://example.com/video4.mp4",
      title: "Corporate Event",
    },
    {
      thumbnailUrl:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      videoUrl: "https://example.com/video5.mp4",
      title: "Travel Series",
    },
    {
      thumbnailUrl:
        "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9",
      videoUrl: "https://example.com/video6.mp4",
      title: "Short Film",
    },
  ],
}: VideoGridProps) => {
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
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <VideoThumbnail
              id={videos[currentIndex].id}
              thumbnailUrl={videos[currentIndex].thumbnailUrl}
              videoUrl={videos[currentIndex].videoUrl}
              title={videos[currentIndex].title}
              client={videos[currentIndex].client}
            />
          </motion.div>
        </AnimatePresence>

        {/* Slideshow numbers */}
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
      </div>
    </div>
  );
};

export default VideoGrid;
