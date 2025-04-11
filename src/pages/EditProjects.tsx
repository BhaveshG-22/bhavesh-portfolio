
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchProjects, 
  fetchCategories, 
  deleteProject, 
  toggleProjectVisibility,
  type Project 
} from "@/services/projectService";
import { isProjectImage } from "@/services/projectImageService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectForm from "@/components/admin/ProjectForm";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

const EditProjects = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const queryClient = useQueryClient();

  // Fetch projects
  const { 
    data: projects = [], 
    isLoading: isLoadingProjects,
    isError: isProjectsError,
    error: projectsError,
    refetch: refetchProjects
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects
  });

  // Fetch categories (needed for filtering)
  useQuery({
    queryKey: ["projectCategories"],
    queryFn: fetchCategories
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

  // Start editing a project
  const startEditing = (project: Project) => {
    setEditingProject(project);
    setIsEditDialogOpen(true);
  };

  // Handle project refresh after add/edit
  const handleProjectChange = async () => {
    return refetchProjects();
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
              <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4" /> Add New Project
              </Button>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <ProjectForm 
                  onProjectAdded={handleProjectChange} 
                  mode="add"
                />
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
          <Dialog 
            open={isEditDialogOpen} 
            onOpenChange={(open) => {
              setIsEditDialogOpen(open);
              if (!open) setEditingProject(null);
            }}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <ProjectForm 
                onProjectAdded={handleProjectChange}
                project={editingProject}
                mode="edit"
              />
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProjects;
