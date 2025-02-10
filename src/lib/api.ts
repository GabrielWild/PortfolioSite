import { supabase } from "./supabase";
import type { Database } from "@/types/supabase";

export type Video = Database["public"]["Tables"]["videos"]["Row"];

export const getVideos = async () => {
  const { data, error } = await supabase.from("videos").select("*");
  if (error) throw error;
  return data;
};

export const addVideo = async (
  video: Omit<Video, "id" | "created_at" | "updated_at">,
) => {
  const { data, error } = await supabase
    .from("videos")
    .insert(video)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateVideo = async (id: string, video: Partial<Video>) => {
  const { data, error } = await supabase
    .from("videos")
    .update(video)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteVideo = async (id: string) => {
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) throw error;
};
