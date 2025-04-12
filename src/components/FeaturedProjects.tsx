import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProjects } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2, ExternalLink, Github, ArrowRight } from 'lucide-react';

const FeaturedProjects = () => {
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects
  });

  // Select only featured projects (in a real app, this might come from an API flag)
  // For now we'll just take the first 4 projects
  const featuredProjects = projects.slice(0, 4);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || featuredProjects.length === 0) {
    return null; // Don't show the section if there are no projects
  }

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Work</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-xl">
              Selected projects showcasing my expertise and skills
            </p>
          </div>
          
          <Link to="/projects">
            <Button variant="ghost" className="hidden sm:flex items-center group">
              <span>View All</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          {featuredProjects.map((project) => (
            <div key={project.id} className="group relative bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="aspect-[16/9] overflow-hidden">
                {project.image ? (
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                    <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">No image available</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{project.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tech_stack.slice(0, 3).map((tech) => (
                    <span 
                      key={tech} 
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-5 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex gap-4">
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
                        className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        aria-label={`GitHub repository for ${project.title}`}
                      >
                        <Github size={16} className="mr-1" />
                        <span className="text-sm font-medium">Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center sm:hidden">
          <Link to="/projects">
            <Button className="px-6">
              See All Projects
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;