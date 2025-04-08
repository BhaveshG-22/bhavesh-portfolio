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

type BlogPost = {
  id?: string;
  title: string;
  content: string;
  category: string;
  created_at?: string;
};

const SecretBlogAdd = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts' as any)
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBlogPosts(data as unknown as BlogPost[]);
      } catch (error: any) {
        toast.error(`Failed to fetch blog posts: ${error.message}`);
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('blog_posts' as any)
        .insert({ title, content, category });

      if (error) throw error;

      toast.success("Blog post created successfully!");
      setTitle("");
      setContent("");
      setCategory("");

      // Refresh blog posts
      const { data } = await supabase
        .from('blog_posts' as any)
        .select("*")
        .order("created_at", { ascending: false });
      
      setBlogPosts(data as unknown as BlogPost[]);
    } catch (error: any) {
      toast.error(`Failed to create blog post: ${error.message}`);
      console.error("Error creating blog post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const { error } = await supabase
          .from('blog_posts' as any)
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast.success("Blog post deleted successfully!");

        // Refresh blog posts
        const { data } = await supabase
          .from('blog_posts' as any)
          .select("*")
          .order("created_at", { ascending: false });
        
        setBlogPosts(data as unknown as BlogPost[]);
      } catch (error: any) {
        toast.error(`Failed to delete blog post: ${error.message}`);
        console.error("Error deleting blog post:", error);
      }
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
                <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
                <SidebarTrigger />
              </div>
              <Separator className="mb-8" />
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Blog Post"
                  )}
                </Button>
              </form>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">Existing Blog Posts</h2>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading blog posts...</span>
                </div>
              ) : blogPosts.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No blog posts yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-md">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      <p className="text-muted-foreground">Category: {post.category}</p>
                      <div className="flex justify-end mt-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(post.id as string)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
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

export default SecretBlogAdd;
