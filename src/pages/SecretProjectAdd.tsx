
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
      navigate("/"); // Redirect to home page
    } catch (error) {
      toast.error("Failed to add project");
      console.error("Error saving project:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-teal-400">Add New Project</h1>
        
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
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Add Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecretProjectAdd;
