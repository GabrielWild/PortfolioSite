import { useEffect, useState, useMemo } from "react";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Pencil, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { addVideo, deleteVideo, getVideos, updateVideo } from "@/lib/api";
import {
  addHeroImage,
  deleteHeroImage,
  getHeroImages,
  updateHeroImage,
} from "@/lib/hero";
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
import type { HeroImage } from "@/lib/hero";
import type { SocialLink } from "@/lib/social";
import type { Equipment } from "@/lib/equipment";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import Navbar from "../Navbar";

const AdminDashboard = () => {
  useEffect(() => {
    loadVideos();
    loadHeroImages();
    loadSocialLinks();
    loadEquipment();
    const cleanupVideos = setupRealtimeSubscription();
    const cleanupHero = setupHeroSubscription();
    const cleanupSocial = setupSocialLinksSubscription();
    const cleanupEquipment = setupEquipmentSubscription();
    return () => {
      cleanupVideos();
      cleanupHero();
      cleanupSocial();
      cleanupEquipment();
    };
  }, []);

  // Load data functions
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

  const loadHeroImages = async () => {
    try {
      const data = await getHeroImages();
      setHeroImages(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading hero images",
        description: "Please try again later.",
      });
    }
  };

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

  // Realtime subscriptions
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

  const setupHeroSubscription = () => {
    const channel = supabase
      .channel("hero-images-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "hero_images" },
        () => {
          loadHeroImages();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  // Form handlers
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingHeroId) {
        await updateHeroImage(editingHeroId, heroFormData);
        toast({
          title: "Hero image updated",
          description: "The hero image has been updated successfully.",
        });
      } else {
        await addHeroImage(heroFormData);
        toast({
          title: "Hero image added",
          description: "The hero image has been added successfully.",
        });
      }
      setHeroFormData({
        image_url: "",
        title: "",
        description: "",
      });
      setEditingHeroId(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving hero image",
        description: "Please try again later.",
      });
    }
  };

  const handleEditHero = (image: HeroImage) => {
    setEditingHeroId(image.id);
    setHeroFormData({
      image_url: image.image_url,
      title: image.title || "",
      description: image.description || "",
    });
  };

  const handleDeleteHero = async (id: string) => {
    try {
      await deleteHeroImage(id);
      toast({
        title: "Hero image deleted",
        description: "The hero image has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting hero image",
        description: "Please try again later.",
      });
    }
  };

  // Video handlers
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

  // Equipment handlers
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
  const navigate = useNavigate();
  const { toast } = useToast();

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

  // Hero images state
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);
  const [heroFormData, setHeroFormData] = useState({
    image_url: "",
    title: "",
    description: "",
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

  return (
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

        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="w-full justify-start bg-white/10">
            <TabsTrigger value="hero" className="text-white">
              Hero Images
            </TabsTrigger>
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

          <TabsContent value="hero" className="mt-6">
            {/* Hero Images Form */}
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-semibold text-white">
                {editingHeroId ? "Edit Hero Image" : "Add New Hero Image"}
              </h2>
              <form onSubmit={handleHeroSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image_url" className="text-white">
                      Image URL
                    </Label>
                    <Input
                      id="image_url"
                      value={heroFormData.image_url}
                      onChange={(e) =>
                        setHeroFormData({
                          ...heroFormData,
                          image_url: e.target.value,
                        })
                      }
                      className="bg-white/5 text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title" className="text-white">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={heroFormData.title}
                      onChange={(e) =>
                        setHeroFormData({
                          ...heroFormData,
                          title: e.target.value,
                        })
                      }
                      className="bg-white/5 text-white"
                      placeholder="Hero Image Title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={heroFormData.description}
                      onChange={(e) =>
                        setHeroFormData({
                          ...heroFormData,
                          description: e.target.value,
                        })
                      }
                      className="bg-white/5 text-white"
                      placeholder="Hero Image Description"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingHeroId ? "Update Hero Image" : "Add Hero Image"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Hero Images List */}
            <div className="mt-8 space-y-4">
              {heroImages.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center justify-between rounded-lg bg-white/5 p-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={image.image_url}
                      alt={image.title || "Hero image"}
                      className="h-16 w-24 rounded object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {image.title || "Untitled"}
                      </h3>
                      {image.description && (
                        <p className="text-sm text-white/60">
                          {image.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditHero(image)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteHero(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            {/* Videos Form */}
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-semibold text-white">
                {editingId ? "Edit Video" : "Add New Video"}
              </h2>
              <form onSubmit={handleVideoSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="bg-white/5 text-white"
                      placeholder="Video Title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client" className="text-white">
                      Client
                    </Label>
                    <Input
                      id="client"
                      value={formData.client}
                      onChange={(e) =>
                        setFormData({ ...formData, client: e.target.value })
                      }
                      className="bg-white/5 text-white"
                      placeholder="Client Name"
                    />
                  </div>
                  <div>
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
                      className="bg-white/5 text-white"
                      placeholder="Video Description"
                    />
                  </div>
                  <div>
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
                      className="bg-white/5 text-white"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="video_url" className="text-white">
                      Video URL
                    </Label>
                    <Input
                      id="video_url"
                      value={formData.video_url}
                      onChange={(e) =>
                        setFormData({ ...formData, video_url: e.target.value })
                      }
                      className="bg-white/5 text-white"
                      placeholder="https://example.com/video.mp4"
                    />
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
                </div>
              </form>
            </div>

            {/* Videos List */}
            <div className="mt-8 space-y-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between rounded-lg bg-white/5 p-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="h-16 w-24 rounded object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {video.title}
                      </h3>
                      <p className="text-sm text-white/60">{video.client}</p>
                    </div>
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
            {/* Social Links Form */}
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-semibold text-white">
                {editingSocialId ? "Edit Social Link" : "Add New Social Link"}
              </h2>
              <form onSubmit={handleSocialSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={socialFormData.name}
                    onChange={(e) =>
                      setSocialFormData({
                        ...socialFormData,
                        name: e.target.value,
                      })
                    }
                    className="bg-white/5 text-white"
                    placeholder="Platform Name"
                  />
                </div>
                <div>
                  <Label htmlFor="url" className="text-white">
                    URL
                  </Label>
                  <Input
                    id="url"
                    value={socialFormData.url}
                    onChange={(e) =>
                      setSocialFormData({
                        ...socialFormData,
                        url: e.target.value,
                      })
                    }
                    className="bg-white/5 text-white"
                    placeholder="https://example.com/profile"
                  />
                </div>
                <div>
                  <Label htmlFor="username" className="text-white">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={socialFormData.username}
                    onChange={(e) =>
                      setSocialFormData({
                        ...socialFormData,
                        username: e.target.value,
                      })
                    }
                    className="bg-white/5 text-white"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <Label htmlFor="icon" className="text-white">
                    Icon
                  </Label>
                  <Input
                    id="icon"
                    value={socialFormData.icon}
                    onChange={(e) =>
                      setSocialFormData({
                        ...socialFormData,
                        icon: e.target.value,
                      })
                    }
                    className="bg-white/5 text-white"
                    placeholder="Instagram"
                  />
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
            {/* Equipment Form */}
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-semibold text-white">
                {editingEquipmentId ? "Edit Equipment" : "Add New Equipment"}
              </h2>
              <form onSubmit={handleEquipmentSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={equipmentFormData.name}
                    onChange={(e) =>
                      setEquipmentFormData({
                        ...equipmentFormData,
                        name: e.target.value,
                      })
                    }
                    className="bg-white/5 text-white"
                    placeholder="Equipment Name"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-white">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={equipmentFormData.category}
                    onChange={(e) =>
                      setEquipmentFormData({
                        ...equipmentFormData,
                        category: e.target.value,
                      })
                    }
                    className="bg-white/5 text-white"
                    placeholder="Category"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={equipmentFormData.description}
                    onChange={(e) =>
                      setEquipmentFormData({
                        ...equipmentFormData,
                        description: e.target.value,
                      })
                    }
                    className="bg-white/5 text-white"
                    placeholder="Equipment Description"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingEquipmentId ? "Update Equipment" : "Add Equipment"}
                </Button>
              </form>
            </div>

            {/* Equipment List */}
            <div className="mt-8 space-y-4">
              {equipment.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-white/5 p-4"
                >
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-white/60">{item.category}</p>
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
                      onClick={() => handleDeleteEquipment(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
