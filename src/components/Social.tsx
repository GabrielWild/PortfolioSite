import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";
import { getSocialLinks } from "@/lib/social";
import type { SocialLink } from "@/lib/social";

const Social = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const links = await getSocialLinks();
        setSocialLinks(links);
      } catch (error) {
        console.error("Error loading social links:", error);
      }
    };
    loadSocialLinks();
  }, []);

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
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-12 text-4xl font-bold uppercase tracking-wider text-white">
              Connect With Me
            </h1>
            <div className="grid gap-8">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-6 rounded-lg bg-white/5 p-6 transition-colors hover:bg-white/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {Icons[link.icon as keyof typeof Icons] ? (
                    React.createElement(
                      Icons[link.icon as keyof typeof Icons],
                      {
                        className: "h-8 w-8 text-white",
                      },
                    )
                  ) : (
                    <Icons.Link className="h-8 w-8 text-white" />
                  )}
                  <div>
                    <h2 className="text-xl font-medium text-white">
                      {link.name}
                    </h2>
                    <p className="text-white/60">{link.username}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Social;
