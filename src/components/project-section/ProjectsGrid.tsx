
import React from "react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/services/projectService";

interface ProjectsGridProps {
  projects: Project[];
  activeCategory: string;
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, activeCategory }) => {
  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category.toLowerCase() === activeCategory.toLowerCase());

  if (filteredProjects.length === 0) {
    return (
      <div className="w-full text-center py-12 text-gray-400">
        No projects in this category yet.
        {projects.length > 0 && <span> (But {projects.length} projects in other categories)</span>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectsGrid;
