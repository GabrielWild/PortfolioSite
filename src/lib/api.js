import { supabase } from "./supabase";

export const getVideos = async () => {
  const { data, error } = await supabase.from("videos").select("*");
  if (error) throw error;
  return data;
};

export const addVideo = async (video) => {
  const { data, error } = await supabase
    .from("videos")
    .insert(video)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateVideo = async (id, video) => {
  const { data, error } = await supabase
    .from("videos")
    .update(video)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteVideo = async (id) => {
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) throw error;
};
