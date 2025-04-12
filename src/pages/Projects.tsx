
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { getAllProjects, Project } from '@/services/projectService';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Projects = () => {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<string | null>(null);
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects
  });

  const uniqueTechStacks = projects.reduce((acc: string[], project) => {
    project.tags.forEach(tech => {
      if (!acc.includes(tech)) {
        acc.push(tech);
      }
    });
    return acc;
  }, []);

  const filteredProjects = filter
    ? projects.filter(project => project.tags.includes(filter))
    : projects;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gradient">Projects</h1>
            <p className="text-muted-foreground">
              Explore my recent work and personal projects
            </p>
          </div>
          {isAuthenticated && (
            <Link to="/project/new">
              <Button className="mt-4 md:mt-0">Add New Project</Button>
            </Link>
          )}
        </div>

        {/* Tech stack filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <Button
            variant={!filter ? "default" : "outline"}
            onClick={() => setFilter(null)}
            className="mb-2"
          >
            All
          </Button>
          {uniqueTechStacks.map(tech => (
            <Button
              key={tech}
              variant={filter === tech ? "default" : "outline"}
              onClick={() => setFilter(tech)}
              className="mb-2"
            >
              {tech}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive">Failed to load projects</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p>No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isAdmin={isAuthenticated}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
