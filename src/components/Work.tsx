import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getVideos } from "@/lib/api";
import type { Video } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";

const Work = () => {
  const [projects, setProjects] = useState<Video[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getVideos();
        setProjects(data);
      } catch (error) {
        console.error("Error loading videos:", error);
      }
    };

    loadVideos();

    // Set up realtime subscription
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
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="container mx-auto px-4 pt-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group cursor-pointer"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium uppercase tracking-wider text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm font-medium uppercase tracking-wider text-white/60">
                    {project.client}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Work;
