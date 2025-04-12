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
    <section className="py-12 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Featured Projects</h2>
          <div className="h-0.5 w-32 bg-teal-500"></div>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
          {filteredProjects.slice(0, 4).map((project) => (
            <div key={project.id} className="flex flex-col">
              {/* Project Screenshot */}
              <div className="mb-4 h-60 overflow-hidden rounded bg-gray-900/50">
                {project.image ? (
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No image</span>
                  </div>
                )}
              </div>
              
              {/* Project Title */}
              <h3 className="text-lg font-medium text-white mb-1">{project.title}</h3>
              
              {/* Tech stack */}
              <div className="flex flex-wrap mb-2">
                {project.tech_stack.map((tech, index) => (
                  <span key={tech} className="text-xs text-teal-400 hover:text-teal-300 cursor-pointer mr-1">
                    {tech}{index < project.tech_stack.length - 1 ? " /" : ""}
                  </span>
                ))}
              </div>
              
              {/* Description */}
              <p className="text-gray-400 mb-3 text-sm line-clamp-2">
                {project.description}
              </p>
              
              {/* Links */}
              <div className="flex gap-4 mt-auto">
                {project.demo && (
                  <a 
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-teal-400 hover:text-teal-300 transition-colors text-xs"
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
                    className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors text-xs"
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