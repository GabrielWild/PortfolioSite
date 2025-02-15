import { supabase } from "./supabase";
import type { Database } from "@/types/supabase";

export type HeroImage = Database["public"]["Tables"]["hero_images"]["Row"];

export const getHeroImages = async () => {
  const { data, error } = await supabase
    .from("hero_images")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
};

export const addHeroImage = async (
  image: Omit<HeroImage, "id" | "created_at" | "updated_at">,
) => {
  const { data: maxOrderData } = await supabase
    .from("hero_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const maxOrder = maxOrderData?.[0]?.sort_order || 0;

  const { data, error } = await supabase
    .from("hero_images")
    .insert({ ...image, sort_order: maxOrder + 1 })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateHeroImage = async (
  id: string,
  image: Partial<HeroImage>,
) => {
  const { data, error } = await supabase
    .from("hero_images")
    .update(image)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteHeroImage = async (id: string) => {
  const { error } = await supabase.from("hero_images").delete().eq("id", id);
  if (error) throw error;
};
