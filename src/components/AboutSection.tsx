
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent z-0" />
      
      <div className="max-container relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1.5 bg-primary rounded-full mb-8" />
          <p className="text-lg text-muted-foreground max-w-3xl">
            I'm a passionate full-stack developer with a keen eye for design and a love for creating seamless user experiences.
            With expertise in both frontend and backend technologies, I bring ideas to life with clean, maintainable code.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-portfolio-blue to-portfolio-purple rounded-lg opacity-20 blur-md"></div>
              <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-white/20 dark:border-portfolio-blue/40">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                  alt="Developer" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Who I Am</h3>
              <p className="text-muted-foreground mb-4">
                I'm a full-stack developer with 5+ years of experience building web and mobile applications. I specialize in JavaScript ecosystems, 
                with expertise in React, Next.js, Node.js, and modern backend technologies.
              </p>
              <p className="text-muted-foreground">
                My passion is creating intuitive user interfaces backed by robust, scalable backend systems. 
                I enjoy solving complex problems and continuously learning new technologies to stay at the forefront of web development.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-primary">5+</span>
                  </div>
                  <h4 className="font-medium">Years of Experience</h4>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-primary">50+</span>
                  </div>
                  <h4 className="font-medium">Projects Completed</h4>
                </CardContent>
              </Card>
            </div>
            
            <Button asChild>
              <a href="/resume.pdf" download>
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
