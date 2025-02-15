import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import type { Video } from "@/lib/api";
import { slugify } from "@/lib/utils";

type PortfolioGridProps = {
  videos: Video[];
};

const PortfolioGrid = ({ videos }: PortfolioGridProps) => {
  const [visibleVideos, setVisibleVideos] = useState<Video[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initially show first 6 videos
    setVisibleVideos(videos.slice(0, 6));

    // Set up intersection observer for infinite scroll
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleVideos.length < videos.length) {
          setVisibleVideos((prev) => [
            ...prev,
            ...videos.slice(prev.length, prev.length + 3),
          ]);
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [videos]);

  return (
    <div className="mx-auto max-w-[2400px] px-4 py-24 sm:px-6 lg:px-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center text-sm font-light uppercase tracking-[0.3em] text-white/50"
      >
        Selected Works
      </motion.h2>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {visibleVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link
              to={`/project/${slugify(video.title)}`}
              className="group relative block aspect-video w-full overflow-hidden bg-black"
            >
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8">
                <h3 className="text-lg font-light uppercase tracking-wider text-white">
                  {video.title}
                </h3>
                <p className="mt-2 text-xs font-light uppercase tracking-[0.2em] text-white/70">
                  {video.client}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      {visibleVideos.length < videos.length && (
        <div ref={loadMoreRef} className="h-10 w-full" />
      )}
    </div>
  );
};

export default PortfolioGrid;
