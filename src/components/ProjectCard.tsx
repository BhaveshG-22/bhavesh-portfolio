
import { Project } from '@/services/projectService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, Star, Pencil, Trash2, Code2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject, toggleProjectFeatured } from '@/services/projectService';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
  isAdmin?: boolean;
}

const ProjectCard = ({ project, isAdmin = false }: ProjectCardProps) => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete project: ${error.message}`);
    }
  });
  
  const toggleFeatureMutation = useMutation({
    mutationFn: ({ id, featured }: { id: number, featured: boolean }) => 
      toggleProjectFeatured(id, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(`Project ${project.is_default ? 'unfeatured' : 'featured'} successfully`);
    },
    onError: (error: any) => {
      toast.error(`Failed to update project: ${error.message}`);
    }
  });

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    deleteMutation.mutate(project.id);
  };
  
  const handleToggleFeatured = () => {
    toggleFeatureMutation.mutate({ 
      id: project.id, 
      featured: !project.is_default 
    });
  };

  // Check if the project is deployed (has a demo link)
  const isDeployed = Boolean(project.demo);
  
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300">
      <div className="relative h-52 overflow-hidden">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle>{project.title}</CardTitle>
        <div className="flex flex-wrap gap-1 mt-2">
          {project.tags.map((tech) => (
            <Badge key={tech} variant="secondary" className="mr-1 mb-1">
              {tech}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3">{project.description}</CardDescription>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 pb-4 border-t">
        <div className="flex space-x-2">
          {/* Only show links if the project is deployed */}
          {isDeployed && (
            <>
              {project.github && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  title="View source code"
                >
                  <Github size={20} />
                  <span className="sr-only">GitHub</span>
                </a>
              )}
              <a 
                href={project.demo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                title="View live demo"
              >
                <ExternalLink size={20} />
                <span className="sr-only">Live Demo</span>
              </a>
            </>
          )}
        </div>
        
        {/* Display deployment status */}
        <div className="flex items-center">
          {isDeployed ? (
            <span className="text-green-500 text-sm font-medium flex items-center">
              <ExternalLink size={16} className="mr-1" />
              Demo
            </span>
          ) : (
            <span className="text-amber-500 text-sm font-medium flex items-center">
              <Code2 size={16} className="mr-1" />
              Under Development
            </span>
          )}
        </div>
        
        {isAdmin && (
          <div className="flex space-x-2 ml-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleToggleFeatured}
              title={project.is_default ? "Unfeature project" : "Feature project"}
            >
              <Star 
                size={18} 
                className={project.is_default ? "fill-primary text-primary" : ""} 
              />
            </Button>
            <Link to={`/project/edit/${project.id}`}>
              <Button
                size="icon"
                variant="ghost"
                title="Edit project"
              >
                <Pencil size={18} />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDeleteClick}
              title="Delete project"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        )}
      </CardFooter>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{project.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProjectCard;
