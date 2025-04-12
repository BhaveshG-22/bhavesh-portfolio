
import { useQuery } from '@tanstack/react-query';
import { getFeaturedProjects } from '@/services/projectService';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const FeaturedProjects = () => {
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['featuredProjects'],
    queryFn: () => getFeaturedProjects(3)
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || projects.length === 0) {
    return null; // Don't show the section if there are no featured projects
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gradient">Featured Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        <div className="flex justify-center">
          <Link to="/projects">
            <Button variant="outline">View All Projects</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
