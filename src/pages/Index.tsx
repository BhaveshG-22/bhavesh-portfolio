
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
import { updateFirstProject, updateSecondProject } from "@/services/projectService";
import { toast } from "sonner";

const Index = () => {
  useEffect(() => {
    // Update the first and second projects when the page loads
    const updateProjects = async () => {
      try {
        await updateFirstProject();
        console.log("First project updated successfully");
        
        await updateSecondProject();
        console.log("Second project updated successfully");
      } catch (error) {
        console.error("Error updating projects:", error);
        toast.error("Failed to update project information");
      }
    };
    
    updateProjects();
  }, []);
  
  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Header activeSection="home" />
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
