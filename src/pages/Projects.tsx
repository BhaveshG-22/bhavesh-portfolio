
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Loader2 } from "lucide-react";
import { Project, fetchVisibleProjects, fetchCategories } from "@/services/projectService";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { runSupabaseConnectionTest } from "@/utils/supabaseConnectionTest";
import { useAuth } from "@/contexts/AuthContext";

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
        
        // Load projects and categories from Supabase using our service
        const [projectsData, categoriesData] = await Promise.all([
          fetchVisibleProjects(),
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
              <div className="mt-6 p-4 rounded-md bg-muted/20 text-sm">
                <p>Connection Status: {connectionStatus.success ? '✅ Connected' : '❌ Failed'}</p>
                {connectionStatus.tables && connectionStatus.tables.projects && (
                  <p>Projects Table: {connectionStatus.tables.projects.accessible ? '✅ Accessible' : '❌ Inaccessible'}</p>
                )}
                <details>
                  <summary className="cursor-pointer text-primary hover:underline">View Details</summary>
                  <pre className="mt-2 p-2 bg-muted/30 overflow-auto text-xs rounded">
                    {JSON.stringify(connectionStatus, null, 2)}
                  </pre>
                </details>
              </div>
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
              <div className="flex gap-2 mb-10 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    variant={activeCategory.toLowerCase() === category.toLowerCase() ? "secondary" : "outline"}
                    className="text-sm"
                  >
                    {category === "all" ? "All Projects" : category}
                  </Button>
                ))}
              </div>
              
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

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card className="flex flex-col border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden hover:border-primary/20 transition-all duration-300 h-full">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl text-foreground">{project.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.tags && project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {tag}
            </Badge>
          ))}
          {project.tags && project.tags.length > 3 && (
            <Badge variant="outline" className="bg-secondary/20 text-secondary border-secondary/30">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {project.description}
        </p>
        
        <div className="flex gap-4 mt-auto pt-4">
          {project.demo && (
            <a 
              href={project.demo} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <span>Live Demo</span>
              <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </a>
          )}
          
          {project.github && (
            <a 
              href={project.github} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="mr-1 h-3.5 w-3.5" />
              <span>Code</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectCardSkeleton = () => (
  <Card className="border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden h-full">
    <Skeleton className="h-48 w-full bg-muted/50" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4 bg-muted/50 mb-2" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 bg-muted/50 rounded-full" />
        <Skeleton className="h-5 w-16 bg-muted/50 rounded-full" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full bg-muted/50 mb-2" />
      <Skeleton className="h-4 w-5/6 bg-muted/50 mb-2" />
      <Skeleton className="h-4 w-4/6 bg-muted/50 mb-6" />
      <div className="flex gap-4">
        <Skeleton className="h-5 w-20 bg-muted/50" />
        <Skeleton className="h-5 w-16 bg-muted/50" />
      </div>
    </CardContent>
  </Card>
);

export default Projects;
