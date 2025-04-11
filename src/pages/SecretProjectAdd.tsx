
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectForm from "@/components/admin/ProjectForm";
import ProjectsList from "@/components/admin/ProjectsList";
import { AdminLayout } from "@/components/AdminLayout";
import { useEffect } from "react";
import { toast } from "sonner";
import { fetchProjects } from "@/services/projectService";

const SecretProjectAdd = () => {
  const { isAdmin } = useAuth();

  const handleProjectAdded = async (): Promise<void> => {
    return Promise.resolve();
  };

  useEffect(() => {
    // Test direct project fetch on component mount
    const testFetch = async () => {
      try {
        const projects = await fetchProjects();
        console.log("SecretProjectAdd direct fetch test:", projects);
      } catch (error) {
        console.error("SecretProjectAdd fetch test error:", error);
      }
    };
    
    testFetch();
  }, []);

  if (!isAdmin) {
    return <div className="flex items-center justify-center h-screen bg-background text-foreground">Access Denied</div>;
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-background text-foreground">
      <Header activeSection="admin" />
      <AdminLayout>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">Manage Projects</h1>
          </div>
          <Separator className="mb-8" />
          
          <div className="grid gap-8">
            <div className="bg-card rounded-lg border border-border/60 p-6 shadow-md">
              <ProjectForm onProjectAdded={handleProjectAdded} />
            </div>
            <Separator />
            <ProjectsList />
          </div>
        </div>
      </AdminLayout>
      <Footer />
    </div>
  );
};

export default SecretProjectAdd;
