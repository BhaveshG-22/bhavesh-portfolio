
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  fetchBlogPosts, 
  fetchCategories, 
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,
  toggleBlogVisibility,
  addCategory,
  deleteCategory,
  resetCategories,
  type BlogPost
} from "@/services/blogService";

// For editing purposes, we need a separate type
type BlogEditForm = BlogPost;

const SecretBlogAdd = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    category: "React",
    image: "",
    read_time: "5 min read"
  });
  
  const [newCategory, setNewCategory] = useState("");
  const [editingBlog, setEditingBlog] = useState<BlogEditForm | null>(null);

  // Fetch blog posts using React Query
  const { 
    data: allBlogPosts = [],
    isLoading: isLoadingPosts,
    isError: isPostsError 
  } = useQuery({
    queryKey: ["allBlogPosts"],
    queryFn: fetchBlogPosts
  });
  
  // Fetch categories using React Query
  const { 
    data: categories = ["All"],
    isLoading: isLoadingCategories,
    isError: isCategoriesError 
  } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: fetchCategories
  });

  // Show toast error if data fetch fails
  useEffect(() => {
    if (isPostsError) {
      toast.error("Failed to load blog posts");
    }
    if (isCategoriesError) {
      toast.error("Failed to load categories");
    }
  }, [isPostsError, isCategoriesError]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Add new blog post to Supabase
      await addBlogPost(formData);
      
      toast.success("Blog post added successfully!");
      
      // Invalidate cache to refresh blog posts list
      queryClient.invalidateQueries({ queryKey: ["allBlogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      
      // Reset the form
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        category: "React",
        image: "",
        read_time: "5 min read"
      });
    } catch (error) {
      toast.error("Failed to add blog post");
      console.error("Error saving blog post:", error);
    }
  };

  const handleToggleVisibility = async (blog: BlogPost) => {
    try {
      await toggleBlogVisibility(blog.id, blog.hidden || false);
      
      // Invalidate cache to refresh blog posts list
      queryClient.invalidateQueries({ queryKey: ["allBlogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      
      toast.success(`Blog post ${blog.hidden ? 'shown' : 'hidden'} successfully`);
    } catch (error) {
      toast.error("Failed to update blog post visibility");
      console.error("Error updating blog post visibility:", error);
    }
  };

  const handleDeleteBlog = async (blogId: number) => {
    try {
      const blogToDelete = allBlogPosts.find(p => p.id === blogId);
      
      if (!blogToDelete) {
        toast.error("Blog post not found");
        return;
      }
      
      if (blogToDelete.is_default) {
        toast.error("Default blog posts cannot be deleted");
        return;
      }
      
      await deleteBlogPost(blogId);
      
      // Invalidate cache to refresh blog posts list
      queryClient.invalidateQueries({ queryKey: ["allBlogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      
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

  const saveEditedBlog = async () => {
    if (!editingBlog) return;
    
    try {
      const { id, ...updates } = editingBlog;
      await updateBlogPost(id, updates);
      
      // Invalidate cache to refresh blog posts list
      queryClient.invalidateQueries({ queryKey: ["allBlogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      
      setEditingBlog(null);
      toast.success("Blog post updated successfully");
    } catch (error) {
      toast.error("Failed to update blog post");
      console.error("Error updating blog post:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    // Check case insensitively for duplicates
    if (categories.some(cat => cat.toLowerCase() === newCategory.trim().toLowerCase())) {
      toast.error("Category already exists");
      return;
    }
    
    try {
      await addCategory(newCategory.trim());
      
      // Invalidate cache to refresh categories list
      queryClient.invalidateQueries({ queryKey: ["blogCategories"] });
      
      setNewCategory("");
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Failed to add category");
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (category: string) => {
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
      await deleteCategory(category);
      
      // Invalidate cache to refresh categories list
      queryClient.invalidateQueries({ queryKey: ["blogCategories"] });
      
      toast.success(`Category "${category}" deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete category");
      console.error("Error deleting category:", error);
    }
  };

  const handleResetCategories = async () => {
    try {
      await resetCategories();
      
      // Invalidate cache to refresh categories list
      queryClient.invalidateQueries({ queryKey: ["blogCategories"] });
      
      toast.success("Categories reset to default");
    } catch (error) {
      toast.error("Failed to reset categories");
      console.error("Error resetting categories:", error);
    }
  };

  // Show all blog posts, both custom and default
  const blogPostsList = isLoadingPosts ? [] : [...allBlogPosts].sort((a, b) => {
    // Sort by default first, then by ID
    if (a.is_default && !b.is_default) return -1;
    if (!a.is_default && b.is_default) return 1;
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
                    <label htmlFor="read_time" className="block text-sm font-medium mb-1">
                      Read Time
                    </label>
                    <Input
                      id="read_time"
                      name="read_time"
                      value={formData.read_time}
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
              {isLoadingPosts ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-4 border border-gray-700 rounded-lg animate-pulse">
                      <div className="flex justify-between">
                        <div className="h-5 bg-gray-700 rounded w-1/3"></div>
                        <div className="flex gap-2">
                          {[1, 2, 3].map(j => (
                            <div key={j} className="h-8 w-8 bg-gray-700 rounded"></div>
                          ))}
                        </div>
                      </div>
                      <div className="h-4 bg-gray-700 rounded w-4/5 mt-2"></div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                        <div className="h-6 bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : blogPostsList.length === 0 ? (
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
                                name="read_time"
                                value={editingBlog.read_time}
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
                          {blog.is_default && <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">Default</span>}
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
                          {!blog.is_default && (
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
                          {blog.read_time}
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
                  <Button onClick={handleAddCategory}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Current Categories</h3>
                {isLoadingCategories ? (
                  <div className="border border-gray-700 rounded-lg overflow-hidden">
                    <ul className="divide-y divide-gray-700">
                      {[1, 2, 3, 4, 5].map(i => (
                        <li key={i} className="p-3 animate-pulse">
                          <div className="flex items-center justify-between">
                            <div className="h-5 bg-gray-700 rounded w-24"></div>
                            <div className="h-8 w-8 bg-gray-700 rounded"></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="border border-gray-700 rounded-lg overflow-hidden">
                    <ul className="divide-y divide-gray-700">
                      {categories.map((category) => (
                        <li key={category} className="flex items-center justify-between p-3">
                          <span>{category}</span>
                          {category !== "All" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCategory(category)}
                              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
                  onClick={handleResetCategories}
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
