import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getVideos } from "@/lib/api";
import type { Video } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

const Home = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const videosData = await getVideos();
        setVideos(videosData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();

    const videosChannel = supabase
      .channel("videos-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        () => {
          loadData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(videosChannel);
    };
  }, []);

  const handleVideoLoad = (videoId: string) => {
    setLoadedVideos((prev) => new Set([...prev, videoId]));
    const video = videoRefs.current[videoId];
    if (video) {
      video.play().catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 flex justify-between px-8 py-6">
        <div className="flex items-center gap-8">
          <Link to="/works" className="text-sm text-white/70 hover:text-white">
            WORKS
          </Link>
          <Link to="/about" className="text-sm text-white/70 hover:text-white">
            ABOUT
          </Link>
        </div>
        <Link to="/contact" className="text-sm text-white/70 hover:text-white">
          LET'S TALK
        </Link>
      </nav>

      {/* Hero Text */}
      <div className="relative z-10 flex min-h-[65vh] flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center text-[12vw] font-medium leading-none tracking-tight text-white"
        >
          G. WILDSMITH
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-4 flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-32"
        >
          <p className="text-center text-xs uppercase tracking-wider text-white/50">
            CINEMATOGRAPHY STUDIO
            <br />
            BASED IN AMSTERDAM
          </p>
          <p className="text-center text-xs uppercase tracking-wider text-white/50">
            UNLEASHING THE POWER OF
            <br />
            VISUAL STORYTELLING
          </p>
        </motion.div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
        {videos.map((video) => (
          <Link
            key={video.id}
            to={`/project/${slugify(video.title)}`}
            className="group relative aspect-square overflow-hidden rounded-lg bg-black"
          >
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="h-full w-full object-cover transition-opacity duration-500"
              style={{ opacity: loadedVideos.has(video.id) ? 0 : 1 }}
            />
            <video
              ref={(el) => {
                if (el) videoRefs.current[video.id] = el;
              }}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
              style={{ opacity: loadedVideos.has(video.id) ? 1 : 0 }}
              muted
              loop
              playsInline
              autoPlay
              onLoadedData={() => handleVideoLoad(video.id)}
            >
              <source
                src={video.hover_video_url || video.video_url}
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
