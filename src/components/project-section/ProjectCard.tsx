
import React from "react";
import { ExternalLink, Github } from "lucide-react";
import { Project } from "@/services/projectService";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Removed isAdmin check that was using AuthContext
  return (
    <div className="flex flex-col">
      <div className="relative h-64 mb-6 overflow-hidden rounded-xl border border-white/10 backdrop-blur-sm bg-black/40 hover:border-teal-500/30 transition-all">
        {/* Removed hidden indicator since there's no admin functionality */}
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

export default ProjectCard;
