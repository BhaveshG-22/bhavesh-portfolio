import TechStackSlider from "./TechStackSlider";
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
  // Two tech stacks for front-end and back-end
  const frontendTech = [
    { name: "HTML", logo: <Globe className="h-4 w-4" />, color: "bg-orange-500" },
    { name: "CSS", logo: <Braces className="h-4 w-4" />, color: "bg-blue-500" },
    { name: "JavaScript", logo: <FileCode className="h-4 w-4" />, color: "bg-yellow-500" },
    { name: "TypeScript", logo: <Code className="h-4 w-4" />, color: "bg-blue-600" },
    { name: "React", logo: <Webhook className="h-4 w-4" />, color: "bg-cyan-500" },
    { name: "Next.js", logo: <Milestone className="h-4 w-4" />, color: "bg-black" },
    { name: "TailwindCSS", logo: <Layers className="h-4 w-4" />, color: "bg-cyan-400" },
    { name: "Vue", logo: <Box className="h-4 w-4" />, color: "bg-green-500" },
    { name: "Angular", logo: <Monitor className="h-4 w-4" />, color: "bg-red-500" },
    { name: "Svelte", logo: <Zap className="h-4 w-4" />, color: "bg-orange-600" }
  ];
  
  const backendTech = [
    { name: "Node.js", logo: <Server className="h-4 w-4" />, color: "bg-green-600" },
    { name: "Express", logo: <Activity className="h-4 w-4" />, color: "bg-gray-700" },
    { name: "Python", logo: <FileCog className="h-4 w-4" />, color: "bg-blue-500" },
    { name: "Flask", logo: <Terminal className="h-4 w-4" />, color: "bg-black" },
    { name: "MongoDB", logo: <Database className="h-4 w-4" />, color: "bg-green-700" },
    { name: "Firebase", logo: <Cloud className="h-4 w-4" />, color: "bg-yellow-600" },
    { name: "TensorFlow", logo: <LineChart className="h-4 w-4" />, color: "bg-orange-500" },
    { name: "C++", logo: <Cpu className="h-4 w-4" />, color: "bg-blue-600" },
    { name: "Nginx", logo: <Network className="h-4 w-4" />, color: "bg-green-500" },
    { name: "Keras", logo: <BarChart className="h-4 w-4" />, color: "bg-red-500" },
    { name: "Solidity", logo: <Lock className="h-4 w-4" />, color: "bg-gray-800" },
    { name: "Bun", logo: <Rocket className="h-4 w-4" />, color: "bg-pink-500" },
    { name: "Arch Linux", logo: <HardDrive className="h-4 w-4" />, color: "bg-blue-800" }
  ];

  return (
    <section id="skills" className="section-padding relative bg-muted/30">
      <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-transparent z-0" />
      
      <div className="max-container relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tools that I have used</h2>
          <div className="w-20 h-1.5 bg-primary rounded-full mb-8" />
          <p className="text-lg text-muted-foreground max-w-3xl">
            I've acquired a diverse range of skills throughout my journey as a full-stack developer.
            Here's a glimpse of my technical expertise and the technologies I work with.
          </p>
        </div>
        
        {/* Just two tech stack sliders - one flowing each direction with fixed backgrounds */}
        <div className="mb-12 bg-white/5 dark:bg-gray-900/30 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-xl p-4 overflow-hidden">
          <div className="mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 ml-4">Front-end Technologies</h3>
            <div className="bg-transparent">
              <TechStackSlider 
                direction="ltr" 
                speed="medium" 
                items={frontendTech} 
                variant="glassmorphic"
                className="bg-transparent"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 ml-4">Back-end & Other Technologies</h3>
            <div className="bg-transparent">
              <TechStackSlider 
                direction="rtl" 
                speed="medium" 
                items={backendTech} 
                variant="glassmorphic"
                className="bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;