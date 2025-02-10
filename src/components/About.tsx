import { motion } from "framer-motion";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";

const About = () => {
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
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-4xl font-bold uppercase tracking-wider text-white">
              About Me
            </h1>
            <div className="space-y-6 text-lg leading-relaxed text-white/80">
              <p>
                With over a decade of experience in visual storytelling, I've
                dedicated my career to capturing life's most meaningful moments
                through the lens. My approach combines cinematic techniques with
                documentary-style authenticity, creating compelling narratives
                that resonate with audiences.
              </p>
              <p>
                Specializing in weddings, documentaries, and commercial
                projects, I bring a unique perspective to each production. My
                work has been featured in various international film festivals
                and has earned recognition for its innovative approach to visual
                storytelling.
              </p>
              <p>
                I believe in the power of visual media to move, inspire, and
                connect people. Whether it's a intimate wedding ceremony or a
                large-scale commercial production, I approach each project with
                the same level of dedication and creativity.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default About;
