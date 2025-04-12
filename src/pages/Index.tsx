
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import CertificationsSection from "@/components/CertificationsSection";
import ContactSection from "@/components/ContactSection";
import GithubSection from "@/components/GithubSection";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Header />
      <main className="pt-0">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <GithubSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
