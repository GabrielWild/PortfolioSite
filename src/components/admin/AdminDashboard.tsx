import { useEffect, useState } from "react";
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
  addSocialLink,
  deleteSocialLink,
  getSocialLinks,
  updateSocialLink,
} from "@/lib/social";
import type { Video } from "@/lib/api";
import type { SocialLink } from "@/lib/social";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import PageTransition from "../PageTransition";
import Navbar from "../Navbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/admin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again later.",
      });
    }
  };
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Video>>({
    title: "",
    client: "",
    description: "",
    thumbnail_url: "",
    video_url: "",
    featured: false,
  });

  useEffect(() => {
    loadVideos();
    const cleanup = setupRealtimeSubscription();
    return () => {
      cleanup();
    };
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateVideo(editingId, formData);
        toast({
          title: "Video updated",
          description: "The video has been updated successfully.",
        });
      } else {
        await addVideo(
          formData as Omit<Video, "id" | "created_at" | "updated_at">,
        );
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

  const handleEdit = (video: Video) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      client: video.client,
      description: video.description,
      thumbnail_url: video.thumbnail_url,
      video_url: video.video_url,
      featured: video.featured,
    });
  };

  const handleDelete = async (id: string) => {
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

  // Add state for social links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [socialFormData, setSocialFormData] = useState({
    name: "",
    url: "",
    username: "",
    icon: "",
  });

  useEffect(() => {
    loadSocialLinks();
    const cleanup = setupSocialLinksSubscription();
    return () => {
      cleanup();
    };
  }, []);

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
      username: link.username,
      icon: link.icon,
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
    <PageTransition>
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
            </TabsList>

            <TabsContent value="videos" className="mt-6">
              <h1 className="text-3xl font-bold text-white">
                Video Management
              </h1>

              {/* Add/Edit Video Form */}
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  {editingId ? "Edit Video" : "Add New Video"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      required
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

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, featured: checked })
                      }
                    />
                    <Label htmlFor="featured" className="text-white">
                      Featured on Homepage
                    </Label>
                  </div>

                  <Button type="submit" className="w-full">
                    {editingId ? "Update Video" : "Add Video"}
                  </Button>
                </form>
              </div>

              {/* Video List */}
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  Video Library
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="rounded-lg border border-white/10 bg-white/5 p-4"
                    >
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="mb-4 aspect-video w-full rounded-md object-cover"
                      />
                      <h3 className="mb-2 font-semibold text-white">
                        {video.title}
                      </h3>
                      <p className="text-sm text-white/60">{video.client}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`featured-${video.id}`}
                            checked={video.featured}
                            onCheckedChange={() =>
                              updateVideo(video.id, {
                                featured: !video.featured,
                              })
                            }
                          />
                          <Label
                            htmlFor={`featured-${video.id}`}
                            className="text-white"
                          >
                            Featured
                          </Label>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(video)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(video.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="mt-6">
              {/* Social Links Form */}
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  {editingSocialId ? "Edit Social Link" : "Add New Social Link"}
                </h2>
                <form onSubmit={handleSocialSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        Platform Name
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
                        placeholder="e.g., Instagram"
                        required
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="icon" className="text-white">
                        Icon Name
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
                        placeholder="e.g., Instagram"
                        required
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
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
                        placeholder="https://..."
                        required
                        className="bg-white/5 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div className="space-y-2">
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
                        placeholder="@username"
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
              <div className="mt-8 rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  Social Links
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {socialLinks.map((link) => (
                    <div
                      key={link.id}
                      className="rounded-lg border border-white/10 bg-white/5 p-4"
                    >
                      <h3 className="mb-2 font-semibold text-white">
                        {link.name}
                      </h3>
                      <p className="text-sm text-white/60">{link.username}</p>
                      <p className="mt-2 text-sm text-white/40">{link.url}</p>
                      <div className="mt-4 flex justify-end gap-2">
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
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
