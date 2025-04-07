
import TechStackSlider from "./TechStackSlider";

const SkillsSection = () => {
  // Tech stacks for sliders with logos
  const frontendTech = [
    { name: "HTML" },
    { name: "JavaScript" },
    { name: "TypeScript" },
    { name: "Next.js" },
    { name: "React" },
    { name: "TailwindCSS" },
    { name: "Vue" }, 
    { name: "Angular" }, 
    { name: "Material UI" }, 
    { name: "Chakra UI" }, 
    { name: "Redux" }, 
    { name: "React Query" },
    { name: "Webpack" },
    { name: "Vite" }
  ];
  
  const backendTech = [
    { name: "Node.js" },
    { name: "Express" },
    { name: "Prisma" },
    { name: "Firebase" },
    { name: "Nginx" },
    { name: "TensorFlow" },
    { name: "NestJS" },
    { name: "Django" },
    { name: "Flask" },
    { name: "Ruby on Rails" },
    { name: "Spring Boot" },
    { name: "FastAPI" },
    { name: "GraphQL" },
    { name: "PostgreSQL" },
    { name: "MongoDB" }
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

        {/* Tech stack sliders */}
        <div className="mb-12 glassmorphism rounded-xl p-4">
          <TechStackSlider direction="ltr" speed="medium" items={frontendTech} />
          <TechStackSlider direction="rtl" speed="medium" items={backendTech} />
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
