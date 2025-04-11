
import { useState, useEffect } from "react";
import { Project, fetchProjects, fetchCategories } from "@/services/projectService";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { runSupabaseConnectionTest } from "@/utils/supabaseConnectionTest";
import { useAuth } from "@/contexts/AuthContext";

import ProjectCard from "@/components/project-page/ProjectCard";
import ProjectCardSkeleton from "@/components/project-page/ProjectCardSkeleton";
import CategoryFilter from "@/components/project-page/CategoryFilter";
import ConnectionDebug from "@/components/project-page/ConnectionDebug";

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const { isAdmin } = useAuth();
  
  useEffect(() => {
    const testConnection = async () => {
      try {
        const result = await runSupabaseConnectionTest();
        setConnectionStatus(result);
        console.log("Supabase connection test result in Projects.tsx:", result);
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
        
        // Direct fetch from Supabase to check if we can get raw data
        if (isAdmin) {
          const { data: rawData, error: rawError } = await fetch("https://pdlleyruhdefngyxetby.supabase.co/rest/v1/projects?select=*", {
            headers: {
              "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbGxleXJ1aGRlZm5neXhldGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNzk3MTcsImV4cCI6MjA1OTY1NTcxN30.suCSyxmO8PhfWfAY6RYQKa3AhRzE6RVax_VEKJHI8SQ",
              "Content-Type": "application/json"
            }
          }).then(res => res.json());
          
          console.log("Direct Supabase API check for projects:", rawData);
          
          if (rawError) {
            console.error("Raw Supabase API error:", rawError);
          }
        }
        
        // CHANGE: Use fetchProjects instead of fetchVisibleProjects to get all projects
        const [projectsData, categoriesData] = await Promise.all([
          fetchProjects(),
          fetchCategories()
        ]);
        
        setProjects(projectsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading projects:", error);
        toast.error("Failed to load projects. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, [isAdmin]);

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeSection="projects" />
      <main className="flex-grow pt-24 pb-16 bg-background">
        <section className="max-container px-4">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-light">Projects Portfolio</h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore my full collection of projects across various technologies and domains. 
              Each project represents a unique challenge and learning experience.
            </p>
            
            {/* Connection test display - Only visible for admins */}
            {isAdmin && connectionStatus && (
              <ConnectionDebug connectionStatus={connectionStatus} />
            )}
            
            {/* Projects length info - Only visible for admins */}
            {isAdmin && (
              <div className="mt-4 text-sm text-muted-foreground">
                Found {projects.length} projects in total.
                Current filter: {activeCategory}
                Filtered projects: {filteredProjects.length}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, index) => (
                <ProjectCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
              
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-card/30 rounded-lg border border-border/40 backdrop-blur-sm p-8">
                  No projects in this category yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
