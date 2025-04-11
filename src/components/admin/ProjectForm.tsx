
import { useState } from "react";
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
import { Loader2, ImageIcon } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadProjectImage } from "@/services/projectImageService";
import { addProject } from "@/services/projectService";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/projectService";

type ProjectFormProps = {
  onProjectAdded: () => Promise<void>;
};

const ProjectForm = ({ onProjectAdded }: ProjectFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Fetch available categories
  const { data: categories = [] } = useQuery({
    queryKey: ["projectCategories"],
    queryFn: fetchCategories
  });

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

      console.log("Submitting project data:", projectData);
      
      // Use the addProject function from projectService
      const addedProject = await addProject(projectData);
      console.log("Project added successfully:", addedProject);

      toast.success("Project added successfully!");
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
      console.error("Error adding project:", error);
      toast.error(`Failed to add project: ${error.message}`);
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
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Add New Project</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              type="text"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/username/repo"
            />
          </div>
          <div>
            <Label htmlFor="demo">Demo URL</Label>
            <Input
              id="demo"
              type="text"
              value={demo}
              onChange={(e) => setDemo(e.target.value)}
              placeholder="https://your-demo-url.com"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="image" className="block mb-2">Project Image</Label>
          <FileUpload
            onFileSelected={handleFileSelected}
            onClear={handleClearFile}
            currentImage={imageUrl}
            className="mb-2"
          />
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or enter an image URL"
                disabled={!!uploadedFile}
                className="pl-9"
              />
              <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="newTag"
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
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
              variant="outline" 
              onClick={handleAddTag}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge 
                key={tag}
                variant="secondary" 
                className="flex items-center gap-1"
              >
                {tag}
                <button 
                  type="button" 
                  onClick={() => handleRemoveTag(tag)} 
                  className="ml-1 text-xs rounded-full hover:bg-destructive/10 p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
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
    </div>
  );
};

export default ProjectForm;
