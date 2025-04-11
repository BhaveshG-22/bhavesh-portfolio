
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Project, fetchProjects } from "@/services/projectService"; 
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "./ProjectCard";
import DebugPanel from "./DebugPanel";

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
      <DebugPanel projectsCount={projects.length} />
      
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
            <ProjectCard 
              key={project.id} 
              project={project} 
              onProjectDeleted={fetchProjectsList}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
