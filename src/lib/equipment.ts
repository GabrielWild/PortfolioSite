import { supabase } from "./supabase";

export type Equipment = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  order?: number;
};

export const getEquipment = async () => {
  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .order("order", { ascending: true });
  if (error) throw error;
  return data;
};

export const addEquipment = async (
  equipment: Omit<Equipment, "id" | "created_at" | "updated_at">,
) => {
  // Get the max order value
  const { data: maxOrderData } = await supabase
    .from("equipment")
    .select("order")
    .order("order", { ascending: false })
    .limit(1);

  const maxOrder = maxOrderData?.[0]?.order || 0;

  // Add new equipment with order = maxOrder + 1
  const { data, error } = await supabase
    .from("equipment")
    .insert({ ...equipment, order: maxOrder + 1 })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateEquipment = async (
  id: string,
  equipment: Partial<Equipment>,
) => {
  const { data, error } = await supabase
    .from("equipment")
    .update(equipment)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteEquipment = async (id: string) => {
  const { error } = await supabase.from("equipment").delete().eq("id", id);
  if (error) throw error;
};
