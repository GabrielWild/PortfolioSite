import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute h-full w-full object-cover"
      >
        <source
          src="https://player.vimeo.com/external/459863027.hd.mp4?s=652e27550a35d76a577d4dce6dddb51f7655b0d4&profile_id=175&oauth2_token_id=57447761"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="container relative mx-auto flex h-full items-center px-4"
      >
        <div className="max-w-2xl">
          <h1 className="mb-4 text-5xl font-bold text-white">
            Capturing Life's Beautiful Moments
          </h1>
          <p className="text-xl text-gray-200">
            Professional videographer specializing in weddings, documentaries,
            and commercial projects
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
