
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { cn } from "@/lib/utils";

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  demo: string;
  category: string;
};

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Default projects data
  const defaultProjects: Project[] = [
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

  // Load projects from local storage on component mount
  useEffect(() => {
    try {
      // Load custom projects from localStorage
      const customProjects = JSON.parse(localStorage.getItem("customProjects") || "[]");
      
      // Combine default projects with custom projects
      setProjects([...defaultProjects, ...customProjects]);
    } catch (error) {
      console.error("Error loading custom projects:", error);
      setProjects(defaultProjects);
    }
  }, []);

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="projects" className="section-padding bg-gray-950 text-white">
      <div className="max-container">
        <div className="flex flex-col items-start mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-light">Featured Projects</h2>
          <div className="w-32 h-1 bg-teal-500 opacity-80 mb-8" />
          
          <div className="flex gap-6 mb-10 flex-wrap">
            {["all", "frontend", "backend", "fullstack"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-1 text-sm rounded-md transition-all",
                  activeCategory === category
                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/40"
                    : "text-gray-400 hover:text-gray-200"
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="flex flex-col">
      <div className="relative h-64 mb-6 overflow-hidden rounded-xl border border-white/10 backdrop-blur-sm bg-black/40 hover:border-teal-500/30 transition-all">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      
      <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {project.tags.map((tag) => (
          <span key={tag} className="text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
      
      <p className="text-gray-400 mb-5 text-sm">
        {project.description}
      </p>
      
      <div className="flex gap-4 mt-auto">
        <a 
          href={project.demo} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
        >
          <span>Live Preview</span>
          <ExternalLink className="h-4 w-4" />
        </a>
        
        <a 
          href={project.github} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          <span>Repo URL</span>
          <Github className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default ProjectsSection;
