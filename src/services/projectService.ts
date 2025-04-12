
import { supabase } from "@/integrations/supabase/client";
import { deleteProjectImage, isProjectImage } from "./projectImageService";

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

// Fetch all projects, including hidden ones (for admin use)
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("is_default", { ascending: false })
      .order("id");
    
    if (error) {
      console.error("Error fetching projects:", error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error("Unexpected error in fetchProjects:", error);
    // Return empty array instead of throwing to prevent UI from breaking
    return [];
  }
};

// Fetch only visible projects (for public display)
export const fetchVisibleProjects = async (): Promise<Project[]> => {
  try {
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
    
    return data || [];
  } catch (error) {
    console.error("Unexpected error in fetchVisibleProjects:", error);
    return [];
  }
};

// Fetch available project categories
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from("project_categories")
      .select("name")
      .order("id");
    
    if (error) {
      console.error("Error fetching categories:", error);
      throw new Error(error.message);
    }
    
    return (data || []).map(category => category.name);
  } catch (error) {
    console.error("Error in fetchCategories:", error);
    return [];
  }
};

// Add a new project
export const addProject = async (project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project> => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert([project])
      .select();
    
    if (error) {
      console.error("Error adding project:", error);
      throw new Error(error.message);
    }
    
    if (!data || data.length === 0) {
      throw new Error("Failed to add project: No data returned");
    }
    
    return data[0];
  } catch (error: any) {
    console.error("Error in addProject:", error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (id: number, updates: Partial<Omit<Project, "id" | "created_at" | "updated_at">>): Promise<Project> => {
  try {
    // Check if project exists before updating
    const { data: existingProject, error: checkError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    if (checkError) {
      throw new Error(checkError.message);
    }
    
    if (!existingProject) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    // Perform the update
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select();
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data || data.length === 0) {
      // Return the existing project with updates applied as fallback
      return { ...existingProject, ...updates, id: existingProject.id };
    }
    
    return data[0];
  } catch (error: any) {
    console.error("Error in updateProject:", error);
    throw error;
  }
};

// Delete a project and its associated image
export const deleteProject = async (id: number): Promise<void> => {
  try {
    // Get the project to retrieve its image URL
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("image")
      .eq("id", id)
      .single();
    
    if (fetchError) {
      throw new Error(fetchError.message);
    }
    
    // Delete the project from the database
    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);
    
    if (deleteError) {
      throw new Error(deleteError.message);
    }
    
    // If the project had an image in our storage bucket, delete it
    if (project && project.image && isProjectImage(project.image)) {
      try {
        await deleteProjectImage(project.image);
      } catch (imageError) {
        console.error("Error deleting project image:", imageError);
        // Don't throw here, as the project was already deleted successfully
      }
    }
  } catch (error: any) {
    console.error("Error in deleteProject:", error);
    throw error;
  }
};

// Toggle project visibility
export const toggleProjectVisibility = async (id: number, isCurrentlyHidden: boolean): Promise<Project> => {
  try {
    return await updateProject(id, { hidden: !isCurrentlyHidden });
  } catch (error: any) {
    console.error("Error in toggleProjectVisibility:", error);
    throw error;
  }
};

// Add a category
export const addCategory = async (name: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from("project_categories")
      .insert([{ name }])
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data.name;
  } catch (error: any) {
    console.error("Error in addCategory:", error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (name: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("project_categories")
      .delete()
      .eq("name", name);
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error("Error in deleteCategory:", error);
    throw error;
  }
};

// Reset categories to defaults
export const resetCategories = async (): Promise<string[]> => {
  try {
    // First delete all non-default categories
    await supabase
      .from("project_categories")
      .delete()
      .not("name", "in", '("all","frontend","backend","fullstack")');
    
    // Make sure default categories exist
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
  } catch (error: any) {
    console.error("Error in resetCategories:", error);
    throw error;
  }
};
