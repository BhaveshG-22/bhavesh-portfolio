
import { toast } from "sonner";
import { Loader2, Trash2, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Project, fetchProjects, toggleProjectVisibility } from "@/services/projectService"; 
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProjectsList();
  }, []);

  const fetchProjectsList = async () => {
    try {
      setLoading(true);
      console.log("Fetching projects in Admin ProjectsList");
      
      // Direct fetch to debug
      try {
        const { data: directData, error: directError } = await supabase
          .from('projects')
          .select('*');
          
        console.log("Direct Supabase projects query:", directData?.length, "projects", directError);
      } catch (err) {
        console.error("Direct query failed:", err);
      }
      
      // Use the fetchProjects function from projectService
      const data = await fetchProjects();
      
      console.log(`Admin: Successfully fetched ${data?.length || 0} projects`);
      if (data && data.length > 0) {
        console.log("First project:", data[0]);
      } else {
        console.log("No projects found or empty array returned");
      }
      
      setProjects(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch projects: ${error.message}`);
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle project deletion
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
      fetchProjectsList(); // Refresh projects after deletion
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
      fetchProjectsList(); // Refresh projects to update UI
    } catch (error: any) {
      toast.error(`Failed to update project visibility: ${error.message}`);
      console.error("Error updating project visibility:", error);
    }
  };

  // Non-admin users shouldn't see this component, but just in case
  if (!isAdmin) {
    return (
      <div className="w-full p-6 bg-muted/10 rounded-lg border border-border/30">
        <p className="text-muted-foreground text-center">
          You don't have permission to view this content.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Current Projects</h2>
      
      {/* Debug info */}
      <div className="mb-4 p-3 bg-muted/20 rounded-md border border-border/30">
        <p className="text-sm text-muted-foreground">Projects count: {projects.length}</p>
        <details className="mt-2">
          <summary className="text-sm cursor-pointer text-primary">Debug API info</summary>
          <div className="mt-2 p-2 bg-muted/30 text-xs rounded overflow-auto max-h-60">
            <p>Supabase Connection: {supabase ? "✅ Available" : "❌ Not available"}</p>
            <button 
              onClick={async () => {
                try {
                  const { data, error } = await supabase.from('projects').select('count');
                  console.log("Count query:", data, error);
                  toast.info(`Count result: ${JSON.stringify(data)}`);
                } catch (e) {
                  console.error("Count error:", e);
                }
              }}
              className="px-2 py-1 bg-primary/20 text-primary rounded text-xs mt-1"
            >
              Test Count Query
            </button>
          </div>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
