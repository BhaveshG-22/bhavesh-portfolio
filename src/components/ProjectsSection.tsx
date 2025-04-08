
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project, fetchVisibleProjects, fetchProjects, fetchCategories, toggleProjectVisibility } from "@/services/projectService";
import { toast } from "sonner";
import { runSupabaseConnectionTest } from "@/utils/supabaseConnectionTest";

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
        
        // Load ALL projects first to see what we have
        const allProjectsData = await fetchProjects();
        setAllProjects(allProjectsData);
        
        // Log detailed information about the request
        console.log("About to fetch projects from Supabase in ProjectsSection...");
        
        // Load visible projects and categories from Supabase
        const [projectsData, categoriesData] = await Promise.all([
          showAllProjects ? fetchProjects() : fetchVisibleProjects(),
          fetchCategories()
        ]);
        
        console.log("ProjectsSection - Fetched projects:", projectsData);
        console.log("ProjectsSection - Fetched categories:", categoriesData);
        
        setProjects(projectsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading projects or categories:", error);
        toast.error("Failed to load projects. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, [showAllProjects]);

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="projects" className="section-padding bg-gray-950 text-white">
      <div className="max-container">
        <div className="flex flex-col items-start mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-light">Featured Projects</h2>
          <div className="w-32 h-1 bg-teal-500 opacity-80 mb-8" />
          
          {/* Show/Hide All Projects Toggle */}
          <div className="mb-4 w-full flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="flex items-center gap-2 text-xs"
            >
              {showAllProjects ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              {showAllProjects ? "Show Only Visible" : "Show All (Including Hidden)"}
            </Button>
          </div>
          
          {/* Connection test display */}
          {connectionStatus && (
            <div className="w-full mb-6 p-4 rounded-md bg-gray-800/80 text-sm">
              <p>Connection Status: {connectionStatus.success ? '✅ Connected' : '❌ Failed'}</p>
              {connectionStatus.tables && connectionStatus.tables.projects && (
                <>
                  <p>Projects Table: {connectionStatus.tables.projects.accessible ? '✅ Accessible' : '❌ Inaccessible'}</p>
                  <p>Total projects in database: {connectionStatus.tables.projects.total_count}</p>
                  <p>Visible projects (hidden=false): {connectionStatus.tables.projects.visible_count}</p>
                </>
              )}
              <div className="mt-2">
                <details>
                  <summary className="cursor-pointer hover:text-teal-400">Sample Project Data</summary>
                  {connectionStatus.tables && 
                   connectionStatus.tables.projects && 
                   connectionStatus.tables.projects.sample ? (
                    <pre className="mt-2 text-xs bg-black/50 p-2 rounded overflow-auto max-h-60">
                      {JSON.stringify(connectionStatus.tables.projects.sample, null, 2)}
                    </pre>
                  ) : (
                    <p className="mt-2 italic text-gray-400">No sample project available</p>
                  )}
                </details>
              </div>
            </div>
          )}
          
          <div className="w-full mb-6">
            <p>Total Projects: {allProjects.length}</p>
            <p>Visible Projects: {showAllProjects ? allProjects.length : projects.length}</p>
            <p>Filtered Projects: {filteredProjects.length}</p>
          </div>
          
          {isLoading ? (
            <div className="w-full flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 w-48 bg-gray-700 rounded"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-6 mb-10 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "px-4 py-1 text-sm rounded-md transition-all",
                      activeCategory.toLowerCase() === category.toLowerCase()
                        ? "bg-teal-500/20 text-teal-400 border border-teal-500/40"
                        : "text-gray-400 hover:text-gray-200"
                    )}
                  >
                    {category === "all" ? "All" : category}
                  </button>
                ))}
              </div>
              
              {filteredProjects.length === 0 ? (
                <div className="w-full text-center py-12 text-gray-400">
                  No projects in this category yet.
                  {projects.length > 0 && <span> (But {projects.length} projects in other categories)</span>}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="flex flex-col">
      <div className="relative h-64 mb-6 overflow-hidden rounded-xl border border-white/10 backdrop-blur-sm bg-black/40 hover:border-teal-500/30 transition-all">
        {project.hidden && (
          <div className="absolute top-2 right-2 z-10 bg-red-500/80 text-white px-2 py-1 rounded text-xs">
            Hidden
          </div>
        )}
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      
      <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {project.tags.map((tag) => (
          <span key={tag} className="text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
      
      <p className="text-gray-400 mb-5 text-sm">
        {project.description}
      </p>
      
      <div className="flex gap-4 mt-auto">
        <a 
          href={project.demo} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
        >
          <span>Live Preview</span>
          <ExternalLink className="h-4 w-4" />
        </a>
        
        <a 
          href={project.github} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          <span>Repo URL</span>
          <Github className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default ProjectsSection;
