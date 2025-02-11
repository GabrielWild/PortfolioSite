import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Video } from "@/lib/api";
import { slugify } from "@/lib/utils";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Video | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase.from("videos").select("*");

        if (error) throw error;

        // Find the project by matching the slugified title with the URL slug
        const matchingProject = data.find((p) => slugify(p.title) === slug);

        if (matchingProject) {
          setProject(matchingProject);
        } else {
          // If no matching project is found, navigate to the work page
          navigate("/work");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        navigate("/work");
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug, navigate]);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="container mx-auto px-4 py-32">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            {project.video_url?.includes("youtube.com") ||
            project.video_url?.includes("youtu.be") ||
            project.video_url?.includes("vimeo.com") ? (
              <iframe
                className="h-full w-full"
                src={project.video_url}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                className="h-full w-full"
                controls
                playsInline
                preload="auto"
              >
                <source src={project.video_url} type="video/mp4" />
              </video>
            )}
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[2fr,1fr]">
            <div>
              <h1 className="mb-4 text-4xl font-bold text-white">
                {project.title}
              </h1>
              <p className="text-lg text-white/60">{project.description}</p>
            </div>

            <div className="space-y-4 rounded-lg bg-white/5 p-6 backdrop-blur-sm">
              <div>
                <h3 className="font-medium text-white">Client</h3>
                <p className="text-white/60">{project.client}</p>
              </div>
              {project.created_at && (
                <div>
                  <h3 className="font-medium text-white">Date</h3>
                  <p className="text-white/60">
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProjectDetail;
