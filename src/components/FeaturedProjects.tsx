
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProjects } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2, ExternalLink, Github } from 'lucide-react';

const FeaturedProjects = () => {
  const [filter, setFilter] = useState<string | null>(null);
  
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
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-3">Featured Projects</h2>
          <div className="h-1 w-44 bg-teal-500 mb-10"></div>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {filteredProjects.slice(0, 4).map((project) => (
            <div key={project.id} className="flex flex-col">
              {/* Project Screenshot */}
              <div className="mb-6 h-[220px] overflow-hidden rounded-lg bg-gray-900/50">
                {project.image ? (
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              
              {/* Project Title & Info */}
              <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
              
              {/* Tech stack */}
              <div className="flex flex-wrap mb-3">
                {project.tech_stack.map((tech, index) => (
                  <span 
                    key={tech} 
                    className="text-sm text-teal-400 mr-2"
                  >
                    {tech}{index < project.tech_stack.length - 1 ? " /" : ""}
                  </span>
                ))}
              </div>
              
              {/* Description */}
              <p className="text-gray-400 mb-4 line-clamp-2">
                {project.description}
              </p>
              
              {/* Links */}
              <div className="flex gap-4 mt-auto">
                {project.demo && (
                  <a 
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors group"
                  >
                    <span>Live Preview</span>
                    <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}
                
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors group"
                  >
                    <span>Repo Url</span>
                    <Github size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {projects.length > 4 && (
          <div className="flex justify-center mt-12">
            <Link to="/projects">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                View All Projects
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
