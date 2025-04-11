import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  demo: string;
  category: string;
  hidden?: boolean;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
};

export const fetchProjects = async (): Promise<Project[]> => {
  console.log("Fetching all projects...");
  try {
    console.log("Making Supabase request to fetch all projects");
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("is_default", { ascending: false })
      .order("id");
    
    if (error) {
      console.error("Error fetching projects:", error);
      throw new Error(error.message);
    }
    
    console.log(`Successfully fetched ${data?.length || 0} projects`);
    if (data && data.length > 0) {
      console.log("First project:", data[0]);
      console.log("Project hidden values:", data.map(p => `${p.id}: ${p.hidden}`));
    } else {
      console.log("No projects found");
    }
    
    return data || [];
  } catch (error) {
    console.error("Unexpected error in fetchProjects:", error);
    throw error;
  }
};

export const fetchVisibleProjects = async (): Promise<Project[]> => {
  console.log("Fetching visible projects...");
  try {
    // First, let's check ALL projects to see what we have
    const allProjects = await fetchProjects();
    console.log(`Total projects in database: ${allProjects.length}`);
    
    console.log("Making Supabase request to fetch visible projects");
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("hidden", false)
      .order("is_default", { ascending: false })
      .order("id");
    
    if (error) {
      console.error("Error fetching visible projects:", error);
      throw new Error(error.message);
    }
    
    console.log(`Successfully fetched ${data?.length || 0} visible projects`);
    if (data && data.length > 0) {
      console.log("First visible project:", data[0]);
    } else {
      console.log("No visible projects found - verify if all projects have hidden=true");
      
      // Check if we have any projects that are just showing as hidden
      if (allProjects.length > 0) {
        console.log("All projects are hidden=true. You should set some to hidden=false to make them visible.");
      }
    }
    
    return data || [];
  } catch (error) {
    console.error("Unexpected error in fetchVisibleProjects:", error);
    // Instead of throwing error, return empty array to prevent UI from breaking
    return [];
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("project_categories")
    .select("name")
    .order("id");
  
  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.message);
  }
  
  return (data || []).map(category => category.name);
};

export const addProject = async (project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project> => {
  const { data, error } = await supabase
    .from("projects")
    .insert([project])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding project:", error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateProject = async (id: number, updates: Partial<Omit<Project, "id" | "created_at" | "updated_at">>): Promise<Project> => {
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating project:", error);
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteProject = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting project:", error);
    throw new Error(error.message);
  }
};

export const toggleProjectVisibility = async (id: number, isHidden: boolean): Promise<Project> => {
  console.log(`Toggling project ${id} visibility from ${isHidden} to ${!isHidden}`);
  return updateProject(id, { hidden: !isHidden });
};

export const addCategory = async (name: string): Promise<string> => {
  const { data, error } = await supabase
    .from("project_categories")
    .insert([{ name }])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding category:", error);
    throw new Error(error.message);
  }
  
  return data.name;
};

export const deleteCategory = async (name: string): Promise<void> => {
  const { error } = await supabase
    .from("project_categories")
    .delete()
    .eq("name", name);
  
  if (error) {
    console.error("Error deleting category:", error);
    throw new Error(error.message);
  }
};

export const resetCategories = async (): Promise<string[]> => {
  // First delete all non-default categories
  await supabase
    .from("project_categories")
    .delete()
    .not("name", "in", '("all","frontend","backend","fullstack")');
  
  // Make sure default categories exist - by checking and adding any missing ones
  const defaultCategories = ["all", "frontend", "backend", "fullstack"];
  
  // Get existing categories 
  const { data: existingCategoriesData } = await supabase
    .from("project_categories")
    .select("name");
    
  const existingCategories = (existingCategoriesData || []).map(cat => cat.name);
  
  // Add any missing default categories
  for (const category of defaultCategories) {
    if (!existingCategories.includes(category)) {
      await supabase
        .from("project_categories")
        .insert({ name: category });
    }
  }
  
  return fetchCategories();
};
