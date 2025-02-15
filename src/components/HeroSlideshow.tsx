import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HeroImage } from "@/lib/hero";

interface HeroSlideshowProps {
  images: HeroImage[];
  interval?: number;
}

const HeroSlideshow = ({ images, interval = 5000 }: HeroSlideshowProps) => {
  console.log("HeroSlideshow images:", images);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (!images.length) return null;

  return (
    <div className="fixed inset-0 -z-10">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[currentIndex].id}
          src={images[currentIndex].image_url}
          alt={images[currentIndex].title || "Hero image"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            backgroundColor: "transparent",
          }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/5">
        <div className="absolute inset-0 mix-blend-lighten">
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,_rgba(76,_21,_139,_0.1),_transparent_70%)]" />
        </div>
      </div>
    </div>
  );
};

export default HeroSlideshow;
