
import { useState } from "react";
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
import { Loader2, ImageIcon } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadProjectImage } from "@/services/projectImageService";

type ProjectFormProps = {
  onProjectAdded: () => Promise<void>;
};

const ProjectForm = ({ onProjectAdded }: ProjectFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = imageUrl;
      
      // If there's a file to upload, upload it first
      if (uploadedFile) {
        try {
          finalImageUrl = await uploadProjectImage(uploadedFile);
        } catch (uploadError: any) {
          toast.error(`Failed to upload image: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Mapping form fields to match database column names
      const projectData = {
        title,
        description,
        // Map link to demo/github fields based on the database schema
        demo: link,
        github: link,
        image: finalImageUrl,
        category,
        tags: [] // Empty array for tags as required by schema
      };

      const { error } = await supabase
        .from('projects')
        .insert([projectData]);

      if (error) throw error;

      toast.success("Project added successfully!");
      // Clear form fields
      setTitle("");
      setDescription("");
      setLink("");
      setImageUrl("");
      setCategory("");
      setUploadedFile(null);

      // Refresh projects list
      await onProjectAdded();
    } catch (error: any) {
      toast.error(`Failed to add project: ${error.message}`);
      console.error("Error adding project:", error);
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

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Add New Project</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="link">Link</Label>
          <Input
            id="link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
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
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={setCategory} defaultValue={category}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="fullstack">Fullstack</SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Machine Learning">Machine Learning</SelectItem>
            </SelectContent>
          </Select>
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
