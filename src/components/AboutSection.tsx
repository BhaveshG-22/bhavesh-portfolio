import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 z-0" />

      {/* Glowing orbs */}
      <div className="absolute top-32 left-20 w-60 h-60 bg-portfolio-purple/20 rounded-full blur-3xl animate-float opacity-40" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-portfolio-blue/20 rounded-full blur-2xl animate-float-delayed opacity-30" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0"></div>

      <div className="max-container relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-portfolio-purple bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full mb-6" />
          <p className="text-lg text-white/70 max-w-3xl">
            I'm a passionate full-stack developer with a keen eye for design and a love for creating seamless user experiences. I bring ideas to life with clean, maintainable code.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Image */}
          <div className="lg:col-span-2 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-portfolio-blue to-portfolio-purple rounded-xl blur-2xl opacity-30 animate-pulse-slow"></div>
            <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                alt="Developer" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">Who I Am</h3>
              <p className="text-white/70 mb-4">
                I'm a full-stack developer with 5+ years of experience building web and mobile applications. I specialize in JavaScript ecosystems including React, Next.js, and Node.js.
              </p>
              <p className="text-white/60">
                My passion is creating intuitive user interfaces backed by robust, scalable backend systems. I enjoy solving complex problems and continuously learning modern technologies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-white/5 border border-white/10 backdrop-blur-md shadow-md hover:scale-105 transition">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center mb-3 animate-float">
                    <span className="text-xl font-bold text-primary">5+</span>
                  </div>
                  <h4 className="font-medium text-white">Years of Experience</h4>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border border-white/10 backdrop-blur-md shadow-md hover:scale-105 transition">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center mb-3 animate-float-delayed">
                    <span className="text-xl font-bold text-primary">50+</span>
                  </div>
                  <h4 className="font-medium text-white">Projects Completed</h4>
                </CardContent>
              </Card>
            </div>

            <Button 
              asChild 
              className="bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-lg"
            >
              <a href="/resume.pdf" download className="px-6 py-3 flex items-center">
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
