
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash, Eye, EyeOff, Plus, X, Edit, Save, Loader2 } from "lucide-react";
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
import {
  Project,
  fetchProjects,
  fetchCategories,
  addProject,
  updateProject,
  deleteProject,
  toggleProjectVisibility,
  addCategory,
  deleteCategory,
  resetCategories
} from "@/services/projectService";

// For editing purposes, we need a separate type with tags as string
type ProjectEditForm = Omit<Project, 'tags'> & {
  tags: string;
};

// Changed to preserve casing in default categories
const DEFAULT_CATEGORIES = ["all", "frontend", "backend", "fullstack"];

const SecretProjectAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    tags: "",
    github: "",
    demo: "",
    category: "frontend",
  });
  
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");
  const [editingProject, setEditingProject] = useState<ProjectEditForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load all projects and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load projects and categories from Supabase
        const [projectsData, categoriesData] = await Promise.all([
          fetchProjects(),
          fetchCategories()
        ]);
        
        setAllProjects(projectsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading projects or categories:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
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
    if (editingProject) {
      setEditingProject((prev) => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Create new project
      const newProject = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        tags: formData.tags.split(",").map(tag => tag.trim()),
        github: formData.github,
        demo: formData.demo,
        category: formData.category,
        hidden: false,
        is_default: false
      };
      
      // Add project to Supabase
      const addedProject = await addProject(newProject);
      
      toast.success("Project added successfully!");
      
      // Reset the form
      setFormData({
        title: "",
        description: "",
        image: "",
        tags: "",
        github: "",
        demo: "",
        category: "frontend",
      });
      
      // Update state with new project
      setAllProjects(prev => [...prev, addedProject]);
    } catch (error) {
      toast.error("Failed to add project");
      console.error("Error saving project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVisibility = async (project: Project) => {
    try {
      // Toggle project visibility
      const updatedProject = await toggleProjectVisibility(project.id, !!project.hidden);
      
      // Update local state
      setAllProjects(prev => 
        prev.map(p => p.id === project.id ? updatedProject : p)
      );
      
      toast.success(`Project ${project.hidden ? 'shown' : 'hidden'} successfully`);
    } catch (error) {
      toast.error("Failed to update project visibility");
      console.error("Error updating project visibility:", error);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      const projectToDelete = allProjects.find(p => p.id === projectId);
      
      if (!projectToDelete) {
        toast.error("Project not found");
        return;
      }
      
      if (projectToDelete.is_default) {
        toast.error("Default projects cannot be deleted");
        return;
      }
      
      // Delete project from Supabase
      await deleteProject(projectId);
      
      // Update local state
      setAllProjects(prev => prev.filter(p => p.id !== projectId));
      
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error("Error deleting project:", error);
    }
  };

  const startEditing = (project: Project) => {
    // Convert tags array to string for editing
    const projectForEditing: ProjectEditForm = {
      ...project,
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags
    };
    setEditingProject(projectForEditing);
  };

  const cancelEditing = () => {
    setEditingProject(null);
  };

  const saveEditedProject = async () => {
    if (!editingProject) return;
    
    try {
      // Process the tags - ensure they're converted to array format
      const tagsArray = typeof editingProject.tags === 'string' 
        ? editingProject.tags.split(',').map(tag => tag.trim()) 
        : editingProject.tags;
        
      // Update project in Supabase
      const updatedProject = await updateProject(editingProject.id, {
        title: editingProject.title,
        description: editingProject.description,
        image: editingProject.image,
        tags: tagsArray,
        github: editingProject.github,
        demo: editingProject.demo,
        category: editingProject.category,
      });
      
      // Update local state
      setAllProjects(prev => 
        prev.map(p => p.id === editingProject.id ? updatedProject : p)
      );
      
      setEditingProject(null);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
      console.error("Error updating project:", error);
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
      // Add new category to Supabase
      await addCategory(newCategory.trim());
      
      // Refresh categories
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
      
      setNewCategory("");
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Failed to add category");
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (category === "all") {
      toast.error("Cannot delete the 'all' category");
      return;
    }
    
    // Check if any projects are using this category
    const projectsUsingCategory = allProjects.filter(p => p.category === category);
    if (projectsUsingCategory.length > 0) {
      toast.error(`Cannot delete category "${category}" as it's used by ${projectsUsingCategory.length} project(s)`);
      return;
    }
    
    try {
      // Delete category from Supabase
      await deleteCategory(category);
      
      // Refresh categories
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
      
      toast.success(`Category "${category}" deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete category");
      console.error("Error deleting category:", error);
    }
  };

  const handleResetCategories = async () => {
    try {
      // Reset to default categories in Supabase
      const resetCategoriesList = await resetCategories();
      setCategories(resetCategoriesList);
      
      toast.success("Categories reset to default");
    } catch (error) {
      toast.error("Failed to reset categories");
      console.error("Error resetting categories:", error);
    }
  };

  // Show all projects, both custom and default
  const projectsList = [...allProjects].sort((a, b) => {
    // Sort by default first, then by ID
    if (a.is_default && !b.is_default) return -1;
    if (!a.is_default && b.is_default) return 1;
    return a.id - b.id;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white py-20 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <p className="text-teal-400">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-teal-400">Project Management</h1>
        
        <Tabs defaultValue="projects" className="mb-10">
          <TabsList className="mb-6 bg-gray-800">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="grid md:grid-cols-2 gap-10">
            {/* Add Project Form */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-white">Add New Project</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Project Title
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
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-700"
                    rows={3}
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
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium mb-1">
                    Tags (comma separated)
                  </label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    required
                    placeholder="React, TypeScript, Tailwind"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div>
                  <label htmlFor="github" className="block text-sm font-medium mb-1">
                    GitHub URL
                  </label>
                  <Input
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    required
                    placeholder="https://github.com/..."
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div>
                  <label htmlFor="demo" className="block text-sm font-medium mb-1">
                    Demo URL
                  </label>
                  <Input
                    id="demo"
                    name="demo"
                    value={formData.demo}
                    onChange={handleChange}
                    required
                    placeholder="https://demo.com/..."
                    className="bg-gray-800 border-gray-700"
                  />
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
                        .filter(category => category !== "all")
                        .map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/")}
                  >
                    Back to Home
                  </Button>
                  <Button 
                    type="submit" 
                    variant="default"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : "Add Project"}
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Projects List */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-white">Manage All Projects</h2>
              {projectsList.length === 0 ? (
                <div className="text-gray-400 text-center py-10 border border-dashed border-gray-700 rounded-lg">
                  No projects yet. Add your first one!
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Editing Modal */}
                  {editingProject && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Edit Project</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <Input
                              name="title"
                              value={editingProject.title}
                              onChange={handleEditChange}
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Textarea
                              name="description"
                              value={editingProject.description}
                              onChange={handleEditChange}
                              className="bg-gray-800 border-gray-700"
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <Input
                              name="image"
                              value={editingProject.image}
                              onChange={handleEditChange}
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Tags</label>
                            <Input
                              name="tags"
                              value={typeof editingProject.tags === 'string' 
                                ? editingProject.tags 
                                : editingProject.tags.join(", ")}
                              onChange={handleEditChange}
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">GitHub URL</label>
                            <Input
                              name="github"
                              value={editingProject.github}
                              onChange={handleEditChange}
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Demo URL</label>
                            <Input
                              name="demo"
                              value={editingProject.demo}
                              onChange={handleEditChange}
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <Select
                              name="category"
                              value={editingProject.category}
                              onValueChange={(value) => setEditingProject(prev => prev ? { ...prev, category: value } : null)}
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-700">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700">
                                {categories
                                  .filter(category => category !== "all")
                                  .map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                          <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
                          <Button onClick={saveEditedProject}>Save Changes</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {projectsList.map((project) => (
                    <div 
                      key={project.id} 
                      className={`p-4 border border-gray-700 rounded-lg ${project.hidden ? 'opacity-60' : ''}`}
                    >
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium">
                          {project.title}
                          {project.is_default && <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">Default</span>}
                        </h3>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => startEditing(project)}
                            className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                          >
                            <Edit size={18} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleVisibility(project)}
                          >
                            {project.hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                          </Button>
                          {!project.is_default && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash size={18} />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Array.isArray(project.tags) && project.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index} 
                            className="text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {Array.isArray(project.tags) && project.tags.length > 3 && (
                          <span className="text-xs text-gray-400">+{project.tags.length - 3} more</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                        <span>{project.category}</span>
                        <span>{project.hidden ? 'Hidden' : 'Visible'}</span>
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
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <ul className="divide-y divide-gray-700">
                    {categories.map((category) => (
                      <li key={category} className="flex items-center justify-between p-3">
                        <span>{category}</span>
                        {category !== "all" && (
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
              </div>
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")}
                >
                  Back to Home
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

export default SecretProjectAdd;
