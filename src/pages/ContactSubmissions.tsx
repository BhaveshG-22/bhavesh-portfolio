
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";

// Define type for contact submission that matches the database schema
type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: string;
};

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        console.log("Fetching contact submissions...");
        const { data, error } = await supabase
          .from('contact_submissions')
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log("Raw response from Supabase:", data);
        
        if (data && Array.isArray(data)) {
          // Properly type the data received from Supabase
          setSubmissions(data as ContactSubmission[]);
          console.log("Submissions set to state:", data.length, "items found");
        } else {
          console.warn("No submissions data or invalid format received:", data);
          setSubmissions([]);
        }
      } catch (error: any) {
        toast.error(`Failed to fetch submissions: ${error.message}`);
        console.error("Error fetching submissions:", error);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
      
      // Update local state to reflect the change
      setSubmissions(submissions.map(sub => 
        sub.id === id ? { ...sub, status } : sub
      ));
      
      toast.success(`Status updated to ${status}`);
    } catch (error: any) {
      toast.error(`Failed to update status: ${error.message}`);
      console.error("Error updating status:", error);
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
            <div className="max-w-5xl mx-auto"> {/* Increased max-width */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Contact Form Submissions</h1>
                <SidebarTrigger />
              </div>
              <Separator className="mb-8" />

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mr-2" />
                  <span>Loading submissions...</span>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <p className="text-muted-foreground">No contact form submissions yet.</p>
                </div>
              ) : (
                <div className="rounded-lg border shadow-sm overflow-hidden bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{submission.name}</TableCell>
                          <TableCell>
                            <a 
                              href={`mailto:${submission.email}`} 
                              className="text-primary hover:underline"
                            >
                              {submission.email}
                            </a>
                          </TableCell>
                          <TableCell>{submission.subject}</TableCell>
                          <TableCell>
                            <Badge variant={
                              submission.status === "completed" ? "default" :
                              submission.status === "in-progress" ? "secondary" : "outline"
                            }>
                              {submission.status || "new"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => updateStatus(submission.id, "in-progress")}
                                disabled={submission.status === "in-progress"}
                              >
                                Mark In Progress
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm" 
                                onClick={() => updateStatus(submission.id, "completed")}
                                disabled={submission.status === "completed"}
                              >
                                Mark Completed
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
