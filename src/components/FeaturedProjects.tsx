
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProjects } from '@/services/projectService';
import ProjectCard from '@/components/ProjectCard';
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
    <section className="py-16 bg-[#0F111A]">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-5xl font-bold text-white mb-4">Featured Projects</h2>
          <div className="h-1 w-52 bg-gradient-to-r from-teal-400 to-teal-200 mb-10"></div>
          
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-3 mt-8">
            <Button
              onClick={() => setFilter(null)}
              variant={!filter ? "default" : "outline"} 
              className={`rounded-md ${!filter ? 'bg-teal-500 hover:bg-teal-600 text-black' : 'border-gray-600 text-gray-300'}`}
            >
              All
            </Button>
            
            {categories.slice(0, 5).map((category) => (
              <Button
                key={category}
                onClick={() => setFilter(category)}
                variant={filter === category ? "default" : "outline"}
                className={`rounded-md ${filter === category ? 'bg-transparent border border-gray-600 text-gray-300' : 'bg-transparent border border-gray-600 text-gray-300'}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 gap-8 mt-8">
          {filteredProjects.slice(0, 3).map((project) => (
            <div key={project.id} className="bg-[#1A1D29] rounded-lg overflow-hidden border border-gray-800">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-60 md:h-auto relative">
                  {project.image ? (
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-4xl font-bold text-white mb-4">{project.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-3 py-1 text-sm rounded-md bg-[#20232F] border border-teal-500/20 text-teal-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-gray-300 mb-6 line-clamp-3 md:line-clamp-4">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    {project.demo && (
                      <a 
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
                      >
                        <ExternalLink size={18} />
                        Live Preview
                      </a>
                    )}
                    
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        <Github size={18} />
                        Repo URL
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <Link to="/projects">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              View All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
