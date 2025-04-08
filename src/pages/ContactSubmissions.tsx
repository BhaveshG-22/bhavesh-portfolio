
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
import { Loader2, PenSquare, BookOpen } from "lucide-react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger
} from "@/components/ui/sidebar";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_submissions' as any)
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        // Use type assertion to ensure the data is treated as ContactSubmission[]
        setSubmissions(data as unknown as ContactSubmission[]);
      } catch (error: any) {
        toast.error(`Failed to fetch submissions: ${error.message}`);
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions' as any)
        .update({ status } as any)
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
        
        <div className="flex flex-1">
          <AdminSidebar />
          <SidebarInset className="py-6 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
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
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No contact form submissions yet.</p>
                </div>
              ) : (
                <div className="rounded-md border">
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

// Create a reusable AdminSidebar component that can be used across all admin pages
const AdminSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Contact Submissions">
                <a href="/contact-submissions">
                  <Loader2 />
                  <span>Contact Form</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Manage Projects">
                <a href="/secret-project-add">
                  <PenSquare />
                  <span>Projects</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Manage Blog Posts">
                <a href="/secret-blog-add">
                  <BookOpen />
                  <span>Blog Posts</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ContactSubmissions;
