
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Project } from "@/services/projectService"; // Use the consistent Project type
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      console.log("Fetching projects in Admin ProjectsList");
      const { data, error } = await supabase
        .from('projects')
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects in admin:", error);
        throw error;
      }
      
      console.log(`Admin: Successfully fetched ${data?.length || 0} projects`);
      
      // Safely convert to Project[] type
      setProjects(data as Project[]);
    } catch (error: any) {
      toast.error(`Failed to fetch projects: ${error.message}`);
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fix: Convert id parameter to number before passing to Supabase
  const handleDeleteProject = async (id: string | number) => {
    try {
      // Convert id to number if it's a string
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', numericId);

      if (error) throw error;
      
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error: any) {
      toast.error(`Failed to delete project: ${error.message}`);
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Current Projects</h2>
      
      {/* Debug info */}
      <div className="mb-4 p-3 bg-muted/20 rounded-md border border-border/30">
        <p className="text-sm text-muted-foreground">Projects count: {projects.length}</p>
        <details className="mt-2">
          <summary className="text-sm cursor-pointer text-primary">Debug info</summary>
          <pre className="mt-2 p-2 bg-muted/30 text-xs rounded overflow-auto max-h-60">
            {JSON.stringify(projects[0] || {}, null, 2)}
          </pre>
        </details>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading projects...</span>
        </div>
      ) : projects.length === 0 ? (
        <p className="text-muted-foreground py-4">No projects added yet.</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="bg-card border-border/60 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
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
                <p className="text-muted-foreground my-2">{project.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {project.category}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
