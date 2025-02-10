import React from "react";
import VideoGrid from "./VideoGrid";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";

const Home = () => {
  const projects = [
    {
      id: "1",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=360&h=360&q=80",
      videoUrl:
        "https://player.vimeo.com/external/459863027.hd.mp4?s=652e27550a35d76a577d4dce6dddb51f7655b0d4&profile_id=175&oauth2_token_id=57447761",
      title: "Cinematic Wedding",
      client: "Sarah & John",
    },
    {
      id: "2",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=360&h=360&q=80",
      videoUrl:
        "https://player.vimeo.com/external/459863027.hd.mp4?s=652e27550a35d76a577d4dce6dddb51f7655b0d4&profile_id=175&oauth2_token_id=57447761",
      title: "Urban Documentary",
      client: "City Stories",
    },
    {
      id: "3",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=360&h=360&q=80",
      videoUrl:
        "https://player.vimeo.com/external/459863027.hd.mp4?s=652e27550a35d76a577d4dce6dddb51f7655b0d4&profile_id=175&oauth2_token_id=57447761",
      title: "Music Festival Highlights",
      client: "Summer Fest",
    },
    {
      id: "4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=360&h=360&q=80",
      videoUrl:
        "https://player.vimeo.com/external/459863027.hd.mp4?s=652e27550a35d76a577d4dce6dddb51f7655b0d4&profile_id=175&oauth2_token_id=57447761",
      title: "Corporate Event",
      client: "Tech Corp",
    },
    {
      id: "5",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=360&h=360&q=80",
      videoUrl:
        "https://player.vimeo.com/external/459863027.hd.mp4?s=652e27550a35d76a577d4dce6dddb51f7655b0d4&profile_id=175&oauth2_token_id=57447761",
      title: "Travel Series",
      client: "Wanderlust",
    },
    {
      id: "6",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=360&h=360&q=80",
      videoUrl:
        "https://player.vimeo.com/external/459863027.hd.mp4?s=652e27550a35d76a577d4dce6dddb51f7655b0d4&profile_id=175&oauth2_token_id=57447761",
      title: "Short Film",
      client: "Film Studio",
    },
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Navbar isHome={true} />
      <VideoGrid videos={projects} />
    </div>
  );
};

export default Home;
