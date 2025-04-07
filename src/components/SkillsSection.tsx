
import { Card, CardContent } from "@/components/ui/card";
import { Code, Server, Layout, Database, Globe, Cpu } from "lucide-react";

const SkillsSection = () => {
  const skillCategories = [
    {
      title: "Frontend",
      icon: Layout,
      skills: ["React", "Next.js", "TypeScript", "HTML5/CSS3", "Tailwind CSS", "Redux", "React Query"],
    },
    {
      title: "Backend",
      icon: Server,
      skills: ["Node.js", "Express", "NestJS", "Django", "Flask", "RESTful APIs", "GraphQL"],
    },
    {
      title: "Databases",
      icon: Database,
      skills: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Supabase", "Firebase"],
    },
    {
      title: "DevOps",
      icon: Globe,
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Git", "GitHub Actions", "Vercel"],
    },
    {
      title: "Languages",
      icon: Code,
      skills: ["JavaScript", "TypeScript", "Python", "PHP", "Java", "SQL"],
    },
    {
      title: "Tools",
      icon: Cpu,
      skills: ["VS Code", "Figma", "Postman", "Jest", "Cypress", "Storybook", "Webpack"],
    },
  ];

  return (
    <section id="skills" className="section-padding relative bg-black">
      <div className="max-container relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Tools that I have used</h2>
          <div className="w-20 h-1.5 bg-teal-400 rounded-full mb-8" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category) => (
            <Card key={category.title} className="bg-[#1A1F2C] border-[#2A2F3C] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#2A2F3C] flex items-center justify-center mr-3">
                    <category.icon className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="inline-flex px-3 py-1 text-sm bg-[#2A2F3C] text-white rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
