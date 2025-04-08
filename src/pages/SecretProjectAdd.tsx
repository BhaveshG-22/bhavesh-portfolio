import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarTrigger 
} from "@/components/ui/sidebar";

type Project = {
  id?: string;
  title: string;
  description: string;
  link: string;
  image_url: string;
  category: string;
  created_at?: string;
};

const SecretProjectAdd = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
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

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('projects' as any)
        .insert([{ title, description, link, image_url: imageUrl, category }]);

      if (error) throw error;

      toast.success("Project added successfully!");
      // Clear form fields
      setTitle("");
      setDescription("");
      setLink("");
      setImageUrl("");
      setCategory("");

      // Refresh projects
      fetchProjects();
    } catch (error: any) {
      toast.error(`Failed to add project: ${error.message}`);
      console.error("Error adding project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        <div className="flex flex-1">
          <AdminSidebar />
          <SidebarInset className="py-6 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Manage Projects</h1>
                <SidebarTrigger />
              </div>
              <Separator className="mb-8" />
              
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Add New Project</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="link">Link</Label>
                    <Input
                      id="link"
                      type="text"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={setCategory} defaultValue={category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Project"
                    )}
                  </Button>
                </form>
                <Separator />
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
