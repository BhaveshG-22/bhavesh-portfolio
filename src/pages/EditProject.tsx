
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject, Project } from '@/services/projectService';
import { useRequireAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectForm from '@/components/ProjectForm';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const EditProject = () => {
  useRequireAuth(); // Redirect if not authenticated
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        const projectData = await getProjectById(id);
        if (!projectData) {
          setError('Project not found');
          return;
        }
        setProject(projectData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch project');
      } finally {
        setIsLoadingProject(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      await updateProject(id, projectData);
      toast.success('Project updated successfully');
      navigate('/projects');
    } catch (error: any) {
      toast.error(`Failed to update project: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
          
          {isLoadingProject ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Card className="p-6 text-center">
              <p className="text-destructive">{error}</p>
            </Card>
          ) : project ? (
            <ProjectForm project={project} onSubmit={handleSubmit} isLoading={isLoading} />
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProject;
