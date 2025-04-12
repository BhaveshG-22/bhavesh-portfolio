
import TechStackSlider from "./TechStackSlider";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Code,
  FileCode,
  Globe,
  Database,
  Server,
  Terminal,
  Cpu,
  Layers,
  Webhook,
  Braces,
  Milestone,
  Box,
  Monitor,
  BarChart,
  Cloud,
  Lock,
  Network,
  LineChart,
  Activity,
  Rocket,
  HardDrive,
  Zap,
  FileCog
} from "lucide-react";

const SkillsSection = () => {
  const isMobile = useIsMobile();
  
  // Tech stacks for sliders with standard Lucide icons
  const frontendTech = [
    { name: "HTML", icon: Globe, color: "bg-orange-500" },
    { name: "CSS", icon: Braces, color: "bg-blue-500" },
    { name: "JavaScript", icon: FileCode, color: "bg-yellow-500" },
    { name: "TypeScript", icon: Code, color: "bg-blue-600" },
    { name: "React", icon: Webhook, color: "bg-cyan-500" },
    { name: "Next.js", icon: Milestone, color: "bg-black" },
    { name: "TailwindCSS", icon: Layers, color: "bg-cyan-400" },
    { name: "Vue", icon: Box, color: "bg-green-500" },
    { name: "Angular", icon: Monitor, color: "bg-red-500" },
    { name: "Svelte", icon: Zap, color: "bg-orange-600" }
  ];

  const backendTech = [
    { name: "Node.js", icon: Server, color: "bg-green-600" },
    { name: "Express", icon: Activity, color: "bg-gray-700" },
    { name: "Python", icon: FileCog, color: "bg-blue-500" },
    { name: "Flask", icon: Terminal, color: "bg-black" },
    { name: "MongoDB", icon: Database, color: "bg-green-700" },
    { name: "Firebase", icon: Cloud, color: "bg-yellow-600" },
    { name: "TensorFlow", icon: LineChart, color: "bg-orange-500" },
    { name: "C++", icon: Cpu, color: "bg-blue-600" },
    { name: "Nginx", icon: Network, color: "bg-green-500" },
    { name: "Keras", icon: BarChart, color: "bg-red-500" },
    { name: "Solidity", icon: Lock, color: "bg-gray-800" },
    { name: "Bun", icon: Rocket, color: "bg-pink-500" },
  ];

  return (
    <section id="skills" className="section-padding relative bg-muted/30">
      <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-transparent z-0" />

      <div className="max-container relative z-10">
        <div className="flex flex-col items-center text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Tools that I have used</h2>
          <div className="w-16 md:w-20 h-1 md:h-1.5 bg-primary rounded-full mb-6 md:mb-8" />
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl px-4 md:px-0">
            I've acquired a diverse range of skills throughout my journey as a full-stack developer.
            Here's a glimpse of my technical expertise and the technologies I work with.
          </p>
        </div>

        {/* Tech stack sliders - with responsive design */}
        <div className="mb-8 md:mb-12 bg-white/20 dark:bg-black/40 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-xl p-3 md:p-4">
          <TechStackSlider 
            direction="ltr" 
            speed={isMobile ? "slow" : "medium"} 
            items={frontendTech} 
            variant="default"
          />
          
          <TechStackSlider 
            direction="rtl" 
            speed={isMobile ? "slow" : "medium"} 
            items={backendTech} 
            variant="default"
          />
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
