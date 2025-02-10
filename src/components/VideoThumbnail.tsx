import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface VideoThumbnailProps {
  id?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  title?: string;
  client?: string;
}

interface Project {
  id: string;
  title: string;
  client: string;
  thumbnailUrl: string;
  videoUrl: string;
}

const VideoThumbnail = ({
  id = "1",
  thumbnailUrl = "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=360&h=360&q=80",
  videoUrl = "https://example.com/placeholder-video.mp4",
  title = "Sample Project",
  client = "Client Name",
}: VideoThumbnailProps) => {
  return (
    <Link to={`/project/${id}`}>
      <motion.div className="group absolute inset-0 h-full w-full overflow-hidden bg-black">
        <div className="relative h-full w-full bg-black">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
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
  );
};

export default VideoThumbnail;
