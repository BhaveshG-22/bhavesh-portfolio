
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Project } from "@/types/project";

const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects' as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Safely convert to Project[] type using type assertion
      setProjects((data || []) as unknown as Project[]);
    } catch (error: any) {
      toast.error(`Failed to fetch projects: ${error.message}`);
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Current Projects</h2>
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading projects...</span>
        </div>
      ) : projects.length === 0 ? (
        <p className="text-muted-foreground">No projects added yet.</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project.id} className="rounded-md border p-4">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-muted-foreground">{project.description}</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Visit Project
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
