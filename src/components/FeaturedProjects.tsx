import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProjects } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2, ExternalLink, Github } from 'lucide-react';

const FeaturedProjects = () => {
  const [filter, setFilter] = useState(null);
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects
  });

  const filteredProjects = filter
    ? projects.filter(project => project.tech_stack.includes(filter))
    : projects;

  // Extract unique categories from projects
  const categories = Array.from(new Set(
    projects.flatMap(project => project.tech_stack)
  )).filter(Boolean);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || projects.length === 0) {
    return null; // Don't show the section if there are no projects
  }

  return (
    <section className="py-12 bg-background text-foreground">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-foreground mb-1 tracking-tight">Featured Projects</h2>
          <div className="h-0.5 w-32 bg-primary"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
          {filteredProjects.slice(0, 4).map((project) => (
            <div key={project.id} className="flex flex-col bg-card rounded-lg p-4 border border-border">
              <div className="mb-4 h-60 overflow-hidden rounded bg-muted/50">
                {project.image ? (
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">No image</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-medium text-card-foreground mb-1 tracking-tight">{project.title}</h3>
              
              <div className="flex flex-wrap mb-2">
                {project.tech_stack.map((tech, index) => (
                  <span 
                    key={tech} 
                    className="text-xs text-primary hover:text-primary/80 cursor-pointer mr-1 font-light"
                  >
                    {tech}{index < project.tech_stack.length - 1 ? " /" : ""}
                  </span>
                ))}
              </div>
              
              <p className="text-muted-foreground mb-3 text-sm line-clamp-2 font-light leading-relaxed">
                {project.description}
              </p>
              
              <div className="flex gap-4 mt-auto">
                {project.demo && (
                  <a 
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-xs font-light"
                  >
                    <span>Live Preview</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-secondary hover:text-secondary/80 transition-colors text-xs font-light"
                  >
                    <span>Repo Url</span>
                    <Github size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
