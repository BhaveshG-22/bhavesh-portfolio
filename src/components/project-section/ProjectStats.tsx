
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ProjectStatsProps {
  allProjects: any[];
  showAllProjects: boolean;
  setShowAllProjects: (show: boolean) => void;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ 
  allProjects,
  showAllProjects,
  setShowAllProjects
}) => {
  return (
    <>
      <div className="mb-4 w-full flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowAllProjects(!showAllProjects)}
          className="flex items-center gap-2 text-xs"
        >
          {showAllProjects ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {showAllProjects ? "Show Only Visible" : "Show All (Including Hidden)"}
        </Button>
      </div>
      <div className="w-full mb-6">
        <p>Total Projects: {allProjects.length}</p>
        <p>Visible Projects: {allProjects.filter(p => !p.hidden).length}</p>
      </div>
    </>
  );
};

export default ProjectStats;
