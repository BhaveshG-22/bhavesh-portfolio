import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProjects } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2, ExternalLink, Github, ArrowRight, Layers } from 'lucide-react';
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
        <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
      </div>
    );
  }

  if (error || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-20 relative bg-gradient-to-b from-gray-950 to-gray-900 overflow-hidden">
      {/* Glassmorphism background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl"></div>
      <div className="absolute top-2/3 left-1/2 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl"></div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header with glass effect */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 shadow-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Layers className="text-teal-400" size={28} />
                <span>Featured <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Projects</span></span>
              </h2>
              <p className="text-gray-300/80 mt-2 max-w-lg">
                Explore my latest work showcasing modern design and technology implementations
              </p>
            </div>
            
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter(null)}
                  className={`px-4 py-2 text-xs font-medium rounded-full transition-all backdrop-blur-md ${
                    activeFilter === null 
                      ? 'bg-white/15 text-white shadow-lg border border-white/20' 
                      : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  All
                </button>
                {categories.slice(0, 5).map(category => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange(category)}
                    className={`px-4 py-2 text-xs font-medium rounded-full transition-all backdrop-blur-md ${
                      activeFilter === category 
                        ? 'bg-white/15 text-white shadow-lg border border-white/20' 
                        : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col backdrop-blur-lg bg-white/5 rounded-xl overflow-hidden border border-white/10 shadow-lg hover:shadow-xl hover:bg-white/10 transition-all duration-300"
            >
              {/* Project Screenshot with glass overlay */}
              <div className="h-64 overflow-hidden relative">
                {project.image ? (
                  <>
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-md flex items-center justify-center">
                    <span className="text-gray-400">No preview available</span>
                  </div>
                )}
                
                {/* Floating tech badges */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 transition-opacity duration-300">
                  {project.tech_stack.slice(0, 3).map(tech => (
                    <span 
                      key={tech}
                      className="backdrop-blur-md bg-white/10 text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <span className="backdrop-blur-md bg-white/10 text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Content with glass effect */}
              <div className="p-6 flex flex-col flex-grow relative z-10">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-300/80 mb-6 text-sm line-clamp-2 flex-grow">
                  {project.description}
                </p>
                
                {/* Links with glass effect */}
                <div className="flex gap-6 pt-4 border-t border-white/10">
                  {project.demo && (
                    <a 
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-teal-300 hover:text-teal-200 transition-colors text-sm font-medium group/link"
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
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium group/link"
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center mt-12"
          >
            <Link to="/projects" className="group">
              <Button className="backdrop-blur-md bg-white/10 hover:bg-white/15 text-white border border-white/10 px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg transition-all">
                <span>View All Projects</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;