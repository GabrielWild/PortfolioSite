import React, { useEffect, useState } from "react";
import { getVideos } from "@/lib/api";
import type { Video } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import VideoGrid from "./VideoGrid";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";

const Home = () => {
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
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Navbar isHome={true} />
      <VideoGrid videos={projects} />
    </div>
  );
};

export default Home;
