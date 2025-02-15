import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getVideos } from "@/lib/api";
import type { Video } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";

const Work = () => {
  const [projects, setProjects] = useState<Video[]>([]);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  useEffect(() => {
    loadVideos();
    const cleanup = setupRealtimeSubscription();
    return () => {
      cleanup();
    };
  }, []);

  const loadVideos = async () => {
    try {
      const data = await getVideos();
      console.log("Loaded videos:", data);
      setProjects(data);
    } catch (error) {
      console.error("Error loading videos:", error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("videos-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        () => {
          loadVideos();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleVideoLoad = (videoId: string) => {
    setLoadedVideos((prev) => new Set([...prev, videoId]));
    const video = videoRefs.current[videoId];
    if (video) {
      video.play().catch(console.error);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-black">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 pt-32"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${slugify(project.title)}`}
                className="group relative aspect-square overflow-hidden rounded-lg bg-black"
              >
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className="h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: loadedVideos.has(project.id) ? 0 : 1 }}
                />
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[project.id] = el;
                  }}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: loadedVideos.has(project.id) ? 1 : 0 }}
                  muted
                  loop
                  playsInline
                  autoPlay
                  onLoadedData={() => handleVideoLoad(project.id)}
                >
                  <source src={project.video_url} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-white">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-wider text-white/70">
                    {project.client}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Work;
