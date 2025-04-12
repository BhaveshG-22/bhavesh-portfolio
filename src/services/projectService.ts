
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[]; // This is used in the frontend
  image: string;
  github: string;
  demo: string;
  hidden: boolean | null;
  is_default: boolean | null;
  category: string;
  tags: string[]; // This is what's actually in the database
  created_at: string;
  updated_at: string;
}

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  
  // Map the returned data to match our Project interface
  const projects: Project[] = data.map(project => ({
    ...project,
    tech_stack: project.tags // Map tags to tech_stack for frontend compatibility
  }));
  
  return projects;
}

export async function getFeaturedProjects(limit: number = 3): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_default', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching featured projects:', error);
    throw error;
  }
  
  // Map the returned data to match our Project interface
  const projects: Project[] = data.map(project => ({
    ...project,
    tech_stack: project.tags // Map tags to tech_stack for frontend compatibility
  }));
  
  return projects;
}

export async function getProjectById(id: number): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
  
  // Map the returned data to match our Project interface
  const project: Project = {
    ...data,
    tech_stack: data.tags // Map tags to tech_stack for frontend compatibility
  };
  
  return project;
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: project.title,
      description: project.description,
      category: project.category || 'Other',
      tags: project.tech_stack, // Map tech_stack to tags for database storage
      image: project.image || '',
      github: project.github || '',
      demo: project.demo || '',
      is_default: project.is_default || false,
      hidden: project.hidden || false
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }
  
  // Map the returned data to match our Project interface
  const createdProject: Project = {
    ...data,
    tech_stack: data.tags // Map tags to tech_stack for frontend compatibility
  };
  
  return createdProject;
}

export async function updateProject(id: number, project: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>): Promise<Project> {
  const updateData: any = {};
  
  if (project.title) updateData.title = project.title;
  if (project.description) updateData.description = project.description;
  if (project.category) updateData.category = project.category;
  if (project.tech_stack) updateData.tags = project.tech_stack; // Map tech_stack to tags for database storage
  if (project.image) updateData.image = project.image;
  if (project.github) updateData.github = project.github;
  if (project.demo) updateData.demo = project.demo;
  if (project.is_default !== undefined) updateData.is_default = project.is_default;
  if (project.hidden !== undefined) updateData.hidden = project.hidden;
  
  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }
  
  // Map the returned data to match our Project interface
  const updatedProject: Project = {
    ...data,
    tech_stack: data.tags // Map tags to tech_stack for frontend compatibility
  };
  
  return updatedProject;
}

export async function deleteProject(id: number): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

export async function toggleProjectFeatured(id: number, featured: boolean): Promise<Project> {
  return updateProject(id, { is_default: featured });
}
