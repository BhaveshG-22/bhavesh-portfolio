// ProfessionalHeroSection.tsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Github, 
  Linkedin, 
  Mail,
  ExternalLink,
  Code,
  CheckCircle
} from "lucide-react";

// Professional typing animation for headings
const TypedHeading = ({ text, className = "" }) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.substring(0, index));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, [text]);
  
  return (
    <span className={className}>
      {displayText}
      {!isComplete && (
        <span className="inline-block w-1 h-6 bg-primary ml-1 animate-blink"></span>
      )}
    </span>
  );
};

// FadeIn component for smooth animations
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Main Professional Hero Section Component
const ProfessionalHeroSection = () => {
  const [activeExpertise, setActiveExpertise] = useState(0);
  const sectionRef = useRef(null);
  
  // Expertise areas with descriptions
  const expertiseAreas = [
    {
      title: "Front-End Development",
      description: "Creating responsive, accessible, and performant user interfaces using React, TypeScript, and modern CSS frameworks.",
      technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      icon: <Code className="w-5 h-5" />
    },
    {
      title: "Back-End Development",
      description: "Building scalable and reliable API services and server-side applications with Node.js and related technologies.",
      technologies: ["Node.js", "Express", "MongoDB", "RESTful APIs"],
      icon: <Code className="w-5 h-5" />
    },
    {
      title: "Development Operations",
      description: "Implementing CI/CD pipelines, containerization, and cloud deployment strategies for seamless application delivery.",
      technologies: ["Docker", "AWS", "GitHub Actions", "Vercel"],
      icon: <Code className="w-5 h-5" />
    }
  ];
  
  // Project highlights
  const projects = [
    {
      title: "Enterprise Dashboard",
      description: "Analytics dashboard for enterprise resource management"
    },
    {
      title: "E-commerce Platform",
      description: "Fully-featured online shopping experience with secure payments"
    },
    {
      title: "API Gateway Service",
      description: "Centralized API management solution with advanced caching"
    }
  ];
  
  // Auto-rotate expertise areas
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExpertise((prev) => (prev + 1) % expertiseAreas.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [expertiseAreas.length]);
  
  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden bg-white dark:bg-gray-950 py-20"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-gray-100/20 dark:bg-grid-gray-900/20 opacity-50"></div>
      
      {/* Professional accent shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-primary/0 blur-2xl opacity-40 dark:opacity-20"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-500/20 to-blue-500/0 blur-2xl opacity-40 dark:opacity-20"></div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Main content */}
          <div className="space-y-8">
            {/* Professional title badge */}
            <FadeIn delay={100}>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Full-Stack Software Engineer
              </div>
            </FadeIn>
            
            {/* Main heading with typing effect */}
            <FadeIn delay={200}>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                <TypedHeading text="Delivering exceptional" />
                <br />
                <span className="text-primary">digital solutions</span>
              </h1>
            </FadeIn>
            
            {/* Professional description */}
            <FadeIn delay={300}>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                I specialize in developing modern, scalable web applications that solve 
                complex business problems. With an emphasis on code quality and performance, 
                I help companies build products their users love.
              </p>
            </FadeIn>
            
            {/* CTA buttons */}
            <FadeIn delay={400}>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-medium group"
                >
                  View Portfolio
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Download Resume
                </Button>
              </div>
            </FadeIn>
            
            {/* Professional stats */}
            <FadeIn delay={500}>
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">7+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Years of Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">50+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">15+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Satisfied Clients</div>
                </div>
              </div>
            </FadeIn>
            
            {/* Contact and social links */}
            <FadeIn delay={600}>
              <div className="pt-4 flex items-center space-x-4">
                <a 
                  href="#" 
                  aria-label="GitHub"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  aria-label="LinkedIn"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:contact@example.com" 
                  aria-label="Email"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
                <a 
                  href="mailto:contact@example.com" 
                  className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200 text-sm font-medium"
                >
                  contact@example.com
                </a>
              </div>
            </FadeIn>
          </div>
          
          {/* Right Column - Professional Card */}
          <div>
            <FadeIn delay={300}>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
                {/* Card header */}
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Areas of Expertise</h2>
                    <div className="flex space-x-1">
                      {expertiseAreas.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveExpertise(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === activeExpertise 
                              ? "bg-primary" 
                              : "bg-gray-300 dark:bg-gray-700"
                          }`}
                          aria-label={`View expertise area ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Expertise content */}
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Icon and title */}
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4">
                        {expertiseAreas[activeExpertise].icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {expertiseAreas[activeExpertise].title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Professional expertise
                        </p>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300">
                      {expertiseAreas[activeExpertise].description}
                    </p>
                    
                    {/* Technologies */}
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Technologies
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {expertiseAreas[activeExpertise].technologies.map((tech, index) => (
                          <div 
                            key={index} 
                            className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          >
                            {tech}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recent projects section */}
                <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-5">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Recent Projects
                  </h3>
                  
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <div 
                        key={index} 
                        className="flex items-start"
                      >
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {project.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button
                      variant="ghost"
                      className="text-primary hover:text-primary/90 hover:bg-primary/10 -ml-2 font-medium group"
                    >
                      View all projects
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
      
      {/* Custom animations */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        /* Professional grid background */
        .bg-grid-gray-100 {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
        }
        
        .bg-grid-gray-900 {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </section>
  );
};

export default ProfessionalHeroSection;