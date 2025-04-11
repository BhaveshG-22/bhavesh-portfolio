
import { supabase } from "@/integrations/supabase/client";

export type Certification = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credential_url?: string;
  hidden?: boolean;
  created_at?: string;
  updated_at?: string;
};

export const fetchCertifications = async (): Promise<Certification[]> => {
  console.log("Fetching all certifications...");
  try {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("date", { ascending: false });
    
    if (error) {
      console.error("Error fetching certifications:", error);
      throw new Error(error.message);
    }
    
    console.log(`Successfully fetched ${data?.length || 0} certifications`);
    return data || [];
  } catch (error) {
    console.error("Unexpected error in fetchCertifications:", error);
    return [];
  }
};

export const fetchVisibleCertifications = async (): Promise<Certification[]> => {
  console.log("Fetching visible certifications...");
  try {
    const allCertifications = await fetchCertifications();
    const visibleCertifications = allCertifications.filter(cert => !cert.hidden);
    console.log(`Returning ${visibleCertifications.length} visible certifications out of ${allCertifications.length} total`);
    return visibleCertifications;
  } catch (error) {
    console.error("Unexpected error in fetchVisibleCertifications:", error);
    return [];
  }
};

export const addCertification = async (certification: Omit<Certification, "id" | "created_at" | "updated_at">): Promise<Certification> => {
  const { data, error } = await supabase
    .from("certifications")
    .insert([certification])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding certification:", error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateCertification = async (id: number, updates: Partial<Omit<Certification, "id" | "created_at" | "updated_at">>): Promise<Certification> => {
  const { data, error } = await supabase
    .from("certifications")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating certification:", error);
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteCertification = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from("certifications")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting certification:", error);
    throw new Error(error.message);
  }
};

export const toggleCertificationVisibility = async (id: number, isHidden: boolean): Promise<Certification> => {
  console.log(`Toggling certification ${id} visibility from ${isHidden} to ${!isHidden}`);
  return updateCertification(id, { hidden: !isHidden });
};
