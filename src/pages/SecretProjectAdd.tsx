
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

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  demo: string;
  category: string;
  hidden?: boolean;
  isDefault?: boolean;
};

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
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Load all projects and categories on component mount
  useEffect(() => {
    try {
      // Get default projects from the ProjectsSection component
      const defaultProjects = [
        {
          id: 1,
          title: "E-commerce Platform",
          description: "A full-stack e-commerce application with product listings, cart functionality, user authentication, and payment processing.",
          image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
          tags: ["React", "Node.js", "MongoDB", "Express", "Redux"],
          github: "https://github.com",
          demo: "https://demo.com",
          category: "fullstack",
          isDefault: true,
        },
        {
          id: 2,
          title: "Task Management App",
          description: "A productivity tool for teams to manage projects, tasks, and deadlines with real-time updates.",
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
          tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
          github: "https://github.com",
          demo: "https://demo.com",
          category: "frontend",
          isDefault: true,
        },
        {
          id: 3,
          title: "Real-time Chat Application",
          description: "A messaging platform with real-time communication, user presence, and media sharing capabilities.",
          image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
          tags: ["React", "Socket.io", "Node.js", "MongoDB", "Express"],
          github: "https://github.com",
          demo: "https://demo.com",
          category: "fullstack",
          isDefault: true,
        },
        {
          id: 4,
          title: "Content Management System",
          description: "A customizable CMS for creating and managing digital content with user roles and permissions.",
          image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
          tags: ["React", "GraphQL", "PostgreSQL", "NestJS"],
          github: "https://github.com",
          demo: "https://demo.com",
          category: "fullstack",
          isDefault: true,
        },
      ];
      
      // Try to load saved default projects first to preserve any edits
      const savedDefaultProjects = JSON.parse(localStorage.getItem("defaultProjects") || "null");
      const finalDefaultProjects = savedDefaultProjects || defaultProjects;
      
      // Load custom projects from localStorage
      const customProjects = JSON.parse(localStorage.getItem("customProjects") || "[]");
      
      // Combine all projects
      setAllProjects([...finalDefaultProjects, ...customProjects]);
      
      // Load custom categories if they exist
      const savedCategories = JSON.parse(localStorage.getItem("projectCategories") || "null");
      if (savedCategories) {
        setCategories(savedCategories);
      }
    } catch (error) {
      console.error("Error loading projects or categories:", error);
      toast.error("Failed to load projects or categories");
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
    if (editingProject) {
      setEditingProject((prev) => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get existing projects from local storage or use empty array
      const existingProjects = JSON.parse(
        localStorage.getItem("customProjects") || "[]"
      );
      
      // Create new project with unique ID
      const newProject = {
        ...formData,
        id: Date.now(),
        tags: formData.tags.split(",").map(tag => tag.trim())
      };
      
      // Save updated projects list to local storage
      localStorage.setItem(
        "customProjects",
        JSON.stringify([...existingProjects, newProject])
      );
      
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
      
      // Refresh project list
      const updatedCustomProjects = [...existingProjects, newProject];
      setAllProjects(prev => {
        const defaultProjects = prev.filter(p => p.isDefault);
        return [...defaultProjects, ...updatedCustomProjects];
      });
    } catch (error) {
      toast.error("Failed to add project");
      console.error("Error saving project:", error);
    }
  };

  const handleToggleVisibility = (project: Project) => {
    try {
      if (project.isDefault) {
        // Handle default project visibility toggling
        const defaultProjects = allProjects.filter(p => p.isDefault);
        const updatedDefaultProjects = defaultProjects.map(p => 
          p.id === project.id ? { ...p, hidden: !p.hidden } : p
        );
        
        localStorage.setItem("defaultProjects", JSON.stringify(updatedDefaultProjects));
        
        // Update all projects
        const customProjects = allProjects.filter(p => !p.isDefault);
        setAllProjects([...updatedDefaultProjects, ...customProjects]);
      } else {
        // Handle custom project visibility toggling
        const customProjects = JSON.parse(
          localStorage.getItem("customProjects") || "[]"
        );
        
        const updatedProjects = customProjects.map((p: Project) => 
          p.id === project.id ? { ...p, hidden: !p.hidden } : p
        );
        
        localStorage.setItem("customProjects", JSON.stringify(updatedProjects));
        
        // Update all projects
        const defaultProjects = allProjects.filter(p => p.isDefault);
        setAllProjects([...defaultProjects, ...updatedProjects]);
      }
      
      toast.success(`Project ${project.hidden ? 'shown' : 'hidden'} successfully`);
    } catch (error) {
      toast.error("Failed to update project visibility");
      console.error("Error updating project visibility:", error);
    }
  };

  const handleDeleteProject = (projectId: number) => {
    try {
      const projectToDelete = allProjects.find(p => p.id === projectId);
      
      if (!projectToDelete) {
        toast.error("Project not found");
        return;
      }
      
      if (projectToDelete.isDefault) {
        toast.error("Default projects cannot be deleted");
        return;
      }
      
      // Get existing projects
      const existingProjects = JSON.parse(
        localStorage.getItem("customProjects") || "[]"
      );
      
      // Filter out the deleted project
      const updatedProjects = existingProjects.filter((p: Project) => p.id !== projectId);
      
      // Save to local storage
      localStorage.setItem("customProjects", JSON.stringify(updatedProjects));
      
      // Update state
      setAllProjects(prev => prev.filter(p => p.id !== projectId));
      
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error("Error deleting project:", error);
    }
  };

  const startEditing = (project: Project) => {
    // If project is an array, convert to comma-separated string for editing
    const projectForEditing = {
      ...project,
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags
    };
    setEditingProject(projectForEditing);
  };

  const cancelEditing = () => {
    setEditingProject(null);
  };

  const saveEditedProject = () => {
    if (!editingProject) return;
    
    try {
      // Process the tags
      const processedProject = {
        ...editingProject,
        tags: typeof editingProject.tags === 'string' 
          ? editingProject.tags.split(',').map(tag => tag.trim()) 
          : editingProject.tags
      };
      
      if (editingProject.isDefault) {
        // Update default project
        const defaultProjects = allProjects.filter(p => p.isDefault);
        const updatedDefaultProjects = defaultProjects.map(p => 
          p.id === editingProject.id ? processedProject : p
        );
        
        localStorage.setItem("defaultProjects", JSON.stringify(updatedDefaultProjects));
        
        // Update all projects
        const customProjects = allProjects.filter(p => !p.isDefault);
        setAllProjects([...updatedDefaultProjects, ...customProjects]);
      } else {
        // Update custom project
        const customProjects = JSON.parse(
          localStorage.getItem("customProjects") || "[]"
        );
        
        const updatedProjects = customProjects.map((p: Project) => 
          p.id === editingProject.id ? processedProject : p
        );
        
        localStorage.setItem("customProjects", JSON.stringify(updatedProjects));
        
        // Update all projects
        const defaultProjects = allProjects.filter(p => p.isDefault);
        setAllProjects([...defaultProjects, ...updatedProjects]);
      }
      
      setEditingProject(null);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
      console.error("Error updating project:", error);
    }
  };

  const addCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    if (categories.includes(newCategory.trim().toLowerCase())) {
      toast.error("Category already exists");
      return;
    }
    
    try {
      // Add new category (excluding "all" which is always first)
      const updatedCategories = [...categories];
      if (updatedCategories[0] === "all") {
        // Insert after "all"
        updatedCategories.splice(1, 0, newCategory.trim().toLowerCase());
      } else {
        updatedCategories.unshift(newCategory.trim().toLowerCase());
      }
      
      // Save to local storage
      localStorage.setItem("projectCategories", JSON.stringify(updatedCategories));
      
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
      const updatedCategories = categories.filter(c => c !== category);
      
      // Save to local storage
      localStorage.setItem("projectCategories", JSON.stringify(updatedCategories));
      
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
      localStorage.setItem("projectCategories", JSON.stringify(DEFAULT_CATEGORIES));
      setCategories(DEFAULT_CATEGORIES);
      toast.success("Categories reset to default");
    } catch (error) {
      toast.error("Failed to reset categories");
      console.error("Error resetting categories:", error);
    }
  };

  // Show all projects, both custom and default
  const projectsList = [...allProjects].sort((a, b) => {
    // Sort by default first, then by ID
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return a.id - b.id;
  });

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
                  <Button type="submit" variant="default">
                    Add Project
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
                          {project.isDefault && <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">Default</span>}
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
                          {!project.isDefault && (
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
                        {category !== "all" && (
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
                  onClick={() => navigate("/")}
                >
                  Back to Home
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

export default SecretProjectAdd;

