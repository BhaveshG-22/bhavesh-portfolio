
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash, Eye, EyeOff } from "lucide-react";

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
};

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

  // Load all projects on component mount
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
        },
      ];
      
      // Load custom projects from localStorage
      const customProjects = JSON.parse(localStorage.getItem("customProjects") || "[]");
      
      // Combine all projects
      setAllProjects([...defaultProjects, ...customProjects]);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Failed to load projects");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        const defaultProjects = prev.filter(p => p.id <= 4);
        return [...defaultProjects, ...updatedCustomProjects];
      });
    } catch (error) {
      toast.error("Failed to add project");
      console.error("Error saving project:", error);
    }
  };

  const handleToggleVisibility = (project: Project) => {
    try {
      // Only custom projects can be hidden (id > 4)
      if (project.id <= 4) {
        toast.error("Default projects cannot be hidden");
        return;
      }

      // Get existing projects
      const existingProjects = JSON.parse(
        localStorage.getItem("customProjects") || "[]"
      );
      
      // Update project visibility
      const updatedProjects = existingProjects.map((p: Project) => 
        p.id === project.id ? { ...p, hidden: !p.hidden } : p
      );
      
      // Save to local storage
      localStorage.setItem("customProjects", JSON.stringify(updatedProjects));
      
      // Update state
      setAllProjects(prev => {
        const defaultProjects = prev.filter(p => p.id <= 4);
        return [
          ...defaultProjects, 
          ...updatedProjects
        ];
      });
      
      toast.success(`Project ${project.hidden ? 'shown' : 'hidden'} successfully`);
    } catch (error) {
      toast.error("Failed to update project visibility");
      console.error("Error updating project visibility:", error);
    }
  };

  const handleDeleteProject = (projectId: number) => {
    try {
      // Only custom projects can be deleted (id > 4)
      if (projectId <= 4) {
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
      setAllProjects(prev => {
        const defaultProjects = prev.filter(p => p.id <= 4);
        return [...defaultProjects, ...updatedProjects];
      });
      
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error("Error deleting project:", error);
    }
  };

  // Filter only custom projects for the project list
  const customProjects = allProjects.filter(project => project.id > 4);

  return (
    <div className="min-h-screen bg-gray-950 text-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-teal-400">Project Management</h1>
        
        <div className="grid md:grid-cols-2 gap-10">
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
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Fullstack</option>
                </select>
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
            <h2 className="text-2xl font-semibold mb-6 text-white">Manage Custom Projects</h2>
            {customProjects.length === 0 ? (
              <div className="text-gray-400 text-center py-10 border border-dashed border-gray-700 rounded-lg">
                No custom projects yet. Add your first one!
              </div>
            ) : (
              <div className="space-y-4">
                {customProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className={`p-4 border border-gray-700 rounded-lg ${project.hidden ? 'opacity-60' : ''}`}
                  >
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium">{project.title}</h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleVisibility(project)}
                        >
                          {project.hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash size={18} />
                        </Button>
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
        </div>
      </div>
    </div>
  );
};

export default SecretProjectAdd;
