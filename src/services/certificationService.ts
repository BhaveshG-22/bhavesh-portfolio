
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
  try {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("date", { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    return [];
  }
};

export const fetchVisibleCertifications = async (): Promise<Certification[]> => {
  try {
    const allCertifications = await fetchCertifications();
    const visibleCertifications = allCertifications.filter(cert => !cert.hidden);
    return visibleCertifications;
  } catch (error) {
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
    throw new Error(error.message);
  }
};

export const toggleCertificationVisibility = async (id: number, isHidden: boolean): Promise<Certification> => {
  return updateCertification(id, { hidden: !isHidden });
};
