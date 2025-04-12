
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import CertificationsSection from "@/components/CertificationsSection";
import ContactSection from "@/components/ContactSection";
import GithubSection from "@/components/GithubSection";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { useEffect } from "react";
import { updateProject, fetchProjects } from "@/services/projectService";
import { toast } from "sonner";

const Index = () => {
  useEffect(() => {
    // Update the first and second projects when the page loads
    const updateInitialProjects = async () => {
      try {
        // Fetch projects first to get their IDs
        const projects = await fetchProjects();
        
        // Update first two projects if they exist
        if (projects.length > 0) {
          await updateProject(projects[0].id, {
            title: projects[0].title,
            description: projects[0].description,
            // Add any other fields you want to update
            is_default: true
          });
        }
        
        if (projects.length > 1) {
          await updateProject(projects[1].id, {
            title: projects[1].title,
            description: projects[1].description,
            // Add any other fields you want to update
            is_default: true
          });
        }
        
        console.log("Initial projects updated successfully");
      } catch (error) {
        console.error("Error updating initial projects:", error);
        toast.error("Failed to update project information");
      }
    };
    
    updateInitialProjects();
  }, []);
  
  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Header />
      <main className="pt-0">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <GithubSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

