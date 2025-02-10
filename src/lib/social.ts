import { supabase } from "./supabase";
import type { Database } from "@/types/supabase";

export type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];

export const getSocialLinks = async () => {
  const { data, error } = await supabase.from("social_links").select("*");
  if (error) throw error;
  return data;
};

export const addSocialLink = async (
  link: Omit<SocialLink, "id" | "created_at" | "updated_at">,
) => {
  const { data, error } = await supabase
    .from("social_links")
    .insert(link)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateSocialLink = async (
  id: string,
  link: Partial<SocialLink>,
) => {
  const { data, error } = await supabase
    .from("social_links")
    .update(link)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteSocialLink = async (id: string) => {
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw error;
};
