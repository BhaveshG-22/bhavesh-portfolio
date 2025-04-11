
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchProjects, 
  fetchCategories, 
  deleteProject, 
  updateProject, 
  addProject,
  toggleProjectVisibility,
  type Project 
} from "@/services/projectService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

const EditProjects = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    image: "",
    github: "",
    demo: "",
    category: "",
    tags: [],
  });
  const [newTagInput, setNewTagInput] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch projects
  const { 
    data: projects = [], 
    isLoading: isLoadingProjects,
    isError: isProjectsError,
    error: projectsError
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects
  });

  // Fetch categories
  const { 
    data: categories = [], 
    isLoading: isLoadingCategories 
  } = useQuery({
    queryKey: ["projectCategories"],
    queryFn: fetchCategories
  });

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: (project: Omit<Project, "id" | "created_at" | "updated_at">) => addProject(project),
    onSuccess: () => {
      toast.success("Project added successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to add project: ${error.message}`);
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: ({id, data}: {id: number, data: Partial<Omit<Project, "id" | "created_at" | "updated_at">>}) => 
      updateProject(id, data),
    onSuccess: () => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      resetForm();
      setIsEditDialogOpen(false);
      setEditingProject(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update project: ${error.message}`);
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    }
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: ({id, isHidden}: {id: number, isHidden: boolean}) => 
      toggleProjectVisibility(id, isHidden),
    onSuccess: () => {
      toast.success("Project visibility updated");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  });

  // Filter projects based on active tab
  const filteredProjects = activeTab === "all" 
    ? projects 
    : activeTab === "visible" 
      ? projects.filter(project => !project.hidden)
      : projects.filter(project => project.hidden);

  // Reset form
  const resetForm = () => {
    setProjectFormData({
      title: "",
      description: "",
      image: "",
      github: "",
      demo: "",
      category: "",
      tags: [],
    });
    setNewTagInput("");
  };

  // Set form data for editing
  const startEditing = (project: Project) => {
    setEditingProject(project);
    setProjectFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      github: project.github,
      demo: project.demo,
      category: project.category,
      tags: [...project.tags],
    });
    setIsEditDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectFormData({
      ...projectFormData,
      [e.target.name]: e.target.value
    });
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setProjectFormData({
      ...projectFormData,
      category: value
    });
  };

  // Add tag to project
  const addTag = () => {
    if (newTagInput.trim() && !projectFormData.tags?.includes(newTagInput.trim())) {
      setProjectFormData({
        ...projectFormData,
        tags: [...(projectFormData.tags || []), newTagInput.trim()]
      });
      setNewTagInput("");
    }
  };

  // Remove tag from project
  const removeTag = (tag: string) => {
    setProjectFormData({
      ...projectFormData,
      tags: projectFormData.tags?.filter(t => t !== tag) || []
    });
  };

  // Submit add project form
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectFormData.title || !projectFormData.description || !projectFormData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    addProjectMutation.mutate({
      title: projectFormData.title!,
      description: projectFormData.description!,
      image: projectFormData.image || "/placeholder.svg",
      github: projectFormData.github || "#",
      demo: projectFormData.demo || "#",
      category: projectFormData.category!,
      tags: projectFormData.tags || [],
    });
  };

  // Submit edit project form
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    
    if (!projectFormData.title || !projectFormData.description || !projectFormData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    updateProjectMutation.mutate({
      id: editingProject.id,
      data: {
        title: projectFormData.title,
        description: projectFormData.description,
        image: projectFormData.image,
        github: projectFormData.github,
        demo: projectFormData.demo,
        category: projectFormData.category,
        tags: projectFormData.tags,
      }
    });
  };

  // Handle toggle visibility
  const handleToggleVisibility = (project: Project) => {
    toggleVisibilityMutation.mutate({
      id: project.id,
      isHidden: project.hidden || false
    });
  };

  // Handle delete project
  const handleDelete = (id: number) => {
    deleteProjectMutation.mutate(id);
  };

  if (isProjectsError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-container">
            <div className="bg-destructive/10 border border-destructive p-4 rounded-lg">
              <p className="text-destructive">
                Error loading projects: {projectsError instanceof Error ? projectsError.message : 'Unknown error'}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-container px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">Project Management</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Add New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input 
                        id="title" 
                        name="title"
                        value={projectFormData.title || ""} 
                        onChange={handleInputChange} 
                        placeholder="Project title" 
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea 
                        id="description" 
                        name="description"
                        value={projectFormData.description || ""}
                        onChange={handleInputChange}
                        placeholder="Project description"
                        rows={5}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="github">GitHub URL</Label>
                        <Input 
                          id="github" 
                          name="github"
                          value={projectFormData.github || ""}
                          onChange={handleInputChange}
                          placeholder="https://github.com/yourusername/repo"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="demo">Demo URL</Label>
                        <Input 
                          id="demo" 
                          name="demo"
                          value={projectFormData.demo || ""}
                          onChange={handleInputChange}
                          placeholder="https://your-demo-url.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input 
                          id="image" 
                          name="image"
                          value={projectFormData.image || ""}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select 
                          value={projectFormData.category} 
                          onValueChange={handleCategoryChange}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="newTag"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          placeholder="Add a tag"
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="secondary" 
                          onClick={addTag}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {projectFormData.tags?.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <button 
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 text-xs rounded-full hover:bg-destructive/10 p-0.5"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        resetForm();
                        setIsAddDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={addProjectMutation.isPending}
                    >
                      {addProjectMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Project"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="mb-8"
          >
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="visible">Visible</TabsTrigger>
              <TabsTrigger value="hidden">Hidden</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-5 bg-muted rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-muted rounded mb-2 w-full"></div>
                    <div className="h-4 bg-muted rounded mb-2 w-full"></div>
                    <div className="h-4 bg-muted rounded mb-4 w-2/3"></div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-9 bg-muted rounded w-24"></div>
                      <div className="h-9 bg-muted rounded w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="aspect-video relative w-full overflow-hidden bg-muted">
                      <img 
                        src={project.image || "/placeholder.svg"} 
                        alt={project.title}
                        className="object-cover w-full h-full"
                      />
                      <Badge 
                        className="absolute top-2 right-2"
                        variant={project.hidden ? "destructive" : "secondary"}
                      >
                        {project.hidden ? "Hidden" : "Visible"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                      {project.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags && project.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tags.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleToggleVisibility(project)}
                    >
                      {project.hidden ? (
                        <>
                          <Eye className="h-3.5 w-3.5" /> Show
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5" /> Hide
                        </>
                      )}
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => startEditing(project)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{project.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(project.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No projects found.</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(true)}
                className="mt-4"
              >
                Add your first project
              </Button>
            </div>
          )}

          {/* Edit Project Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-title">Title *</Label>
                    <Input 
                      id="edit-title" 
                      name="title"
                      value={projectFormData.title || ""} 
                      onChange={handleInputChange} 
                      placeholder="Project title" 
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description *</Label>
                    <Textarea 
                      id="edit-description" 
                      name="description"
                      value={projectFormData.description || ""}
                      onChange={handleInputChange}
                      placeholder="Project description"
                      rows={5}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-github">GitHub URL</Label>
                      <Input 
                        id="edit-github" 
                        name="github"
                        value={projectFormData.github || ""}
                        onChange={handleInputChange}
                        placeholder="https://github.com/yourusername/repo"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-demo">Demo URL</Label>
                      <Input 
                        id="edit-demo" 
                        name="demo"
                        value={projectFormData.demo || ""}
                        onChange={handleInputChange}
                        placeholder="https://your-demo-url.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-image">Image URL</Label>
                      <Input 
                        id="edit-image" 
                        name="image"
                        value={projectFormData.image || ""}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-category">Category *</Label>
                      <Select 
                        value={projectFormData.category} 
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger id="edit-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="edit-newTag"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        placeholder="Add a tag"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={addTag}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {projectFormData.tags?.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <button 
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-xs rounded-full hover:bg-destructive/10 p-0.5"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setIsEditDialogOpen(false);
                      setEditingProject(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={updateProjectMutation.isPending}
                  >
                    {updateProjectMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Project"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProjects;
