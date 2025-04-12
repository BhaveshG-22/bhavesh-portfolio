
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, Project } from '@/services/projectService';
import { useRequireAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectForm from '@/components/ProjectForm';

const CreateProject = () => {
  useRequireAuth(); // Redirect if not authenticated
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      await createProject(projectData);
      toast.success('Project created successfully');
      navigate('/projects');
    } catch (error: any) {
      toast.error(`Failed to create project: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
          <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateProject;
