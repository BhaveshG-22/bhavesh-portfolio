import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Monitor,
  ArrowRight,
  Sparkles,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const createSocialLinks = () => {
    const socialIcons = [
      { icon: Github, href: "https://github.com/BhaveshG-22", label: "GitHub" },
      { icon: Linkedin, href: "https://www.linkedin.com/in/bhaveshgavali/", label: "LinkedIn" },
      { icon: Twitter, href: "https://x.com/BGavali_22", label: "Twitter" }
    ];

    return (
      <div className={`flex gap-4 ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-700 delay-700`}>
        {socialIcons.map((social, index) => (
          <a
            key={`social-${index}`}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-gray-300 hover:text-white hover:border-primary/50 transition-all hover:scale-110"
            aria-label={social.label}
          >
            <social.icon className="w-5 h-5" />
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex items-center py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div 
              className={`inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-500`}
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Full-Stack Developer
            </div>

            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-500 delay-100`}
            >
              Building <span className="text-gradient">exceptional</span>
              <br />
              digital experiences
            </h1>

            <p 
              className={`text-lg text-gray-300 max-w-xl ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-500 delay-200`}
            >
              I build full-stack web applications and automation tools using modern technologies. Specializing in high-performance systems, intuitive interfaces, and real-world problem solving.
            </p>

            <div 
              className={`flex flex-wrap gap-4 ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-500 delay-300`}
            >
              <Button
                asChild
                size="lg"
                className="relative overflow-hidden group bg-gradient-to-r from-primary to-accent text-white font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                <Link 
                  to="/projects" 
                  className="flex items-center"
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  Explore Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-gray-600 hover:border-white text-gray-200 hover:text-white transition-all duration-300"
              >
                <a href="#contact" className="flex items-center">
                  Get in Touch
                </a>
              </Button>
            </div>

            {createSocialLinks()}
          </div>

          <div>
            {/* Placeholder for terminal or other right-side content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
