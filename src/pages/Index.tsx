
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import CertificationsSection from "@/components/CertificationsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import FeaturedProjects from "@/components/FeaturedProjects";
import GithubSection from "@/components/GithubSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Header />
      <main className="pt-0">
        <HeroSection />
        <AboutSection className="bg-[#E5DEFF]" />
        <SkillsSection className="bg-[#D3E4FD]" />
        <FeaturedProjects className="bg-[#F2FCE2]" />
        <GithubSection className="bg-[#FEF7CD]" />
        <CertificationsSection className="bg-[#FEC6A1]" />
        <ContactSection className="bg-[#FFDEE2]" />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
