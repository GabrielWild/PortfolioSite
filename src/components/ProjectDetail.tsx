import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const ProjectDetail = () => {
  const { id } = useParams();

  // This would typically come from your data source
  const project = {
    title: "Cinematic Wedding",
    description:
      "A beautiful celebration of love captured in our signature cinematic style.",
    videoUrl:
      "https://player.vimeo.com/external/459863027.hd.mp4?s=652e27550a35d76a577d4dce6dddb51f7655b0d4&profile_id=175&oauth2_token_id=57447761",
    client: "Sarah & John",
    date: "June 2023",
    location: "Malibu, CA",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black pt-16"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="aspect-video w-full overflow-hidden bg-black">
          <video
            className="h-full w-full object-cover"
            controls
            autoPlay
            playsInline
          >
            <source src={project.videoUrl} type="video/mp4" />
          </video>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[2fr,1fr]">
          <div>
            <h1 className="mb-4 text-4xl font-bold">{project.title}</h1>
            <p className="text-lg text-gray-600">{project.description}</p>
          </div>

          <div className="space-y-4 rounded-lg bg-white p-6 shadow-lg">
            <div>
              <h3 className="font-medium text-gray-900">Client</h3>
              <p className="text-gray-600">{project.client}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Date</h3>
              <p className="text-gray-600">{project.date}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Location</h3>
              <p className="text-gray-600">{project.location}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
