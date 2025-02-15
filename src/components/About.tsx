import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getEquipment } from "@/lib/equipment";
import type { Equipment } from "@/lib/equipment";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";

const About = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipment();
    const cleanup = setupRealtimeSubscription();
    return () => {
      cleanup();
    };
  }, []);

  const loadEquipment = async () => {
    try {
      const data = await getEquipment();
      setEquipment(data);
    } catch (error) {
      console.error("Error loading equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("equipment-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "equipment" },
        () => {
          loadEquipment();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Group equipment by category and sort by order
  const groupedEquipment = equipment
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, Equipment[]>,
    );

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-white">
        <Navbar isHome={true} isDark={false} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 pt-32"
        >
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-4xl font-bold uppercase tracking-wider text-zinc-900">
              About Me
            </h1>
            <div className="space-y-6 text-lg leading-relaxed text-zinc-600">
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
                connect people. Whether it's an intimate wedding ceremony or a
                large-scale commercial production, I approach each project with
                the same level of dedication and creativity.
              </p>
            </div>

            {/* Equipment Section */}
            <div className="mt-16">
              <h2 className="mb-8 text-2xl font-bold uppercase tracking-wider text-zinc-900">
                Equipment & Gear
              </h2>
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-8 w-48" />
                      <div className="grid gap-4 md:grid-cols-2">
                        <Skeleton className="h-12" />
                        <Skeleton className="h-12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedEquipment).map(([category, items]) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="rounded-lg bg-zinc-50 p-6"
                    >
                      <h3 className="mb-4 text-xl font-semibold uppercase tracking-wider text-zinc-900">
                        {category}
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-md bg-white p-4 shadow-sm"
                          >
                            <h4 className="font-medium text-zinc-900">
                              {item.name}
                            </h4>
                            {item.description && (
                              <p className="mt-1 text-sm text-zinc-500">
                                {item.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default About;
