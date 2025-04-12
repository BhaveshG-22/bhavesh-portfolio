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
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <div className="inline-block bg-teal-500 h-1 w-12 mb-4"></div>
              <h2 className="text-4xl font-bold text-white mb-3">Featured Projects</h2>
              <p className="text-gray-400 max-w-lg">
                A showcase of my recent development work across various technologies
              </p>
            </div>
            
            {/* Filter buttons */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  onClick={() => setActiveFilter(null)}
                  className={`px-4 py-2 text-sm rounded-md transition-all border ${
                    activeFilter === null 
                      ? 'bg-teal-500 text-white border-teal-500' 
                      : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  All
                </button>
                {categories.slice(0, 4).map(category => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange(category)}
                    className={`px-4 py-2 text-sm rounded-md transition-all border ${
                      activeFilter === category 
                        ? 'bg-teal-500 text-white border-teal-500' 
                        : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              {/* Project card */}
              <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden border-b-2 border-gray-900 group-hover:border-teal-500 transition-all duration-300">
                {/* Project image */}
                <div className="relative h-56 overflow-hidden">
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
                  
                  {/* Project number */}
                  <div className="absolute top-4 left-4 bg-gray-900 text-white font-mono text-xs py-1 px-3 rounded">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.slice(0, 3).map(tech => (
                      <span 
                        key={tech}
                        className="bg-gray-800 text-gray-300 px-2 py-1 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <span className="bg-gray-800 text-gray-300 px-2 py-1 text-xs rounded">
                        +{project.tech_stack.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 mb-6 text-sm line-clamp-2 flex-grow">
                    {project.description}
                  </p>
                  
                  {/* Links */}
                  <div className="flex gap-6">
                    {project.demo && (
                      <a 
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium group/link"
                      >
                        <span>View Project</span>
                        <ExternalLink size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                    
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors text-sm font-medium group/link"
                      >
                        <span>Code</span>
                        <Github size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* View all button */}
        {projects.length > 4 && (
          <div className="flex justify-center mt-16">
            <Link to="/projects">
              <Button className="bg-teal-500 hover:bg-teal-600 text-gray-900 font-medium px-6 py-3 h-auto rounded flex items-center gap-2">
                <span>View All Projects</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;