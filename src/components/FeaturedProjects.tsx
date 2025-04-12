import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProjects } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, ExternalLink, Github, ArrowRight, Code } from 'lucide-react';

const FeaturedProjects = () => {
  const [filter, setFilter] = useState('all');
  const [isClient, setIsClient] = useState(false);
  
  // Handle hydration by checking if we're client-side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects
  });

  // Extract unique categories from projects
  const categories = ['all', ...Array.from(new Set(
    projects.flatMap(project => project.tech_stack)
  )).filter(Boolean)];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project => project.tech_stack.includes(filter));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || projects.length === 0) {
    return null; // Don't show the section if there are no projects
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col space-y-8 mb-12">
          <div className="space-y-4 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Featured <span className="text-primary">Projects</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-prose mx-auto">
              A collection of my recent work showcasing various technologies and innovative solutions.
            </p>
          </div>
          
          {isClient && categories.length > 1 && (
            <div className="flex justify-center overflow-x-auto py-2">
              <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                {categories.slice(0, 8).map(category => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all",
                      filter === category
                        ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-750"
                    )}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.slice(0, 6).map((project, index) => (
            <div 
              key={project.id}
              className="group relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
              style={{
                opacity: 0,
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`
              }}
            >
              {/* Image overlay with gradient */}
              <div className="relative h-52 overflow-hidden">
                {project.image ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <Code size={48} className="text-gray-400 dark:text-gray-600" />
                  </div>
                )}
                
                {/* Tech stack badges overlaid on image */}
                <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-2">
                  {project.tech_stack.slice(0, 3).map((tech) => (
                    <span 
                      key={tech}
                      className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <span className="bg-primary/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex flex-col flex-grow p-5 space-y-4">
                <h3 className="text-xl font-bold tracking-tight line-clamp-1">{project.title}</h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow line-clamp-3">
                  {project.description}
                </p>
                
                <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                  <div className="flex space-x-3">
                    {project.demo && (
                      <a 
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Live demo of ${project.title}`}
                      >
                        <ExternalLink size={16} className="mr-1" />
                        <span className="text-sm font-medium">Demo</span>
                      </a>
                    )}
                    
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        aria-label={`GitHub repository for ${project.title}`}
                      >
                        <Github size={16} className="mr-1" />
                        <span className="text-sm font-medium">Code</span>
                      </a>
                    )}
                  </div>
                  
                  <button 
                    className="group/btn text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center"
                    aria-label={`View details for ${project.title}`}
                  >
                    Details
                    <ArrowRight size={14} className="ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {projects.length > 6 && (
          <div className="flex justify-center mt-16">
            <Button className="group px-6 py-2 font-medium rounded-full hover:shadow-md transition-all">
              <span>View All Projects</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default FeaturedProjects;