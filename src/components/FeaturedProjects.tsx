import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProjects } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2, ExternalLink, Github, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturedProjects = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [visibleProjects, setVisibleProjects] = useState([]);
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects
  });

  // Extract unique categories from projects
  const categories = Array.from(new Set(
    projects.flatMap(project => project.tech_stack)
  )).filter(Boolean);

  // Update visible projects when filter changes
  useEffect(() => {
    const filtered = activeFilter
      ? projects.filter(project => project.tech_stack.includes(activeFilter))
      : projects;
    
    setVisibleProjects(filtered.slice(0, 4));
  }, [activeFilter, projects]);

  const handleFilterChange = (category) => {
    setActiveFilter(prevFilter => prevFilter === category ? null : category);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (error || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header with filter tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Featured <span className="text-teal-400">Projects</span>
            </h2>
            <p className="text-gray-400 mt-2 max-w-lg">
              A collection of my best work showcasing various technologies and design approaches
            </p>
          </div>
          
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
              <button
                onClick={() => setActiveFilter(null)}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${
                  activeFilter === null 
                    ? 'bg-teal-500 text-gray-900' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {categories.slice(0, 5).map(category => (
                <button
                  key={category}
                  onClick={() => handleFilterChange(category)}
                  className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${
                    activeFilter === category 
                      ? 'bg-teal-500 text-gray-900' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative flex flex-col bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-teal-500/40 transition-all"
            >
              {/* Project Screenshot with overlay */}
              <div className="h-56 overflow-hidden relative">
                {project.image ? (
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500">No preview available</span>
                  </div>
                )}
                
                {/* Tech badge overlay */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {project.tech_stack.slice(0, 3).map(tech => (
                    <span 
                      key={tech}
                      className="bg-gray-900/80 backdrop-blur-sm text-teal-400 px-2 py-1 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <span className="bg-gray-900/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 mb-6 text-sm line-clamp-2 flex-grow">
                  {project.description}
                </p>
                
                {/* Links */}
                <div className="flex gap-4 pt-4 border-t border-gray-800">
                  {project.demo && (
                    <a 
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium group/link"
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                  
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-gray-400 hover:text-gray-300 transition-colors text-sm font-medium group/link"
                    >
                      <span>Source Code</span>
                      <Github size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {projects.length > 4 && (
          <div className="flex justify-center mt-12">
            <Link to="/projects" className="group">
              <Button className="bg-teal-500 hover:bg-teal-600 text-gray-900 font-medium flex items-center gap-2">
                <span>View All Projects</span>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;