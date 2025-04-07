
import { Card, CardContent } from "@/components/ui/card";
import { Code, Server, Layout, Database, Globe, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <section id="skills" className="section-padding relative bg-muted/30">
      <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-transparent z-0" />
      
      <div className="max-container relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Skills</h2>
          <div className="w-20 h-1.5 bg-primary rounded-full mb-8" />
          <p className="text-lg text-muted-foreground max-w-3xl">
            I've acquired a diverse range of skills throughout my journey as a full-stack developer.
            Here's a glimpse of my technical expertise and the technologies I work with.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category) => (
            <Card key={category.title} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="group-hover:bg-primary/10 transition-colors">
                      {skill}
                    </Badge>
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
