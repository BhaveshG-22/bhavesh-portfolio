
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import ProjectForm from "@/components/admin/ProjectForm";
import ProjectsList from "@/components/admin/ProjectsList";
import { Project } from "@/types/project";

const SecretProjectAdd = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  
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

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Header activeSection="admin" />
        
        <div className="flex flex-1 pt-16"> {/* Add pt-16 to move content below navbar */}
          <AdminSidebar />
          <SidebarInset className="py-8 px-4 md:px-8 w-full overflow-y-auto">
            <div className="max-w-4xl mx-auto"> {/* Increased max-width */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Manage Projects</h1>
                <SidebarTrigger />
              </div>
              <Separator className="mb-8" />
              
              <div className="grid gap-8">
                <div className="bg-card rounded-lg border p-6 shadow-sm"> {/* Added card styling */}
                  <ProjectForm onProjectAdded={fetchProjects} />
                </div>
                <Separator />
                <ProjectsList />
              </div>
            </div>
          </SidebarInset>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default SecretProjectAdd;
