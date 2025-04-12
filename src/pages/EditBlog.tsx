
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  fetchBlogPosts, 
  fetchCategories, 
  addBlogPost, 
  updateBlogPost, 
  deleteBlogPost,
  toggleBlogVisibility,
  BlogPost
} from '@/services/blogService';
import { useRequireAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Edit, Trash, Plus } from 'lucide-react';

const EditBlog = () => {
  const { toast } = useToast();
  const { isAuthenticated, loading } = useRequireAuth();

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentBlogPost, setCurrentBlogPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [readTime, setReadTime] = useState('');
  const [image, setImage] = useState('');
  const [date, setDate] = useState('');

  // Load blog posts and categories
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [postsData, categoriesData] = await Promise.all([
        fetchBlogPosts(),
        fetchCategories()
      ]);
      
      setBlogPosts(postsData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load blog posts. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const handleToggleVisibility = async (blogPost: BlogPost) => {
    try {
      await toggleBlogVisibility(blogPost.id, !!blogPost.hidden);
      loadData();
      toast({
        title: `Blog post ${blogPost.hidden ? 'published' : 'hidden'}`,
        description: `"${blogPost.title}" is now ${blogPost.hidden ? 'visible' : 'hidden'}`
      });
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast({
        title: "Error",
        description: "Failed to update blog post visibility",
        variant: "destructive"
      });
    }
  };

  const openDeleteDialog = (blogPost: BlogPost) => {
    setCurrentBlogPost(blogPost);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!currentBlogPost) return;
    
    try {
      await deleteBlogPost(currentBlogPost.id);
      loadData();
      toast({
        title: "Blog post deleted",
        description: `"${currentBlogPost.title}" has been deleted`
      });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCurrentBlogPost(null);
    }
  };

  const openFormDialog = (blogPost?: BlogPost) => {
    if (blogPost) {
      setTitle(blogPost.title);
      setExcerpt(blogPost.excerpt);
      setContent(blogPost.content);
      setCategory(blogPost.category);
      setReadTime(blogPost.read_time);
      setImage(blogPost.image);
      setDate(blogPost.date);
      setCurrentBlogPost(blogPost);
      setIsEditing(true);
    } else {
      setTitle('');
      setExcerpt('');
      setContent('');
      setCategory(categories[0] || '');
      setReadTime('');
      setImage('');
      setDate(new Date().toISOString().split('T')[0]);
      setCurrentBlogPost(null);
      setIsEditing(false);
    }
    setIsFormDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const blogPostData = {
      title,
      excerpt,
      content, 
      category,
      read_time: readTime,
      image,
      date
    };
    
    try {
      if (isEditing && currentBlogPost) {
        await updateBlogPost(currentBlogPost.id, blogPostData);
        toast({
          title: "Blog post updated",
          description: `"${title}" has been updated successfully`
        });
      } else {
        await addBlogPost(blogPostData);
        toast({
          title: "Blog post created",
          description: `"${title}" has been created successfully`
        });
      }
      setIsFormDialogOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} blog post`,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>You must be logged in to access this page.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
          <Button onClick={() => openFormDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Blog Post
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-10">Loading blog posts...</div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500 dark:text-gray-400">No blog posts yet.</p>
            <p className="mt-2 text-muted-foreground">Click "Add New Blog Post" to create your first blog post.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.date}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${post.hidden ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                        {post.hidden ? 'Hidden' : 'Published'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleToggleVisibility(post)}
                          title={post.hidden ? 'Publish' : 'Hide'}
                        >
                          {post.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openFormDialog(post)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openDeleteDialog(post)}
                          title="Delete"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Delete confirmation dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{currentBlogPost?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create/Edit form dialog */}
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update your blog post details below.' : 'Fill in the details for your new blog post.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="excerpt" className="text-sm font-medium">Excerpt</label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">Content</label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="min-h-[200px]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="readTime" className="text-sm font-medium">Read Time</label>
                    <Input
                      id="readTime"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      placeholder="e.g. 5 min read"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="image" className="text-sm font-medium">Image URL</label>
                    <Input
                      id="image"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="date" className="text-sm font-medium">Date</label>
                    <Input
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="YYYY-MM-DD"
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update Blog Post' : 'Create Blog Post'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default EditBlog;
