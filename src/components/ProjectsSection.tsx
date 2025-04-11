
import { useState, useEffect } from "react";
import { Project, fetchProjects, fetchCategories } from "@/services/projectService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { runSupabaseConnectionTest } from "@/utils/supabaseConnectionTest";

import CategoryFilter from "./project-section/CategoryFilter";
import ConnectionStatus from "./project-section/ConnectionStatus";
import ProjectsGrid from "./project-section/ProjectsGrid";
import ProjectStats from "./project-section/ProjectStats";

// Default categories in case we can't fetch from Supabase
const DEFAULT_CATEGORIES = ["all", "frontend", "backend", "fullstack"];

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const { isAdmin } = useAuth();
  
  useEffect(() => {
    const testConnection = async () => {
      try {
        const result = await runSupabaseConnectionTest();
        setConnectionStatus(result);
        console.log("Supabase connection test result in ProjectsSection.tsx:", result);
      } catch (error) {
        console.error("Error testing Supabase connection:", error);
      }
    };
    
    testConnection();
  }, []);
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        console.log("Loading projects, user is admin:", isAdmin);
        
        // Always load ALL projects
        const allProjectsData = await fetchProjects();
        console.log("All projects data:", allProjectsData);
        setAllProjects(allProjectsData);
        
        // CHANGE: Always show all projects regardless of hidden status
        setProjects(allProjectsData);
        
        // Fetch categories
        const categoriesData = await fetchCategories();
        console.log("Categories data:", categoriesData);
        
        // Set state with fetched data
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading projects or categories:", error);
        toast.error("Failed to load projects. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, [isAdmin]);

  return (
    <section id="projects" className="section-padding bg-gray-950 text-white">
      <div className="max-container">
        <div className="flex flex-col items-start mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-light">Featured Projects</h2>
          <div className="w-32 h-1 bg-teal-500 opacity-80 mb-8" />
          
          {/* Show/Hide All Projects Toggle - Only visible to admin */}
          {isAdmin && (
            <ProjectStats 
              allProjects={allProjects}
              showAllProjects={showAllProjects}
              setShowAllProjects={setShowAllProjects}
            />
          )}
          
          {/* Connection test display - Only visible to admin */}
          {isAdmin && connectionStatus && (
            <ConnectionStatus connectionStatus={connectionStatus} />
          )}
          
          {isLoading ? (
            <div className="w-full flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 w-48 bg-gray-700 rounded"></div>
              </div>
            </div>
          ) : (
            <>
              <CategoryFilter 
                categories={categories} 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
              />
              
              <ProjectsGrid 
                projects={projects} 
                activeCategory={activeCategory} 
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
