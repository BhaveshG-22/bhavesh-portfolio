
import { Project as ServiceProject } from "@/services/projectService";

// Re-export the Project type from the service
export type { ServiceProject as Project };

// Legacy type for backward compatibility
export type LegacyProject = {
  id?: string;
  title: string;
  description: string;
  link: string;
  image_url: string;
  category: string;
  created_at?: string;
};
