
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 z-0" />
      
      {/* Animated background elements */}
      <div className="absolute top-20 right-10 h-64 w-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 h-64 w-64 bg-portfolio-purple/5 rounded-full blur-3xl" />
      
      <div className="max-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <div className="flex flex-col space-y-6 animate-fade-in">
          <span className="text-sm md:text-base font-medium text-primary px-4 py-2 bg-primary/10 rounded-full w-fit">
            Full-Stack Web Developer
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Crafting <span className="text-gradient">digital experiences</span> with code
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-lg">
            I build responsive, performant, and accessible web applications using modern technologies.
            Let's bring your ideas to life with elegant solutions.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg">
              <a href="#projects">
                View My Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#contact">Contact Me</a>
            </Button>
          </div>
        </div>
        
        <div className="relative w-full h-[400px] lg:h-[500px] p-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-portfolio-blue to-portfolio-purple rounded-lg opacity-20 blur-xl"></div>
          <div className="absolute inset-4 bg-white dark:bg-portfolio-blue/40 rounded-lg shadow-xl backdrop-blur-sm flex items-center justify-center p-8">
            <div className="relative w-full h-full bg-white/5 rounded-md border border-white/10 backdrop-blur-sm p-4 overflow-hidden">
              <div className="absolute top-2 left-2 flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="mt-5 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-primary/20 rounded w-2/3"></div>
                <div className="h-12 mt-4 bg-white/5 rounded-md border border-white/10"></div>
                <div className="flex gap-2 mt-4">
                  <div className="h-4 bg-portfolio-purple/20 rounded w-1/3"></div>
                  <div className="h-4 bg-portfolio-blue/20 rounded w-1/3"></div>
                </div>
                <div className="h-4 bg-white/10 rounded w-5/6"></div>
                <div className="h-4 bg-white/10 rounded w-4/5"></div>
                <div className="h-4 bg-primary/20 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
