
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Project, fetchVisibleProjects, fetchCategories } from "@/services/projectService";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
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
  }, []);

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeSection="projects" />
      <main className="flex-grow pt-24 pb-16">
        <section className="max-container px-4">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-light">Projects Portfolio</h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore my full collection of projects across various technologies and domains. 
              Each project represents a unique challenge and learning experience.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="border border-border/40 bg-card/30 backdrop-blur-sm">
                  <div className="h-48 bg-gray-800 animate-pulse rounded-t-lg" />
                  <CardHeader>
                    <div className="h-6 w-3/4 bg-gray-800 animate-pulse rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full bg-gray-800 animate-pulse rounded mb-2" />
                    <div className="h-4 w-5/6 bg-gray-800 animate-pulse rounded mb-4" />
                    <div className="h-8 w-1/3 bg-gray-800 animate-pulse rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-10 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    variant={activeCategory.toLowerCase() === category.toLowerCase() ? "secondary" : "ghost"}
                    className="text-sm"
                  >
                    {category === "all" ? "All Projects" : category}
                  </Button>
                ))}
              </div>
              
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
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
    <Card className="flex flex-col border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden hover:border-primary/20 transition-all duration-300">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl">{project.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {project.description}
        </p>
        
        <div className="flex gap-4 mt-2">
          <a 
            href={project.demo} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <span>Live Demo</span>
            <ExternalLink className="ml-1 h-3.5 w-3.5" />
          </a>
          
          <a 
            href={project.github} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <Github className="mr-1 h-3.5 w-3.5" />
            <span>Code</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default Projects;
