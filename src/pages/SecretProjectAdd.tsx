
import { useAuth } from "@/contexts/AuthContext";
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

const SecretProjectAdd = () => {
  const { isAdmin } = useAuth();

  // Fix: Change the function to return a Promise<void>
  const handleProjectAdded = async (): Promise<void> => {
    // This is just a placeholder function that returns a resolved promise
    return Promise.resolve();
  };

  if (!isAdmin) {
    return <div className="flex items-center justify-center h-screen bg-background text-foreground">Access Denied</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background text-foreground">
        <Header activeSection="admin" />
        
        <div className="flex flex-1 pt-16"> {/* Add pt-16 to move content below navbar */}
          <AdminSidebar />
          <SidebarInset className="py-8 px-4 md:px-8 w-full overflow-y-auto">
            <div className="max-w-5xl mx-auto"> {/* Increased max-width */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-foreground">Manage Projects</h1>
                <SidebarTrigger />
              </div>
              <Separator className="mb-8" />
              
              <div className="grid gap-8">
                <div className="bg-card rounded-lg border border-border/60 p-6 shadow-md"> {/* Enhanced card styling */}
                  <ProjectForm onProjectAdded={handleProjectAdded} />
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
