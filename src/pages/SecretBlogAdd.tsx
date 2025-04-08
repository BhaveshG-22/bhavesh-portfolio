
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash, Eye, EyeOff, Plus, X, Edit, Save } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  hidden?: boolean;
  isDefault?: boolean;
};

// For editing purposes, we need a separate type
type BlogEditForm = BlogPost;

// Default categories with preserved casing
const DEFAULT_CATEGORIES = ["All", "React", "TypeScript", "CSS", "UI/UX", "JavaScript"];

const SecretBlogAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    category: "React",
    image: "",
    readTime: "5 min read"
  });
  
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");
  const [editingBlog, setEditingBlog] = useState<BlogEditForm | null>(null);

  // Load all blog posts and categories on component mount
  useEffect(() => {
    try {
      // Get default blog posts from the Blog component
      const defaultBlogPosts = [
        {
          id: 1,
          title: "Getting Started with React",
          excerpt: "Learn the basics of React and how to build your first component.",
          content: "React is a popular JavaScript library for building user interfaces. This guide will walk you through setting up your first React project and creating components.",
          date: "April 2, 2025",
          category: "React",
          image: "/placeholder.svg",
          readTime: "5 min read",
          isDefault: true,
        },
        {
          id: 2,
          title: "Advanced TypeScript Patterns",
          excerpt: "Discover advanced TypeScript patterns to improve your code quality and maintainability.",
          content: "TypeScript offers powerful type features that can greatly enhance your code. This article explores advanced patterns like discriminated unions, utility types, and more.",
          date: "March 28, 2025",
          category: "TypeScript",
          image: "/placeholder.svg",
          readTime: "8 min read",
          isDefault: true,
        },
        {
          id: 3,
          title: "Mastering Tailwind CSS",
          excerpt: "Take your CSS skills to the next level with advanced Tailwind techniques.",
          content: "Tailwind CSS provides a utility-first approach to styling. Learn how to customize your Tailwind setup and create complex layouts efficiently.",
          date: "March 20, 2025",
          category: "CSS",
          image: "/placeholder.svg",
          readTime: "6 min read",
          isDefault: true,
        },
        {
          id: 4,
          title: "Building Responsive UIs",
          excerpt: "Learn how to create responsive user interfaces that work on any device.",
          content: "Responsive design is crucial for modern web applications. This guide covers principles and techniques for creating UIs that adapt to different screen sizes.",
          date: "March 15, 2025",
          category: "UI/UX",
          image: "/placeholder.svg", 
          readTime: "7 min read",
          isDefault: true,
        }
      ];
      
      // Try to load saved default blog posts first to preserve any edits
      const savedDefaultBlogPosts = JSON.parse(localStorage.getItem("defaultBlogPosts") || "null");
      const finalDefaultBlogPosts = savedDefaultBlogPosts || defaultBlogPosts;
      
      // Load custom blog posts from localStorage
      const customBlogPosts = JSON.parse(localStorage.getItem("customBlogPosts") || "[]");
      
      // Combine all blog posts
      setAllBlogPosts([...finalDefaultBlogPosts, ...customBlogPosts]);
      
      // Load custom categories if they exist
      const savedCategories = JSON.parse(localStorage.getItem("blogCategories") || "null");
      if (savedCategories) {
        setCategories(savedCategories);
      }
    } catch (error) {
      console.error("Error loading blog posts or categories:", error);
      toast.error("Failed to load blog posts or categories");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (editingBlog) {
      setEditingBlog((prev) => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get existing blog posts from local storage or use empty array
      const existingBlogPosts = JSON.parse(
        localStorage.getItem("customBlogPosts") || "[]"
      );
      
      // Create new blog post with unique ID
      const newBlogPost = {
        ...formData,
        id: Date.now()
      };
      
      // Save updated blog posts list to local storage
      localStorage.setItem(
        "customBlogPosts",
        JSON.stringify([...existingBlogPosts, newBlogPost])
      );
      
      toast.success("Blog post added successfully!");
      
      // Reset the form
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        category: "React",
        image: "",
        readTime: "5 min read"
      });
      
      // Refresh blog post list
      const updatedCustomBlogPosts = [...existingBlogPosts, newBlogPost];
      setAllBlogPosts(prev => {
        const defaultBlogPosts = prev.filter(p => p.isDefault);
        return [...defaultBlogPosts, ...updatedCustomBlogPosts];
      });
    } catch (error) {
      toast.error("Failed to add blog post");
      console.error("Error saving blog post:", error);
    }
  };

  const handleToggleVisibility = (blog: BlogPost) => {
    try {
      if (blog.isDefault) {
        // Handle default blog post visibility toggling
        const defaultBlogPosts = allBlogPosts.filter(p => p.isDefault);
        const updatedDefaultBlogPosts = defaultBlogPosts.map(p => 
          p.id === blog.id ? { ...p, hidden: !p.hidden } : p
        );
        
        localStorage.setItem("defaultBlogPosts", JSON.stringify(updatedDefaultBlogPosts));
        
        // Update all blog posts
        const customBlogPosts = allBlogPosts.filter(p => !p.isDefault);
        setAllBlogPosts([...updatedDefaultBlogPosts, ...customBlogPosts]);
      } else {
        // Handle custom blog post visibility toggling
        const customBlogPosts = JSON.parse(
          localStorage.getItem("customBlogPosts") || "[]"
        );
        
        const updatedBlogPosts = customBlogPosts.map((p: BlogPost) => 
          p.id === blog.id ? { ...p, hidden: !p.hidden } : p
        );
        
        localStorage.setItem("customBlogPosts", JSON.stringify(updatedBlogPosts));
        
        // Update all blog posts
        const defaultBlogPosts = allBlogPosts.filter(p => p.isDefault);
        setAllBlogPosts([...defaultBlogPosts, ...updatedBlogPosts]);
      }
      
      toast.success(`Blog post ${blog.hidden ? 'shown' : 'hidden'} successfully`);
    } catch (error) {
      toast.error("Failed to update blog post visibility");
      console.error("Error updating blog post visibility:", error);
    }
  };

  const handleDeleteBlog = (blogId: number) => {
    try {
      const blogToDelete = allBlogPosts.find(p => p.id === blogId);
      
      if (!blogToDelete) {
        toast.error("Blog post not found");
        return;
      }
      
      if (blogToDelete.isDefault) {
        toast.error("Default blog posts cannot be deleted");
        return;
      }
      
      // Get existing blog posts
      const existingBlogPosts = JSON.parse(
        localStorage.getItem("customBlogPosts") || "[]"
      );
      
      // Filter out the deleted blog post
      const updatedBlogPosts = existingBlogPosts.filter((p: BlogPost) => p.id !== blogId);
      
      // Save to local storage
      localStorage.setItem("customBlogPosts", JSON.stringify(updatedBlogPosts));
      
      // Update state
      setAllBlogPosts(prev => prev.filter(p => p.id !== blogId));
      
      toast.success("Blog post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete blog post");
      console.error("Error deleting blog post:", error);
    }
  };

  const startEditing = (blog: BlogPost) => {
    setEditingBlog(blog);
  };

  const cancelEditing = () => {
    setEditingBlog(null);
  };

  const saveEditedBlog = () => {
    if (!editingBlog) return;
    
    try {
      if (editingBlog.isDefault) {
        // Update default blog post
        const defaultBlogPosts = allBlogPosts.filter(p => p.isDefault);
        const updatedDefaultBlogPosts = defaultBlogPosts.map(p => 
          p.id === editingBlog.id ? editingBlog : p
        );
        
        localStorage.setItem("defaultBlogPosts", JSON.stringify(updatedDefaultBlogPosts));
        
        // Update all blog posts
        const customBlogPosts = allBlogPosts.filter(p => !p.isDefault);
        setAllBlogPosts([...updatedDefaultBlogPosts, ...customBlogPosts]);
      } else {
        // Update custom blog post
        const customBlogPosts = JSON.parse(
          localStorage.getItem("customBlogPosts") || "[]"
        );
        
        const updatedBlogPosts = customBlogPosts.map((p: BlogPost) => 
          p.id === editingBlog.id ? editingBlog : p
        );
        
        localStorage.setItem("customBlogPosts", JSON.stringify(updatedBlogPosts));
        
        // Update all blog posts
        const defaultBlogPosts = allBlogPosts.filter(p => p.isDefault);
        setAllBlogPosts([...defaultBlogPosts, ...updatedBlogPosts]);
      }
      
      setEditingBlog(null);
      toast.success("Blog post updated successfully");
    } catch (error) {
      toast.error("Failed to update blog post");
      console.error("Error updating blog post:", error);
    }
  };

  // Preserve original case when adding categories
  const addCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    // Check case insensitively for duplicates, but preserve original case for storage
    if (categories.some(cat => cat.toLowerCase() === newCategory.trim().toLowerCase())) {
      toast.error("Category already exists");
      return;
    }
    
    try {
      // Add new category preserving case
      const updatedCategories = [...categories];
      if (updatedCategories[0] === "All") {
        // Insert after "All" while preserving case
        updatedCategories.splice(1, 0, newCategory.trim());
      } else {
        updatedCategories.unshift(newCategory.trim());
      }
      
      // Save to local storage
      localStorage.setItem("blogCategories", JSON.stringify(updatedCategories));
      
      // Update state
      setCategories(updatedCategories);
      setNewCategory("");
      
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Failed to add category");
      console.error("Error adding category:", error);
    }
  };

  const deleteCategory = (category: string) => {
    if (category === "All") {
      toast.error("Cannot delete the 'All' category");
      return;
    }
    
    // Check if any blog posts are using this category
    const blogPostsUsingCategory = allBlogPosts.filter(p => p.category === category);
    if (blogPostsUsingCategory.length > 0) {
      toast.error(`Cannot delete category "${category}" as it's used by ${blogPostsUsingCategory.length} blog post(s)`);
      return;
    }
    
    try {
      const updatedCategories = categories.filter(c => c !== category);
      
      // Save to local storage
      localStorage.setItem("blogCategories", JSON.stringify(updatedCategories));
      
      // Update state
      setCategories(updatedCategories);
      
      toast.success(`Category "${category}" deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete category");
      console.error("Error deleting category:", error);
    }
  };

  const resetCategories = () => {
    try {
      // Reset to default categories
      localStorage.setItem("blogCategories", JSON.stringify(DEFAULT_CATEGORIES));
      setCategories(DEFAULT_CATEGORIES);
      toast.success("Categories reset to default");
    } catch (error) {
      toast.error("Failed to reset categories");
      console.error("Error resetting categories:", error);
    }
  };

  // Show all blog posts, both custom and default
  const blogPostsList = [...allBlogPosts].sort((a, b) => {
    // Sort by default first, then by ID
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return a.id - b.id;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-teal-400">Blog Management</h1>
        
        <Tabs defaultValue="blogs" className="mb-10">
          <TabsList className="mb-6 bg-gray-800">
            <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="blogs" className="grid md:grid-cols-2 gap-10">
            {/* Add Blog Post Form */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-white">Add New Blog Post</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Blog Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
                    Excerpt
                  </label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-700"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-1">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-700"
                    rows={5}
                  />
                </div>
                
                <div>
                  <label htmlFor="image" className="block text-sm font-medium mb-1">
                    Image URL
                  </label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    placeholder="https://images.unsplash.com/..."
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-1">
                      Publish Date
                    </label>
                    <Input
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="readTime" className="block text-sm font-medium mb-1">
                      Read Time
                    </label>
                    <Input
                      id="readTime"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleChange}
                      required
                      placeholder="5 min read"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <Select 
                    name="category" 
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {categories
                        .filter(category => category !== "All")
                        .map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/blog")}
                  >
                    Back to Blog
                  </Button>
                  <Button type="submit" variant="default">
                    Add Blog Post
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Blog Posts List */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-white">Manage All Blog Posts</h2>
              {blogPostsList.length === 0 ? (
                <div className="text-gray-400 text-center py-10 border border-dashed border-gray-700 rounded-lg">
                  No blog posts yet. Add your first one!
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Editing Modal */}
                  {editingBlog && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Edit Blog Post</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <Input
                              name="title"
                              value={editingBlog.title}
                              onChange={handleEditChange}
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Excerpt</label>
                            <Textarea
                              name="excerpt"
                              value={editingBlog.excerpt}
                              onChange={handleEditChange}
                              className="bg-gray-800 border-gray-700"
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Content</label>
                            <Textarea
                              name="content"
                              value={editingBlog.content}
                              onChange={handleEditChange}
                              className="bg-gray-800 border-gray-700"
                              rows={5}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <Input
                              name="image"
                              value={editingBlog.image}
                              onChange={handleEditChange}
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Publish Date</label>
                              <Input
                                name="date"
                                value={editingBlog.date}
                                onChange={handleEditChange}
                                className="bg-gray-800 border-gray-700"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Read Time</label>
                              <Input
                                name="readTime"
                                value={editingBlog.readTime}
                                onChange={handleEditChange}
                                className="bg-gray-800 border-gray-700"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <Select
                              name="category"
                              value={editingBlog.category}
                              onValueChange={(value) => setEditingBlog(prev => prev ? { ...prev, category: value } : null)}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-700">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                {categories
                                  .filter(category => category !== "All")
                                  .map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                          <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
                          <Button onClick={saveEditedBlog}>Save Changes</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {blogPostsList.map((blog) => (
                    <div 
                      key={blog.id} 
                      className={`p-4 border border-gray-700 rounded-lg ${blog.hidden ? 'opacity-60' : ''}`}
                    >
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium">
                          {blog.title}
                          {blog.isDefault && <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">Default</span>}
                        </h3>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => startEditing(blog)}
                            className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                          >
                            <Edit size={18} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleVisibility(blog)}
                          >
                            {blog.hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                          </Button>
                          {!blog.isDefault && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              onClick={() => handleDeleteBlog(blog.id)}
                            >
                              <Trash size={18} />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{blog.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded-full">
                          {blog.category}
                        </span>
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded-full">
                          {blog.readTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                        <span>{blog.date}</span>
                        <span>{blog.hidden ? 'Hidden' : 'Visible'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-white">Manage Categories</h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Add New Category</h3>
                <div className="flex gap-3">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                    className="bg-gray-800 border-gray-700"
                  />
                  <Button onClick={addCategory}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Current Categories</h3>
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <ul className="divide-y divide-gray-700">
                    {categories.map((category) => (
                      <li key={category} className="flex items-center justify-between p-3">
                        <span>{category}</span>
                        {category !== "All" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteCategory(category)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/blog")}
                >
                  Back to Blog
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={resetCategories}
                >
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SecretBlogAdd;
