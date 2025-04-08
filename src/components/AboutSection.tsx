
import { Button } from "@/components/ui/button";
import { Download, BookOpen, Briefcase, Award, Globe, Heart, Coffee, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full bg-secondary/10 blur-3xl"></div>
      </div>
      
      <div className="max-container relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gradient-light">About Me</h2>
          <div className="w-24 h-1.5 bg-primary rounded-full mb-6 animate-pulse"></div>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            I'm a passionate full-stack developer with a keen eye for design and a love for creating 
            seamless user experiences that bridge creativity with technical excellence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Profile image section with stylized container */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/60 to-secondary/60 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
              <div className="relative glassmorphism-card rounded-xl p-1.5">
                <AspectRatio ratio={1/1} className="rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                    alt="Developer" 
                    className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
                  />
                </AspectRatio>
              </div>
            </div>
            
            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-primary" />
                <span className="text-gradient">Key Highlights</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card/50 backdrop-blur-sm border border-white/10">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-medium text-sm">Passion for Code</h4>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border border-white/10">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                      <Coffee className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-medium text-sm">Problem Solver</h4>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Content section with bio and features */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="mb-6 flex items-start">
                <Avatar className="h-16 w-16 mr-4 ring-2 ring-primary/30">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                  <AvatarFallback>BG</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold text-gradient-light">Bhavesh G.</h3>
                  <p className="text-teal-gradient font-medium">Full Stack Developer & UI/UX Enthusiast</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  I'm a full-stack developer with experience building web and mobile applications. I specialize in JavaScript ecosystems, 
                  with expertise in React, Next.js, Node.js, and modern backend technologies.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  My passion is creating intuitive user interfaces backed by robust, scalable backend systems. 
                  I enjoy solving complex problems and continuously learning new technologies to stay at the forefront of web development.
                </p>
              </div>
            </div>
            
            {/* Personal traits and work approach */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card/30 backdrop-blur-sm rounded-xl p-5 border border-white/10 transition-all hover:border-primary/30 group">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-full bg-primary/10 mr-3 group-hover:bg-primary/20 transition-colors">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold">Work Approach</h4>
                </div>
                <p className="text-sm text-muted-foreground">Detail-oriented with a focus on code quality, performance, and maintainability.</p>
              </div>
              
              <div className="bg-card/30 backdrop-blur-sm rounded-xl p-5 border border-white/10 transition-all hover:border-primary/30 group">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-full bg-primary/10 mr-3 group-hover:bg-primary/20 transition-colors">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold">Remote Collaboration</h4>
                </div>
                <p className="text-sm text-muted-foreground">Experienced in remote work with international teams across different time zones.</p>
              </div>
              
              <div className="bg-card/30 backdrop-blur-sm rounded-xl p-5 border border-white/10 transition-all hover:border-primary/30 group">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-full bg-primary/10 mr-3 group-hover:bg-primary/20 transition-colors">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold">Quality Focus</h4>
                </div>
                <p className="text-sm text-muted-foreground">Committed to creating accessible, responsive, and user-friendly applications.</p>
              </div>
              
              <div className="bg-card/30 backdrop-blur-sm rounded-xl p-5 border border-white/10 transition-all hover:border-primary/30 group">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-full bg-primary/10 mr-3 group-hover:bg-primary/20 transition-colors">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold">Industry Focus</h4>
                </div>
                <p className="text-sm text-muted-foreground">Experience in fintech, e-commerce, SaaS platforms, and content management systems.</p>
              </div>
            </div>
            
            {/* CTA button */}
            <div className="flex justify-center md:justify-start pt-4">
              <Button size="lg" className="group relative overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/80 to-primary group-hover:scale-105 transition-transform duration-300"></span>
                <span className="relative flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
