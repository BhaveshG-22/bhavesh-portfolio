
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
    
    // Let's add a direct fetch with more logging
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
    
    // Even if data is null, return an empty array instead of null
    return data || [];
  } catch (error) {
    console.error("Unexpected error in fetchProjects:", error);
    // Return empty array instead of throwing to prevent UI from breaking
    return [];
  }
};

// Modified to return all projects instead of just visible ones
export const fetchVisibleProjects = async (): Promise<Project[]> => {
  console.log("Fetching all projects (no longer filtering by visibility)...");
  try {
    // Instead of filtering, just return all projects
    const allProjects = await fetchProjects();
    console.log(`Returning all ${allProjects.length} projects`);
    return allProjects;
  } catch (error) {
    console.error("Unexpected error in fetchVisibleProjects:", error);
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

// Add this function to update the first project
export const updateFirstProject = async (): Promise<void> => {
  try {
    // First get all projects to find the one with lowest ID
    const projects = await fetchProjects();
    if (projects.length === 0) {
      console.error("No projects found to update");
      return;
    }
    
    // Sort by ID to make sure we get the first one
    const firstProject = projects.sort((a, b) => a.id - b.id)[0];
    
    // Update the first project with new Blog App data
    const updatedProject = await updateProject(firstProject.id, {
      title: "Blogging App",
      description: "Developed Blogging App with React, Node.js, MongoDB, and secure user authentication, offering seamless registration, login, and responsive experiences. Utilized React libraries for enhanced functionality and MongoDB Atlas for data storage and CRUD operations.",
      image: "public/lovable-uploads/c927f09a-08d3-42f0-b7a8-fc7b81d7704c.png",
      github: "https://github.com/BhaveshG-22/BlogApp2.0",
      demo: "https://blog-app2-0.vercel.app/",
      category: "fullstack",
      tags: ["React", "Node.js", "MongoDB", "Express", "Bootstrap"],
      is_default: true
    });
    
    console.log("Successfully updated the first project:", updatedProject);
  } catch (error) {
    console.error("Error updating the first project:", error);
    throw new Error("Failed to update the first project");
  }
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
