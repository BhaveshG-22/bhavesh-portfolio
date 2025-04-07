// AnimatedVisualHeroSection.tsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Github, 
  Linkedin, 
  ExternalLink,
  Code,
  Layers,
  Bot,
  Globe,
  Database
} from "lucide-react";

// ParticleField component for dynamic background
const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, radius: 100 });
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Create particles
    const createParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(Math.floor(window.innerWidth * 0.1), 150);
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1;
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          baseSize: size,
          speed: Math.random() * 1 + 0.2,
          velocity: {
            x: (Math.random() - 0.5) * 1.5,
            y: (Math.random() - 0.5) * 1.5
          },
          color: `rgba(79, 70, 229, ${Math.random() * 0.5 + 0.3})`,
          connected: []
        });
      }
    };
    
    createParticles();
    
    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        const particle = particlesRef.current[i];
        
        // Update position
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.velocity.x = -particle.velocity.x;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.velocity.y = -particle.velocity.y;
        }
        
        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRef.current.radius) {
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
          const angle = Math.atan2(dy, dx);
          
          particle.x -= Math.cos(angle) * force * 5;
          particle.y -= Math.sin(angle) * force * 5;
          
          // Grow particle size near mouse
          particle.size = particle.baseSize * (1 + force);
        } else {
          // Reset size
          particle.size = particle.baseSize;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Connect nearby particles
        particle.connected = [];
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const otherParticle = particlesRef.current[j];
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            particle.connected.push(j);
            
            // Draw connection
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(79, 70, 229, ${0.2 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full -z-10 opacity-70"
    />
  );
};

// 3D rotating cube component
const RotatingCube = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Add animation to rotate the cube
    const interval = setInterval(() => {
      if (containerRef.current) {
        const current = containerRef.current;
        const currentRotation = current.style.transform || 'rotateX(0deg) rotateY(0deg)';
        const matches = currentRotation.match(/rotateX\((-?\d+)deg\) rotateY\((-?\d+)deg\)/);
        
        if (matches) {
          const x = parseInt(matches[1], 10);
          const y = parseInt(matches[2], 10);
          current.style.transform = `rotateX(${x + 0.5}deg) rotateY(${y + 0.5}deg)`;
        } else {
          current.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
      }
    }, 30);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-60 h-60 relative perspective-1000 mx-auto">
      <div 
        ref={containerRef} 
        className="w-full h-full relative transform-style-3d transition-transform duration-300 ease-out"
        style={{ transform: 'rotateX(0deg) rotateY(0deg)' }}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center transform translate-z-30 text-white">
          <Code className="w-10 h-10" />
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 w-full h-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center transform -translate-z-30 rotate-y-180 text-white">
          <Database className="w-10 h-10" />
        </div>
        
        {/* Left */}
        <div className="absolute inset-0 w-full h-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center transform -translate-x-30 rotate-y-90 text-white">
          <Bot className="w-10 h-10" />
        </div>
        
        {/* Right */}
        <div className="absolute inset-0 w-full h-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center transform translate-x-30 -rotate-y-90 text-white">
          <Layers className="w-10 h-10" />
        </div>
        
        {/* Top */}
        <div className="absolute inset-0 w-full h-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center transform -translate-y-30 rotate-x-90 text-white">
          <Globe className="w-10 h-10" />
        </div>
        
        {/* Bottom */}
        <div className="absolute inset-0 w-full h-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center transform translate-y-30 -rotate-x-90 text-white">
          <Github className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
};

// Animated text reveal effect
const AnimatedText = ({ text, delay = 0, className = "" }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div 
        className="animate-reveal-text"
        style={{ animationDelay: `${delay}ms` }}
      >
        {text}
      </div>
    </div>
  );
};

// Animated skill bar
const AnimatedSkillBar = ({ skill, percentage, delay = 0 }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-white">{skill}</span>
        <span className="text-sm font-medium text-gray-400">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className="h-2.5 rounded-full bg-gradient-to-r from-primary to-indigo-400"
          style={{ 
            width: `${percentage}%`,
            animation: 'skillBarFill 1.5s ease-out forwards',
            animationDelay: `${delay}ms`
          }}
        ></div>
      </div>
    </div>
  );
};

// Main component
const AnimatedVisualHeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  // 3D tilt effect based on mouse position
  const calculateTilt = () => {
    const tiltX = (mousePosition.y - 0.5) * 10;
    const tiltY = (mousePosition.x - 0.5) * 10;
    
    return {
      transform: `perspective(1000px) rotateX(${-tiltX}deg) rotateY(${tiltY}deg) scale3d(1, 1, 1)`
    };
  };
  
  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden bg-gray-950 text-white flex items-center justify-center"
    >
      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes reveal {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
        
        @keyframes fadeScale {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes skillBarFill {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        .animate-reveal-text {
          transform: translateY(100%);
          animation: reveal 0.8s cubic-bezier(0.5, 0, 0.1, 1) forwards;
        }
        
        .animate-fade-scale {
          animation: fadeScale 1s ease-out forwards;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .translate-z-30 {
          transform: translateZ(30px);
        }
        
        .-translate-z-30 {
          transform: translateZ(-30px);
        }
        
        .translate-x-30 {
          transform: translateX(30px);
        }
        
        .-translate-x-30 {
          transform: translateX(-30px);
        }
        
        .translate-y-30 {
          transform: translateY(30px);
        }
        
        .-translate-y-30 {
          transform: translateY(-30px);
        }
        
        .rotate-y-90 {
          transform: rotateY(90deg);
        }
        
        .-rotate-y-90 {
          transform: rotateY(-90deg);
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .rotate-x-90 {
          transform: rotateX(90deg);
        }
        
        .-rotate-x-90 {
          transform: rotateX(-90deg);
        }
      `}</style>
      
      {/* Particle background effect */}
      <ParticleField />
      
      {/* Dynamic gradient background */}
      <div 
        className="absolute inset-0 opacity-50 bg-gradient-to-br from-indigo-900 via-violet-900 to-gray-900"
        style={{ 
          backgroundSize: '400% 400%',
          animation: 'gradientFlow 15s ease infinite'
        }}
      ></div>
      
      {/* Animated glow orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/30 filter blur-[100px]"
        style={{ animation: 'float 6s ease-in-out infinite' }}
      ></div>
      
      <div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/20 filter blur-[120px]"
        style={{ animation: 'float 8s ease-in-out infinite 1s' }}
      ></div>
      
      {/* Main content container */}
      <div className="container mx-auto px-4 py-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Developer badge */}
            <div 
              className={`inline-block ${isLoaded ? 'animate-fade-scale' : 'opacity-0'}`}
              style={{ animationDelay: '300ms' }}
            >
              <div className="flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <span className="flex h-3 w-3 relative mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-sm font-medium">Full-Stack Developer & Designer</span>
              </div>
            </div>
            
            {/* Headline with animated text */}
            <div className="space-y-2">
              <AnimatedText 
                text="Creating digital experiences" 
                delay={500}
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
              />
              <AnimatedText 
                text="with code and creativity" 
                delay={700}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400"
              />
            </div>
            
            {/* Description with animation */}
            <div 
              className={`max-w-xl ${isLoaded ? 'animate-fade-scale' : 'opacity-0'}`}
              style={{ animationDelay: '900ms' }}
            >
              <p className="text-lg text-gray-300">
                I build immersive digital solutions that combine cutting-edge technology with 
                stunning visuals. My approach merges technical expertise with creative design 
                to deliver exceptional user experiences.
              </p>
            </div>
            
            {/* Animated skill bars */}
            <div 
              className={`pt-4 ${isLoaded ? 'animate-fade-scale' : 'opacity-0'}`}
              style={{ animationDelay: '1100ms' }}
            >
              <h3 className="text-lg font-medium mb-4">Technical Expertise</h3>
              <div className="space-y-4">
                <AnimatedSkillBar skill="Frontend Development" percentage={95} delay={1300} />
                <AnimatedSkillBar skill="Backend Development" percentage={85} delay={1500} />
                <AnimatedSkillBar skill="UI/UX Design" percentage={90} delay={1700} />
                <AnimatedSkillBar skill="3D & Animation" percentage={80} delay={1900} />
              </div>
            </div>
            
            {/* CTA buttons with hover effects */}
            <div 
              className={`flex flex-wrap gap-4 pt-2 ${isLoaded ? 'animate-fade-scale' : 'opacity-0'}`}
              style={{ animationDelay: '1300ms' }}
            >
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-indigo-600 border-0 text-white hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  Explore Work
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-gray-700 text-white hover:border-primary hover:text-primary transition-all duration-300"
              >
                <span className="flex items-center">
                  Contact Me
                </span>
              </Button>
            </div>
            
            {/* Social links with animation */}
            <div 
              className={`flex gap-4 pt-2 ${isLoaded ? 'animate-fade-scale' : 'opacity-0'}`}
              style={{ animationDelay: '1500ms' }}
            >
              <a 
                href="#" 
                className="group w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 hover:text-white hover:border-primary/50 transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
                <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">GitHub</span>
              </a>
              
              <a 
                href="#" 
                className="group w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 hover:text-white hover:border-primary/50 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
                <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">LinkedIn</span>
              </a>
              
              <a 
                href="#" 
                className="group w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 hover:text-white hover:border-primary/50 transition-all duration-300 hover:scale-110"
                aria-label="Portfolio"
              >
                <ExternalLink className="w-5 h-5" />
                <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Portfolio</span>
              </a>
            </div>
          </div>
          
          {/* Right column - Visual elements */}
          <div className="lg:col-span-5">
            {/* 3D tilting card */}
            <div 
              className={`p-1 rounded-2xl bg-gradient-to-br from-primary/50 via-purple-500/50 to-indigo-600/50 backdrop-blur-xl overflow-hidden transition-all duration-200 ${isLoaded ? 'animate-fade-scale' : 'opacity-0'}`}
              style={{ 
                animationDelay: '800ms',
                ...calculateTilt()
              }}
            >
              <div className="bg-gray-900/90 backdrop-blur-xl p-8 rounded-xl h-full">
                <div className="space-y-8">
                  {/* 3D rotating cube */}
                  <div className="flex justify-center py-6">
                    <RotatingCube />
                  </div>
                  
                  {/* Featured project highlight */}
                  <div>
                    <h3 className="text-xl font-medium mb-4 flex items-center">
                      <span className="mr-2">Featured Project</span>
                      <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">Latest</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium">Immersive Portfolio Experience</h4>
                        <p className="text-gray-400 mt-1">
                          Interactive 3D portfolio showcasing projects with advanced animations and WebGL effects
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-xs font-medium bg-white/5 text-gray-300 rounded-md">React</span>
                        <span className="px-2 py-1 text-xs font-medium bg-white/5 text-gray-300 rounded-md">Three.js</span>
                        <span className="px-2 py-1 text-xs font-medium bg-white/5 text-gray-300 rounded-md">GSAP</span>
                        <span className="px-2 py-1 text-xs font-medium bg-white/5 text-gray-300 rounded-md">TypeScript</span>
                      </div>
                      
                      <div className="pt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-primary hover:text-primary/90 hover:bg-primary/10 -ml-3 group"
                        >
                          <span className="flex items-center">
                            View Project
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating code snippet */}
            <div 
              className={`absolute -right-12 top-1/4 max-w-[200px] p-4 rounded-lg bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 text-xs font-mono text-gray-300 ${isLoaded ? 'animate-fade-scale' : 'opacity-0'}`}
              style={{ 
                animation: 'float 6s ease-in-out infinite 0.5s, fadeScale 1s ease-out forwards',
                animationDelay: '1200ms'
              }}
            >
              <pre className="language-javascript">
                <code>
{`const createExperience = () => {
  return {
    design: "stunning",
    code: "clean",
    experience: "immersive"
  };
};`}
                </code>
              </pre>
            </div>
            
            {/* Floating metrics card */}
            <div 
              className={`absolute -left-8 bottom-1/4 p-4 rounded-lg bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 ${isLoaded ? 'animate-fade-scale' : 'opacity-0'}`}
              style={{ 
                animation: 'float 7s ease-in-out infinite 1s, fadeScale 1s ease-out forwards',
                animationDelay: '1400ms'
              }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5+</div>
                <div className="text-xs text-gray-400">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
        <div className="flex flex-col items-center">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-primary/50"></div>
          <div 
            className="mt-2 text-sm text-gray-400 opacity-70"
            style={{ animation: 'pulse 3s infinite' }}
          >
            Scroll to explore
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedVisualHeroSection;