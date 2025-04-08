
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";
import ContactSubmissionTable from "@/components/admin/ContactSubmissionTable";
import EmptySubmissions from "@/components/admin/EmptySubmissions";
import LoadingSubmissions from "@/components/admin/LoadingSubmissions";
import SubmissionError from "@/components/admin/SubmissionError";
import { useContactSubmissions } from "@/hooks/useContactSubmissions";

const ContactSubmissions = () => {
  const { submissions, loading, error, refreshSubmissions, updateStatus } = useContactSubmissions();
  const { isAdmin } = useAuth();

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
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Contact Form Submissions</h1>
                <div className="flex gap-2">
                  <Button onClick={refreshSubmissions} variant="outline" size="sm">
                    Refresh Data
                  </Button>
                  <SidebarTrigger />
                </div>
              </div>
              <Separator className="mb-8" />

              {error && <SubmissionError error={error} />}

              {loading ? (
                <LoadingSubmissions />
              ) : submissions.length === 0 ? (
                <EmptySubmissions onRefresh={refreshSubmissions} />
              ) : (
                <ContactSubmissionTable 
                  submissions={submissions} 
                  onStatusUpdate={updateStatus} 
                />
              )}
            </div>
          </SidebarInset>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default ContactSubmissions;
