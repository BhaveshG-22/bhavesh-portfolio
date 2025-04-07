import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Zap, Star, ExternalLink } from "lucide-react";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Text typing animation elements
  const [textIndex, setTextIndex] = useState(0);
  const textOptions = ["web applications", "user interfaces", "digital experiences", "modern websites"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % textOptions.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Dynamic Background with Parallax Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 z-0" />
      
      {/* Animated Orbs */}
      <div 
        className="absolute top-20 right-10 h-72 w-72 bg-primary/20 rounded-full blur-3xl animate-pulse" 
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />
      <div 
        className="absolute bottom-20 left-10 h-80 w-80 bg-portfolio-purple/20 rounded-full blur-3xl animate-pulse" 
        style={{ 
          animationDelay: "1s", 
          transform: `translateY(${-scrollY * 0.05}px)` 
        }}
      />
      <div 
        className="absolute top-40 left-1/4 h-40 w-40 bg-portfolio-blue/15 rounded-full blur-2xl animate-pulse" 
        style={{ 
          animationDelay: "2s", 
          transform: `translateY(${scrollY * 0.08}px) translateX(${scrollY * 0.05}px)` 
        }}
      />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-1"></div>
      
      {/* Floating elements */}
      <div className="absolute hidden lg:block right-[10%] top-[20%] w-16 h-16 bg-gradient-to-tr from-primary to-accent p-3 rounded-lg shadow-xl animate-float opacity-70">
        <Code className="w-full h-full text-white" />
      </div>
      <div className="absolute hidden lg:block left-[15%] bottom-[25%] w-10 h-10 bg-gradient-to-tr from-portfolio-purple to-portfolio-blue p-2 rounded-full shadow-xl animate-float-delayed opacity-70">
        <Zap className="w-full h-full text-white" />
      </div>
      
      <div className="max-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <div className={`flex flex-col space-y-8 transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
          <div className="flex items-center space-x-2">
            <span className="text-sm md:text-base font-medium text-primary px-4 py-2 bg-primary/10 rounded-full w-fit backdrop-blur-md border border-primary/20 shadow-sm">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></span>
              Full-Stack Web Developer
            </span>
            <Star className="h-5 w-5 text-yellow-400 animate-spin-slow" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
            Crafting <span className="bg-gradient-to-r from-primary to-portfolio-purple bg-clip-text text-transparent">digital</span> <span className="relative">
              <span className="bg-gradient-to-r from-portfolio-purple to-portfolio-blue bg-clip-text text-transparent">experiences</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7c28.6-4.2 77.8-7 147.8-1.6 70 5.3 113.2 4.8 147-1.1" fill="none" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--accent)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>
          
          <div className="text-xl lg:text-2xl font-medium h-8">
            I build 
            <span className="text-primary ml-2 inline-block min-w-40 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary/30">
              {textOptions[textIndex]}
              <span className="animate-blink ml-1">|</span>
            </span>
          </div>
          
          <p className="text-lg text-foreground/80 max-w-lg">
            I build responsive, performant, and accessible web applications using modern technologies.
            Let's bring your ideas to life with elegant solutions.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button 
              asChild 
              size="lg" 
              className="relative overflow-hidden group bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-lg"
            >
              <a href="#projects" className="px-6 py-3">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative flex items-center">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              asChild 
              className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 dark:bg-black/30 dark:border-white/10 rounded-lg hover:bg-white/20 dark:hover:bg-black/40 transition-all duration-300"
            >
              <a href="#contact" className="px-6 py-3">
                Contact Me
              </a>
            </Button>
          </div>
        </div>
        
        <div className={`relative w-full h-[400px] lg:h-[550px] p-4 transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
          {/* Code editor mockup with animations */}
          <div className="absolute inset-0 bg-gradient-to-tr from-portfolio-blue/40 to-portfolio-purple/40 rounded-2xl opacity-50 blur-xl animate-pulse-slow"></div>
          
          <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden">
            <div className="absolute -inset-[2px] bg-gradient-to-tr from-portfolio-blue via-primary to-portfolio-purple rounded-2xl animate-gradient-rotation"></div>
          </div>
          
          <div className="absolute inset-1 backdrop-blur-md bg-white/10 dark:bg-black/50 rounded-xl flex items-center justify-center p-8 border border-white/20 dark:border-white/5 shadow-2xl">
            <div className="relative w-full h-full bg-black/80 dark:bg-black/90 rounded-lg border border-white/10 p-4 overflow-hidden">
              <div className="absolute top-3 left-3 flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              
              <div className="absolute top-2.5 left-0 right-0 flex justify-center">
                <div className="px-4 py-0.5 text-xs text-white/60 bg-white/5 rounded-md">index.tsx</div>
              </div>
              
              <div className="absolute top-3 right-3 flex gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm bg-white/5 hover:bg-white/10">
                  <ExternalLink className="h-3 w-3 text-white/60" />
                </Button>
              </div>
              
              <div className="mt-10 space-y-3 font-mono text-sm">
                <div className="flex">
                  <span className="text-gray-500 w-6">1</span>
                  <span className="text-blue-400">import</span>
                  <span className="text-white"> React </span>
                  <span className="text-blue-400">from</span>
                  <span className="text-green-400"> 'react'</span>
                  <span className="text-white">;</span>
                </div>
                
                <div className="flex">
                  <span className="text-gray-500 w-6">2</span>
                  <span className="text-white"></span>
                </div>
                
                <div className="flex">
                  <span className="text-gray-500 w-6">3</span>
                  <span className="text-blue-400">const</span>
                  <span className="text-yellow-400"> Hero </span>
                  <span className="text-white">= () => {</span>
                </div>
                
                <div className="flex">
                  <span className="text-gray-500 w-6">4</span>
                  <span className="text-white pl-4">return (</span>
                </div>
                
                <div className="flex">
                  <span className="text-gray-500 w-6">5</span>
                  <span className="text-white pl-8 text-yellow-300">&lt;<span className="text-pink-400">div</span> <span className="text-purple-400">className</span>=<span className="text-green-400">"container"</span>&gt;</span>
                </div>
                
                <div className="flex">
                  <span className="text-gray-500 w-6">6</span>
                  <span className="text-white pl-12 text-yellow-300">&lt;<span className="text-pink-400">h1</span> <span className="text-purple-400">className</span>=<span className="text-green-400">"heading"</span>&gt;</span>
                  <span className="text-white animate-typing">Hello, World!</span>
                  <span className="text-yellow-300">&lt;/<span className="text-pink-400">h1</span>&gt;</span>
                </div>
                
                <div className="flex">
                  <span className="text-gray-500 w-6">7</span>
                  <span className="text-white pl-8 text-yellow-300">&lt;/<span className="text-pink-400">div</span>&gt;</span>
                </div>
                
                <div className="flex">
                  <span className="text-gray-500 w-6">8</span>
                  <span className="text-white pl-4">);</span>
                </div>
                
                <div className="flex">
                  <span className="text-gray-500 w-6">9</span>
                  <span className="text-white">};</span>
                </div>
                
                <div className="flex">
                  <span className="text-gray-500 w-6">10</span>
                  <span className="text-white"></span>
                </div>
                
                <div className="flex">
                  <span className="text-gray-500 w-6">11</span>
                  <span className="text-blue-400">export</span>
                  <span className="text-blue-400"> default</span>
                  <span className="text-yellow-400"> Hero</span>
                  <span className="text-white">;</span>
                </div>
                
                <div className="h-12 mt-4 bg-portfolio-purple/10 dark:bg-portfolio-purple/5 rounded-md border border-portfolio-purple/30 flex items-center justify-between px-3">
                  <div className="flex items-center">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-xs text-white/60">Terminal</span>
                  </div>
                  <span className="text-white text-xs">npm run dev<span className="animate-blink">|</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="particles">
        {[...Array(10)].map((_, i) => (
          <span 
            key={i}
            className="particle"
            style={{
              '--particle-size': `${Math.random() * 10 + 5}px`,
              '--particle-opacity': Math.random() * 0.5 + 0.3,
              '--particle-duration': `${Math.random() * 10 + 15}s`,
              '--particle-delay': `${Math.random() * 5}s`,
              '--particle-left': `${Math.random() * 100}%`,
              '--particle-top': `${Math.random() * 100}%`,
            }}
          ></span>
        ))}
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes typing {
          0%, 100% { width: 0; }
          50%, 90% { width: 100%; }
        }
        
        @keyframes gradient-rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        .animate-typing {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 8s steps(20, end) infinite;
        }
        
        .animate-gradient-rotation {
          animation: gradient-rotation 8s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .particles .particle {
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
          width: var(--particle-size);
          height: var(--particle-size);
          background: linear-gradient(to right, var(--primary), var(--accent));
          opacity: var(--particle-opacity);
          animation: float calc(var(--particle-duration)) ease-in-out infinite;
          animation-delay: var(--particle-delay);
          left: var(--particle-left);
          top: var(--particle-top);
          filter: blur(1px);
        }
      `}</style>
    </section>
  );
};

export default HeroSection;