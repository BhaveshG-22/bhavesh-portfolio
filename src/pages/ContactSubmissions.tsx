
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
import { Loader2, AlertCircle } from "lucide-react";
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching contact submissions...");
        
        // Using .from('contact_submissions') with explicit typing
        const { data, error } = await supabase
          .from('contact_submissions')
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          setError(`Database error: ${error.message}`);
          throw error;
        }
        
        console.log("Raw response from Supabase:", data);
        
        if (data && Array.isArray(data)) {
          // Check if data is actually empty
          if (data.length === 0) {
            console.log("No submissions found in database");
          }
          
          // Explicitly cast with type assertion
          setSubmissions(data as ContactSubmission[]);
          console.log("Submissions set to state:", data.length, "items found");
          
          // Log first item for debugging if available
          if (data.length > 0) {
            console.log("Sample submission:", JSON.stringify(data[0]));
          }
        } else {
          console.warn("No submissions data or invalid format received:", data);
          setError("Received invalid data format from database");
          setSubmissions([]);
        }
      } catch (error: any) {
        const errorMsg = `Failed to fetch submissions: ${error.message}`;
        console.error(errorMsg, error);
        setError(errorMsg);
        toast.error(errorMsg);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Debugging helper to manually refresh data
  const refreshSubmissions = () => {
    console.log("Manual refresh triggered");
    setLoading(true);
    setError(null);
    // Re-fetch data by triggering effect
    setSubmissions([]);
    
    setTimeout(() => {
      const fetchSubmissions = async () => {
        try {
          console.log("Manual refresh: Fetching submissions...");
          const { data, error } = await supabase
            .from('contact_submissions')
            .select("*")
            .order("created_at", { ascending: false });
  
          if (error) {
            console.error("Manual refresh error:", error);
            setError(`Database error during refresh: ${error.message}`);
            throw error;
          }
          
          console.log("Manual refresh received:", data);
          if (data) {
            setSubmissions(data as ContactSubmission[]);
            toast.success(`Refreshed: Found ${data.length} submissions`);
          }
        } catch (error: any) {
          const errorMsg = `Refresh failed: ${error.message}`;
          console.error("Manual refresh failed:", error);
          setError(errorMsg);
          toast.error(errorMsg);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSubmissions();
    }, 500);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq("id", id);
      
      if (error) {
        console.error("Status update error:", error);
        throw error;
      }
      
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
                <div className="flex gap-2">
                  <Button onClick={refreshSubmissions} variant="outline" size="sm">
                    Refresh Data
                  </Button>
                  <SidebarTrigger />
                </div>
              </div>
              <Separator className="mb-8" />

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error}. Please try refreshing the data or check your database connection.
                  </AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mr-2" />
                  <span>Loading submissions...</span>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <p className="text-muted-foreground">No contact form submissions found.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    If you've submitted forms, there might be a connection issue or permissions problem.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <Button onClick={refreshSubmissions} variant="outline" size="sm">
                      Try Refreshing
                    </Button>
                    <Button 
                      onClick={() => toast.info("Checking permissions status...")}
                      variant="secondary" 
                      size="sm"
                    >
                      Check Permissions
                    </Button>
                  </div>
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
