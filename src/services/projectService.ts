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

// Modified to correctly filter out hidden projects
export const fetchVisibleProjects = async (): Promise<Project[]> => {
  console.log("Fetching visible projects...");
  try {
    const allProjects = await fetchProjects();
    const visibleProjects = allProjects.filter(project => !project.hidden);
    console.log(`Returning ${visibleProjects.length} visible projects out of ${allProjects.length} total`);
    return visibleProjects;
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
  // First get the project to retrieve its image URL
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("image")
    .eq("id", id)
    .single();
  
  if (fetchError) {
    console.error("Error fetching project for deletion:", fetchError);
    throw new Error(fetchError.message);
  }
  
  // Delete the project from the database
  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);
  
  if (deleteError) {
    console.error("Error deleting project:", deleteError);
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

// Add this function to update or create the second project
export const updateSecondProject = async (): Promise<void> => {
  try {
    // Get all projects
    const projects = await fetchProjects();
    
    // If we have at least two projects, update the second one
    // Otherwise create a new one
    if (projects.length >= 2) {
      // Sort by ID to make sure we get the second one
      const sortedProjects = projects.sort((a, b) => a.id - b.id);
      const secondProject = sortedProjects[1];
      
      // Update the second project
      const updatedProject = await updateProject(secondProject.id, {
        title: "Drench Clone Game",
        description: "Developed a clone of the Drench game using React and Tailwind CSS, providing users with an addictive and challenging puzzle experience. Implemented color-matching mechanics on a grid, requiring strategic thinking and planning. The game offers an immersive and visually captivating interface.",
        image: "public/lovable-uploads/963582ea-1dcf-4747-9978-6bb62c430af0.png",
        github: "https://github.com/BhaveshG-22/drenchClone-Client",
        demo: "https://drench-clone.vercel.app/",
        category: "frontend",
        tags: ["React", "Tailwind CSS", "Game Development", "Frontend"],
        is_default: true
      });
      
      console.log("Successfully updated the second project:", updatedProject);
    } else {
      // Create a new project
      const newProject = await addProject({
        title: "Drench Clone Game",
        description: "Developed a clone of the Drench game using React and Tailwind CSS, providing users with an addictive and challenging puzzle experience. Implemented color-matching mechanics on a grid, requiring strategic thinking and planning. The game offers an immersive and visually captivating interface.",
        image: "public/lovable-uploads/963582ea-1dcf-4747-9978-6bb62c430af0.png",
        github: "https://github.com/BhaveshG-22/drenchClone-Client",
        demo: "https://drench-clone.vercel.app/",
        category: "frontend",
        tags: ["React", "Tailwind CSS", "Game Development", "Frontend"],
        is_default: true
      });
      
      console.log("Successfully created a new second project:", newProject);
    }
  } catch (error) {
    console.error("Error updating/creating the second project:", error);
    throw new Error("Failed to update/create the second project");
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
