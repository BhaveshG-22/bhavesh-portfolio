
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Project, addProject, updateProject } from "@/services/projectService";
import { uploadProjectImage, deleteProjectImage, isProjectImage } from "@/services/projectImageService";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/projectService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { X, Loader2 } from "lucide-react";

// Define the props interface for the ProjectForm component
interface ProjectFormProps {
  project?: Project | null;
  mode?: 'add' | 'edit';
  onProjectAdded: () => Promise<any>; // Accept any Promise return type
}

const ProjectForm = ({ project, mode = 'add', onProjectAdded }: ProjectFormProps) => {
  // State for form fields
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [demo, setDemo] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch available categories
  const { 
    data: categories = [], 
    isLoading: isLoadingCategories 
  } = useQuery({
    queryKey: ["projectCategories"],
    queryFn: fetchCategories
  });

  // Initialize form with project data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setGithub(project.github || "");
      setDemo(project.demo || "");
      setImageUrl(project.image || "");
      setCategory(project.category || "");
      setTags(project.tags || []);
    }
  }, [project, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = imageUrl;
      
      // If there's a file to upload, upload it first
      if (uploadedFile) {
        try {
          finalImageUrl = await uploadProjectImage(uploadedFile);
          console.log("Uploaded image URL:", finalImageUrl);
          
          // If we're editing and replacing an existing image, delete the old one
          if (mode === 'edit' && project && project.image && isProjectImage(project.image)) {
            try {
              await deleteProjectImage(project.image);
              console.log("Deleted old image:", project.image);
            } catch (deleteError: any) {
              console.error("Failed to delete old image:", deleteError);
              // Continue even if old image deletion fails
            }
          }
        } catch (uploadError: any) {
          toast.error(`Failed to upload image: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Validate required fields
      if (!title || !description || !category) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      // Create project object
      const projectData = {
        title,
        description,
        github: github || "#",
        demo: demo || "#",
        image: finalImageUrl || "/placeholder.svg",
        category,
        tags: tags
      };

      console.log(`${mode === 'add' ? 'Adding' : 'Updating'} project data:`, projectData);
      
      if (mode === 'add') {
        // Add new project
        await addProject(projectData);
        toast.success("Project added successfully!");
      } else if (project && project.id) {
        // Update existing project
        console.log(`Updating project ID: ${project.id} with:`, projectData);
        await updateProject(project.id, projectData);
        toast.success("Project updated successfully!");
      }

      // Clear form fields
      setTitle("");
      setDescription("");
      setGithub("");
      setDemo("");
      setImageUrl("");
      setCategory("");
      setTags([]);
      setNewTag("");
      setUploadedFile(null);

      // Refresh projects list
      await onProjectAdded();
    } catch (error: any) {
      console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} project:`, error);
      toast.error(`Failed to ${mode === 'add' ? 'add' : 'update'} project: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelected = (file: File) => {
    setUploadedFile(file);
    // Clear any direct URL since we'll be uploading this file
    setImageUrl("");
  };

  const handleClearFile = () => {
    setUploadedFile(null);
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">
          {mode === 'add' ? 'Add New Project' : 'Edit Project'}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title field */}
        <div className="space-y-2">
          <Label htmlFor="title">Project Title <span className="text-destructive">*</span></Label>
          <Input
            id="title"
            placeholder="Enter project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        {/* Description field */}
        <div className="space-y-2">
          <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
          <Textarea
            id="description"
            placeholder="Enter project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
            required
          />
        </div>
        
        {/* GitHub link field */}
        <div className="space-y-2">
          <Label htmlFor="github">GitHub Repository URL</Label>
          <Input
            id="github"
            placeholder="https://github.com/yourusername/repository"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
        </div>
        
        {/* Demo link field */}
        <div className="space-y-2">
          <Label htmlFor="demo">Demo URL</Label>
          <Input
            id="demo"
            placeholder="https://demo-url.com"
            value={demo}
            onChange={(e) => setDemo(e.target.value)}
          />
        </div>
        
        {/* Image upload */}
        <div className="space-y-2">
          <Label>Project Image</Label>
          <FileUpload
            onFileSelected={handleFileSelected}
            onClear={handleClearFile}
            currentImage={imageUrl}
          />
        </div>
        
        {/* Category select */}
        <div className="space-y-2">
          <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
          <Select 
            value={category} 
            onValueChange={setCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCategories ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </div>
              ) : (
                categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        {/* Tags input */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="new-tag"
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button 
              type="button" 
              onClick={handleAddTag}
              variant="outline"
            >
              Add
            </Button>
          </div>
          
          {/* Display tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {mode === 'add' ? 'Adding Project...' : 'Updating Project...'}
            </>
          ) : (
            <>{mode === 'add' ? 'Add Project' : 'Update Project'}</>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ProjectForm;
