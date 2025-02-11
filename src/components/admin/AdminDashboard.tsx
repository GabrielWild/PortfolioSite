import { useEffect, useState, useMemo } from "react";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Pencil, LogOut, Smartphone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { addVideo, deleteVideo, getVideos, updateVideo } from "@/lib/api";
import {
  addSocialLink,
  deleteSocialLink,
  getSocialLinks,
  updateSocialLink,
} from "@/lib/social";
import {
  addEquipment,
  deleteEquipment,
  getEquipment,
  updateEquipment,
} from "@/lib/equipment";
import type { Video } from "@/lib/api";
import type { SocialLink } from "@/lib/social";
import type { Equipment } from "@/lib/equipment";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import { motion } from "framer-motion";
import Navbar from "../Navbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again later.",
      });
    }
  };

  // Videos state
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Video>>({
    title: "",
    client: "",
    description: "",
    thumbnail_url: "",
    video_url: "",
    mobile_thumbnail_url: "",
    mobile_video_url: "",
    featured: false,
  });

  // Social links state
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [socialFormData, setSocialFormData] = useState({
    name: "",
    url: "",
    username: "",
    icon: "",
  });

  // Equipment state
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [editingEquipmentId, setEditingEquipmentId] = useState<string | null>(
    null,
  );
  const [equipmentFormData, setEquipmentFormData] = useState({
    name: "",
    category: "",
    description: "",
  });

  // Get unique categories from equipment
  const categories = [
    ...new Set(equipment.map((item) => item.category)),
  ].sort();

  useEffect(() => {
    loadVideos();
    loadSocialLinks();
    loadEquipment();
    const cleanupVideos = setupRealtimeSubscription();
    const cleanupSocial = setupSocialLinksSubscription();
    const cleanupEquipment = setupEquipmentSubscription();
    return () => {
      cleanupVideos();
      cleanupSocial();
      cleanupEquipment();
    };
  }, []);

  // Equipment handlers
  const loadEquipment = async () => {
    try {
      const data = await getEquipment();
      setEquipment(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading equipment",
        description: "Please try again later.",
      });
    }
  };

  const setupEquipmentSubscription = () => {
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

  const handleEquipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEquipmentId) {
        await updateEquipment(editingEquipmentId, equipmentFormData);
        toast({
          title: "Equipment updated",
          description: "The equipment has been updated successfully.",
        });
      } else {
        await addEquipment(equipmentFormData);
        toast({
          title: "Equipment added",
          description: "The equipment has been added successfully.",
        });
      }
      setEquipmentFormData({
        name: "",
        category: "",
        description: "",
      });
      setEditingEquipmentId(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving equipment",
        description: "Please try again later.",
      });
    }
  };

  const handleEditEquipment = (item: Equipment) => {
    setEditingEquipmentId(item.id);
    setEquipmentFormData({
      name: item.name,
      category: item.category,
      description: item.description || "",
    });
  };

  const handleDeleteEquipment = async (id: string) => {
    try {
      await deleteEquipment(id);
      toast({
        title: "Equipment deleted",
        description: "The equipment has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting equipment",
        description: "Please try again later.",
      });
    }
  };

  // Video handlers
  const loadVideos = async () => {
    try {
      const data = await getVideos();
      setVideos(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading videos",
        description: "Please try again later.",
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("videos-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        () => {
          loadVideos();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Debounced auto-save function for videos
  const debouncedVideoSave = useMemo(
    () =>
      debounce(async (data: Partial<Video>, id: string | null) => {
        try {
          if (id) {
            await updateVideo(id, data);
            toast({
              title: "Changes saved",
              description: "Video updated successfully.",
            });
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error saving changes",
            description: "Please try again later.",
          });
        }
      }, 1000),
    [],
  );

  // Auto-save when form data changes
  useEffect(() => {
    if (
      editingId &&
      Object.keys(formData).some((key) => formData[key] !== undefined)
    ) {
      debouncedVideoSave(formData, editingId);
    }
    return () => debouncedVideoSave.cancel();
  }, [formData, editingId]);

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateVideo(editingId, formData);
        toast({
          title: "Video updated",
          description: "The video has been updated successfully.",
        });
      } else {
        await addVideo(formData);
        toast({
          title: "Video added",
          description: "The video has been added successfully.",
        });
      }
      setFormData({
        title: "",
        client: "",
        description: "",
        thumbnail_url: "",
        video_url: "",
        mobile_thumbnail_url: "",
        mobile_video_url: "",
        featured: false,
      });
      setEditingId(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving video",
        description: "Please try again later.",
      });
    }
  };

  const handleEditVideo = (video: Video) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      client: video.client,
      description: video.description || "",
      thumbnail_url: video.thumbnail_url,
      video_url: video.video_url,
      mobile_thumbnail_url: video.mobile_thumbnail_url || "",
      mobile_video_url: video.mobile_video_url || "",
      featured: video.featured || false,
    });
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteVideo(id);
      toast({
        title: "Video deleted",
        description: "The video has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting video",
        description: "Please try again later.",
      });
    }
  };

  // Social link handlers
  const loadSocialLinks = async () => {
    try {
      const data = await getSocialLinks();
      setSocialLinks(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading social links",
        description: "Please try again later.",
      });
    }
  };

  const setupSocialLinksSubscription = () => {
    const channel = supabase
      .channel("social-links-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "social_links" },
        () => {
          loadSocialLinks();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSocialId) {
        await updateSocialLink(editingSocialId, socialFormData);
        toast({
          title: "Social link updated",
          description: "The social link has been updated successfully.",
        });
      } else {
        await addSocialLink(socialFormData);
        toast({
          title: "Social link added",
          description: "The social link has been added successfully.",
        });
      }
      setSocialFormData({
        name: "",
        url: "",
        username: "",
        icon: "",
      });
      setEditingSocialId(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving social link",
        description: "Please try again later.",
      });
    }
  };

  const handleEditSocial = (link: SocialLink) => {
    setEditingSocialId(link.id);
    setSocialFormData({
      name: link.name,
      url: link.url,
      username: link.username || "",
      icon: link.icon || "",
    });
  };

  const handleDeleteSocial = async (id: string) => {
    try {
      await deleteSocialLink(id);
      toast({
        title: "Social link deleted",
        description: "The social link has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting social link",
        description: "Please try again later.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="container mx-auto space-y-8 px-4 pt-32">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="w-full justify-start bg-white/10">
              <TabsTrigger value="videos" className="text-white">
                Videos
              </TabsTrigger>
              <TabsTrigger value="social" className="text-white">
                Social Links
              </TabsTrigger>
              <TabsTrigger value="equipment" className="text-white">
                Equipment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="mt-6">
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  {editingId ? "Edit Video" : "Add New Video"}
                </h2>
                <form onSubmit={handleVideoSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter video title"
                        required
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client" className="text-white">
                        Client
                      </Label>
                      <Input
                        id="client"
                        value={formData.client}
                        onChange={(e) =>
                          setFormData({ ...formData, client: e.target.value })
                        }
                        placeholder="Enter client name"
                        required
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter video description"
                      className="bg-white/5 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="thumbnail_url" className="text-white">
                        Thumbnail URL
                      </Label>
                      <Input
                        id="thumbnail_url"
                        value={formData.thumbnail_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            thumbnail_url: e.target.value,
                          })
                        }
                        placeholder="Enter thumbnail URL"
                        required
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="video_url" className="text-white">
                        Video URL
                      </Label>
                      <Input
                        id="video_url"
                        value={formData.video_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            video_url: e.target.value,
                          })
                        }
                        placeholder="Enter video URL"
                        required
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="mobile_thumbnail_url"
                        className="text-white"
                      >
                        Mobile Thumbnail URL
                      </Label>
                      <Input
                        id="mobile_thumbnail_url"
                        value={formData.mobile_thumbnail_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mobile_thumbnail_url: e.target.value,
                          })
                        }
                        placeholder="Enter mobile thumbnail URL (optional)"
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile_video_url" className="text-white">
                        Mobile Video URL
                      </Label>
                      <Input
                        id="mobile_video_url"
                        value={formData.mobile_video_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mobile_video_url: e.target.value,
                          })
                        }
                        placeholder="Enter mobile video URL (optional)"
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, featured: checked })
                      }
                    />
                    <Label htmlFor="featured" className="text-white">
                      Featured
                    </Label>
                  </div>

                  <Button type="submit" className="w-full">
                    {editingId ? "Update Video" : "Add Video"}
                  </Button>
                </form>
              </div>

              {/* Video List */}
              <div className="mt-8 space-y-4">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between rounded-lg bg-white/5 p-4"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {video.title}
                      </h3>
                      <p className="text-sm text-white/60">{video.client}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditVideo(video)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="social" className="mt-6">
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  {editingSocialId ? "Edit Social Link" : "Add New Social Link"}
                </h2>
                <form onSubmit={handleSocialSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="social-name" className="text-white">
                        Name
                      </Label>
                      <Input
                        id="social-name"
                        value={socialFormData.name}
                        onChange={(e) =>
                          setSocialFormData({
                            ...socialFormData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter platform name"
                        required
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="social-username" className="text-white">
                        Username
                      </Label>
                      <Input
                        id="social-username"
                        value={socialFormData.username}
                        onChange={(e) =>
                          setSocialFormData({
                            ...socialFormData,
                            username: e.target.value,
                          })
                        }
                        placeholder="Enter username"
                        required
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="social-url" className="text-white">
                        URL
                      </Label>
                      <Input
                        id="social-url"
                        value={socialFormData.url}
                        onChange={(e) =>
                          setSocialFormData({
                            ...socialFormData,
                            url: e.target.value,
                          })
                        }
                        placeholder="Enter profile URL"
                        required
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="social-icon" className="text-white">
                        Icon
                      </Label>
                      <Input
                        id="social-icon"
                        value={socialFormData.icon}
                        onChange={(e) =>
                          setSocialFormData({
                            ...socialFormData,
                            icon: e.target.value,
                          })
                        }
                        placeholder="Enter icon name from lucide-react"
                        required
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    {editingSocialId ? "Update Social Link" : "Add Social Link"}
                  </Button>
                </form>
              </div>

              {/* Social Links List */}
              <div className="mt-8 space-y-4">
                {socialLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between rounded-lg bg-white/5 p-4"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {link.name}
                      </h3>
                      <p className="text-sm text-white/60">{link.username}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditSocial(link)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteSocial(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="equipment" className="mt-6">
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  {editingEquipmentId ? "Edit Equipment" : "Add New Equipment"}
                </h2>
                <form onSubmit={handleEquipmentSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="equipment-name" className="text-white">
                        Name
                      </Label>
                      <Input
                        id="equipment-name"
                        value={equipmentFormData.name}
                        onChange={(e) =>
                          setEquipmentFormData({
                            ...equipmentFormData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter equipment name"
                        required
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="equipment-category"
                        className="text-white"
                      >
                        Category
                      </Label>
                      <Input
                        id="equipment-category"
                        value={equipmentFormData.category}
                        onChange={(e) =>
                          setEquipmentFormData({
                            ...equipmentFormData,
                            category: e.target.value,
                          })
                        }
                        placeholder="Enter equipment category"
                        required
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="equipment-description"
                      className="text-white"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="equipment-description"
                      value={equipmentFormData.description}
                      onChange={(e) =>
                        setEquipmentFormData({
                          ...equipmentFormData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter equipment description (optional)"
                      className="bg-white/5 text-white placeholder:text-white/40"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    {editingEquipmentId ? "Update Equipment" : "Add Equipment"}
                  </Button>
                </form>
              </div>

              {/* Equipment List */}
              <div className="mt-8 space-y-8">
                <div className="flex flex-col gap-4">
                  {[...new Set(equipment.map((item) => item.category))]
                    .sort((a, b) => {
                      const aOrder =
                        equipment.find((e) => e.category === a)?.order || 0;
                      const bOrder =
                        equipment.find((e) => e.category === b)?.order || 0;
                      return aOrder - bOrder;
                    })
                    .map((category, index) => (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-medium text-white">
                            {category}
                          </h3>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                if (index > 0) {
                                  const prevCategory = [
                                    ...new Set(
                                      equipment.map((item) => item.category),
                                    ),
                                  ].sort((a, b) => {
                                    const aOrder =
                                      equipment.find((e) => e.category === a)
                                        ?.order || 0;
                                    const bOrder =
                                      equipment.find((e) => e.category === b)
                                        ?.order || 0;
                                    return aOrder - bOrder;
                                  })[index - 1];
                                  const currentOrder =
                                    equipment.find(
                                      (e) => e.category === category,
                                    )?.order || 0;
                                  const prevOrder =
                                    equipment.find(
                                      (e) => e.category === prevCategory,
                                    )?.order || 0;

                                  // Update all items in current category
                                  for (const item of equipment.filter(
                                    (e) => e.category === category,
                                  )) {
                                    await updateEquipment(item.id, {
                                      order: prevOrder,
                                    });
                                  }

                                  // Update all items in previous category
                                  for (const item of equipment.filter(
                                    (e) => e.category === prevCategory,
                                  )) {
                                    await updateEquipment(item.id, {
                                      order: currentOrder,
                                    });
                                  }
                                }
                              }}
                              disabled={index === 0}
                            >
                              Move Up
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                const categories = [
                                  ...new Set(
                                    equipment.map((item) => item.category),
                                  ),
                                ];
                                if (index < categories.length - 1) {
                                  const nextCategory = categories.sort(
                                    (a, b) => {
                                      const aOrder =
                                        equipment.find((e) => e.category === a)
                                          ?.order || 0;
                                      const bOrder =
                                        equipment.find((e) => e.category === b)
                                          ?.order || 0;
                                      return aOrder - bOrder;
                                    },
                                  )[index + 1];
                                  const currentOrder =
                                    equipment.find(
                                      (e) => e.category === category,
                                    )?.order || 0;
                                  const nextOrder =
                                    equipment.find(
                                      (e) => e.category === nextCategory,
                                    )?.order || 0;

                                  // Update all items in current category
                                  for (const item of equipment.filter(
                                    (e) => e.category === category,
                                  )) {
                                    await updateEquipment(item.id, {
                                      order: nextOrder,
                                    });
                                  }

                                  // Update all items in next category
                                  for (const item of equipment.filter(
                                    (e) => e.category === nextCategory,
                                  )) {
                                    await updateEquipment(item.id, {
                                      order: currentOrder,
                                    });
                                  }
                                }
                              }}
                              disabled={index === categories.length - 1}
                            >
                              Move Down
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {equipment
                            .filter((item) => item.category === category)
                            .map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg bg-white/5 p-4"
                              >
                                <div>
                                  <h4 className="font-medium text-white">
                                    {item.name}
                                  </h4>
                                  {item.description && (
                                    <p className="text-sm text-white/60">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditEquipment(item)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() =>
                                      handleDeleteEquipment(item.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
