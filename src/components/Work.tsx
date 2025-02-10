import { motion } from "framer-motion";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";

const Work = () => {
  const projects = [
    {
      id: "1",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=360&h=360&q=80",
      title: "Cinematic Wedding",
      client: "Sarah & John",
    },
    {
      id: "2",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=360&h=360&q=80",
      title: "Urban Documentary",
      client: "City Stories",
    },
    {
      id: "3",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=360&h=360&q=80",
      title: "Music Festival",
      client: "Summer Fest",
    },
    {
      id: "4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=360&h=360&q=80",
      title: "Corporate Event",
      client: "Tech Corp",
    },
    {
      id: "5",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=360&h=360&q=80",
      title: "Travel Series",
      client: "Wanderlust",
    },
    {
      id: "6",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=360&h=360&q=80",
      title: "Short Film",
      client: "Film Studio",
    },
  ];

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
                    src={project.thumbnailUrl}
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
