
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [visibleProjects, setVisibleProjects] = useState(3);
  
  const projects: Project[] = [
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
    {
      id: 5,
      title: "Investment Portfolio Tracker",
      description: "A financial application for tracking investments, analyzing performance, and visualizing data.",
      image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c",
      tags: ["Next.js", "TypeScript", "AWS Lambda", "Recharts", "Auth0"],
      github: "https://github.com",
      demo: "https://demo.com",
      category: "frontend",
    },
    {
      id: 6,
      title: "API Integration Service",
      description: "A backend service that integrates multiple third-party APIs and provides a unified interface.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      tags: ["Node.js", "Express", "Docker", "Redis", "Jest"],
      github: "https://github.com",
      demo: "https://demo.com",
      category: "backend",
    },
  ];

  const showMoreProjects = () => {
    setVisibleProjects((prev) => Math.min(prev + 3, projects.length));
  };

  return (
    <section id="projects" className="section-padding">
      <div className="max-container">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <div className="w-20 h-1.5 bg-primary rounded-full mb-8" />
          <p className="text-lg text-foreground/80 max-w-3xl">
            Browse through a selection of my recent work showcasing my skills in building full-stack applications,
            responsive interfaces, and robust backend systems.
          </p>
        </div>
        
        <div className="glassmorphism rounded-xl p-4 mb-12">
          <Tabs defaultValue="all" className="mb-8">
            <div className="flex justify-center">
              <TabsList className="glassmorphism-light">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="frontend">Frontend</TabsTrigger>
                <TabsTrigger value="backend">Backend</TabsTrigger>
                <TabsTrigger value="fullstack">Full Stack</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, visibleProjects).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
            
            {["frontend", "backend", "fullstack"].map((category) => (
              <TabsContent key={category} value={category} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects
                    .filter((project) => project.category === category)
                    .slice(0, visibleProjects)
                    .map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          {visibleProjects < projects.length && (
            <div className="flex justify-center">
              <Button onClick={showMoreProjects} variant="outline" size="lg" className="glassmorphism-light">
                Load More Projects
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card className="group overflow-hidden glassmorphism-card border-0">
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10" />
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-foreground/80 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs glassmorphism-light">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline" className="text-xs glassmorphism-light">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild className="glassmorphism-light">
            <a href={project.github} target="_blank" rel="noreferrer">
              <Github className="mr-1 h-4 w-4" />
              Code
            </a>
          </Button>
          <Button size="sm" asChild className="glassmorphism">
            <a href={project.demo} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1 h-4 w-4" />
              Live Demo
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProjectsSection;
