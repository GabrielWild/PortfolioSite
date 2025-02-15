import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVideos } from "@/lib/api";
import type { Video } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";

const Work = () => {
  const [projects, setProjects] = useState<Video[]>([]);

  const navigate = useNavigate();

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

  return (
    <PageTransition>
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
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
              />
              <video
                className="absolute inset-0 h-full w-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              >
                <source src={project.video_url} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default Work;
