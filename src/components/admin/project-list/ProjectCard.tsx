
import React from "react";
import { toast } from "sonner";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { Project, toggleProjectVisibility } from "@/services/projectService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

interface ProjectCardProps {
  project: Project;
  onProjectDeleted: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onProjectDeleted }) => {
  // Handle project deletion
  const handleDeleteProject = async (id: number) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Project deleted successfully");
      onProjectDeleted();
    } catch (error: any) {
      toast.error(`Failed to delete project: ${error.message}`);
      console.error("Error deleting project:", error);
    }
  };

  // Handle project visibility toggle
  const handleToggleVisibility = async (project: Project) => {
    try {
      await toggleProjectVisibility(project.id, project.hidden || false);
      toast.success(`Project is now ${project.hidden ? 'visible' : 'hidden'}`);
      onProjectDeleted(); // Refresh projects to update UI
    } catch (error: any) {
      toast.error(`Failed to update project visibility: ${error.message}`);
      console.error("Error updating project visibility:", error);
    }
  };

  return (
    <Card className="bg-card border-border/60 shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
          <div className="flex space-x-2">
            {/* Add visibility toggle button */}
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleToggleVisibility(project)}
              title={project.hidden ? "Make visible" : "Make hidden"}
            >
              {project.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            {/* Delete button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the project "{project.title}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <p className="text-muted-foreground my-2">{project.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {project.category}
          </Badge>
          {/* Add visibility status badge */}
          <Badge variant={project.hidden ? "destructive" : "outline"} className="text-xs">
            {project.hidden ? "Hidden" : "Visible"}
          </Badge>
          {project.demo && (
            <a 
              href={project.demo} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline text-sm"
            >
              Visit Project
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
