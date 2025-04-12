import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProjects } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ExternalLink, Github, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || projects.length === 0) {
    return null; // Don't show the section if there are no projects
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-3">Featured Projects</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">
              A collection of my recent work showcasing various technologies and solutions.
            </p>
          </div>
          
          {isClient && categories.length > 1 && (
            <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="mt-6 md:mt-0">
              <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
                {categories.slice(0, 5).map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.slice(0, 6).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 shadow">
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {project.image ? (
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tech_stack.slice(0, 3).map((tech) => (
                      <Badge 
                        key={tech} 
                        variant="outline"
                        className="text-xs font-normal px-2 py-0.5 bg-gray-50 dark:bg-gray-800"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <Badge variant="outline" className="text-xs font-normal px-2 py-0.5 bg-gray-50 dark:bg-gray-800">
                        +{project.tech_stack.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pb-4 flex-grow">
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                    {project.description}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-0 flex justify-between border-t border-gray-100 dark:border-gray-800 p-4">
                  <div className="flex gap-4">
                    {project.demo && (
                      <a 
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm"
                      >
                        <span>Demo</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors text-sm"
                      >
                        <Github size={14} />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                  
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    <span className="text-sm">Details</span>
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {projects.length > 6 && (
          <div className="flex justify-center mt-12">
            <Button className="px-6">
              View All Projects <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;