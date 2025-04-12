
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Github, ExternalLink, X } from 'lucide-react';

interface ProjectFormProps {
  project?: Partial<Project>;
  onSubmit: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isLoading: boolean;
}

const ProjectForm = ({ project, onSubmit, isLoading }: ProjectFormProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [imageUrl, setImageUrl] = useState(project?.image || '');
  const [githubUrl, setGithubUrl] = useState(project?.github || '');
  const [liveUrl, setLiveUrl] = useState(project?.demo || '');
  const [featured, setFeatured] = useState(project?.is_default || false);
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(project?.tags || []);
  const [category, setCategory] = useState(project?.category || 'Other');

  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      title,
      description,
      tech_stack: techStack,
      image: imageUrl || '',
      github: githubUrl || '',
      demo: liveUrl || '',
      is_default: featured,
      hidden: false,
      category: category,
      tags: techStack
    };
    
    await onSubmit(projectData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Project Title*</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="My Awesome Project"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description*</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe your project..."
            className="mt-1 min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Web Development, Mobile App, etc."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="mt-1"
          />
          {imageUrl && (
            <div className="mt-2 max-w-xs">
              <img 
                src={imageUrl} 
                alt="Project preview" 
                className="rounded-md border object-cover h-32 w-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <div className="flex mt-1">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
              <Github size={16} />
            </span>
            <Input
              id="githubUrl"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/yourusername/project"
              className="rounded-l-none"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="liveUrl">Live Demo URL</Label>
          <div className="flex mt-1">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
              <ExternalLink size={16} />
            </span>
            <Input
              id="liveUrl"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://my-project-demo.com"
              className="rounded-l-none"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="techStack">Tech Stack</Label>
          <div className="flex mt-1">
            <Input
              id="techStack"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="React, TypeScript, etc."
              className="rounded-r-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTech();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddTech}
              className="rounded-l-none"
            >
              Add
            </Button>
          </div>
          
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {techStack.map((tech) => (
                <div
                  key={tech}
                  className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={featured}
            onCheckedChange={setFeatured}
          />
          <Label htmlFor="featured">Feature this project on the homepage</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/projects')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : project?.id ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
