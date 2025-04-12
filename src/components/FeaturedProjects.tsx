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

  const handleFilterClick = (category) => {
    setFilter(filter === category ? null : category);
  };

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

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleFilterClick(category)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === category 
                    ? 'bg-teal-500 text-black' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
            {filter && (
              <button
                onClick={() => setFilter(null)}
                className="px-3 py-1 text-xs rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
          {filteredProjects.slice(0, 4).map((project) => (
            <div key={project.id} className="flex flex-col group">
              {/* Project Screenshot with hover effect */}
              <div className="mb-3 h-60 overflow-hidden rounded bg-gray-900/50 relative">
                {project.image ? (
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No image</span>
                  </div>
                )}
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Project Title */}
              <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
              
              {/* Tech stack */}
              <div className="flex flex-wrap mb-2">
                {project.tech_stack.map((tech, index) => (
                  <button
                    key={tech}
                    onClick={() => handleFilterClick(tech)}
                    className="text-xs text-teal-400 hover:text-teal-300 transition-colors mr-1"
                  >
                    {tech}{index < project.tech_stack.length - 1 ? " /" : ""}
                  </button>
                ))}
              </div>
              
              {/* Description */}
              <p className="text-gray-400 mb-3 text-xs line-clamp-2">
                {project.description}
              </p>
              
              {/* Links */}
              <div className="flex gap-3 mt-auto">
                {project.demo && (
                  <a 
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-teal-400 hover:text-teal-300 transition-colors text-xs group"
                  >
                    <span>Live Preview</span>
                    <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}
                
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors text-xs group"
                  >
                    <span>Repo Url</span>
                    <Github size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {projects.length > 4 && (
          <div className="flex justify-center mt-10">
            <Link to="/projects">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white text-xs px-4 py-2 h-auto">
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