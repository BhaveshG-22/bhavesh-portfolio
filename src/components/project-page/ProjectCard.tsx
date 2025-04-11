
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { Project } from "@/services/projectService";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="flex flex-col border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden hover:border-primary/20 transition-all duration-300 h-full">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl text-foreground">{project.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.tags && project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {tag}
            </Badge>
          ))}
          {project.tags && project.tags.length > 3 && (
            <Badge variant="outline" className="bg-secondary/20 text-secondary border-secondary/30">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {project.description}
        </p>
        
        <div className="flex gap-4 mt-auto pt-4">
          {project.demo && (
            <a 
              href={project.demo} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <span>Live Demo</span>
              <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </a>
          )}
          
          {project.github && (
            <a 
              href={project.github} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="mr-1 h-3.5 w-3.5" />
              <span>Code</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
