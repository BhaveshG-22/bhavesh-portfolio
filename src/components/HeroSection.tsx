// ModernHeroSection.tsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Github, 
  Linkedin, 
  Twitter, 
  Code, 
  Rocket,
  Cpu,
  Layers,
  MessageCircle
} from "lucide-react";

// GlitchText component for text animation effect
const GlitchText = ({ text, className = "" }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  
  const glitchChars = "_/\\[]{}=+*^?#";
  
  useEffect(() => {
    const triggerGlitch = () => {
      if (!isGlitching) {
        setIsGlitching(true);
        
        // Start glitching
        let iteration = 0;
        const maxIterations = text.length * 2;
        
        intervalRef.current = setInterval(() => {
          setDisplayText(
            text
              .split("")
              .map((char, idx) => {
                if (char === " ") return " ";
                
                // Gradually reveal correct characters
                if (idx < iteration / 2) {
                  return text[idx];
                }
                
                // Random character for glitch effect
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
              })
              .join("")
          );
          
          if (iteration >= maxIterations) {
            clearInterval(intervalRef.current);
            setDisplayText(text);
            setIsGlitching(false);
            
            // Schedule next glitch
            timeoutRef.current = setTimeout(triggerGlitch, Math.random() * 10000 + 5000);
          }
          
          iteration++;
        }, 50);
      }
    };
    
    // Initial delay before first glitch
    timeoutRef.current = setTimeout(triggerGlitch, 2000);
    
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [text, isGlitching]);
  
  return <span className={className}>{displayText}</span>;
};

// Modern Hero Section Component
const ModernHeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const containerRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  // Handle loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCursorPosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Animated skill items
  const skills = [
    { name: "React", years: 4, icon: <Layers className="w-4 h-4" /> },
    { name: "Node.js", years: 3, icon: <Cpu className="w-4 h-4" /> },
    { name: "TypeScript", years: 3, icon: <Code className="w-4 h-4" /> },
    { name: "UI/UX", years: 4, icon: <Rocket className="w-4 h-4" /> }
  ];
  
  // Project showcase items
  const projects = [
    {
      title: "E-commerce Platform",
      description: "A modern online shopping experience with React and Node.js",
      tags: ["React", "Node.js", "MongoDB"],
      progress: 100
    },
    {
      title: "Portfolio Template",
      description: "Customizable developer portfolio with Next.js and Tailwind",
      tags: ["Next.js", "TypeScript", "Tailwind"],
      progress: 100
    },
    {
      title: "Dashboard UI",
      description: "Admin dashboard with data visualization and user management",
      tags: ["React", "Redux", "Chart.js"],
      progress: 85
    }
  ];
  
  // Terminal commands for the animated terminal
  const terminalCommands = [
    { command: "cd ~/projects", output: "" },
    { command: "ls -la", output: "portfolio  e-commerce  dashboard  blog  api" },
    { command: "git status", output: "On branch main\nYour branch is up to date with 'origin/main'.\nnothing to commit, working tree clean" },
    { command: "npm run build", output: "Building project...\nOptimizing assets...\nGenerated build files.\n✓ Build complete!" }
  ];
  
  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
      
      {/* Interactive gradient background */}
      <div 
        className="absolute inset-0 opacity-50 pointer-events-none" 
        style={{
          background: `radial-gradient(circle at ${cursorPosition.x}% ${cursorPosition.y}%, rgba(99, 102, 241, 0.15), transparent 40%)`,
          transition: "background 0.3s ease"
        }}
      ></div>
      
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0zMCAzMG0tMjkgMGEyOSAyOSAwIDEgMCA1OCAwYTI5IDI5IDAgMSAwLTU4IDB6Ii8+PC9nPjwvc3ZnPg==')]"></div>
      </div>
      
      {/* Main content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Column - Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            {/* Badge */}
            <div 
              className={`inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Rocket className="w-3.5 h-3.5 mr-2" />
              <span>Full-Stack Developer</span>
            </div>
            
            {/* Main Heading */}
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-bold transition-all duration-1000 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <GlitchText 
                text="Transforming ideas" 
                className="block"
              />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                into digital reality
              </span>
            </h1>
            
            {/* Description */}
            <p 
              className={`text-lg text-gray-300 max-w-xl transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              I build beautiful, accessible, and performance-focused web applications that deliver exceptional user experiences and solve real business problems.
            </p>
            
            {/* Tab Navigation */}
            <div 
              className={`flex space-x-1 rounded-lg bg-gray-900/50 p-1 backdrop-blur-sm border border-gray-800 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              {[
                { id: 'about', label: 'About', icon: <Cpu className="w-4 h-4 mr-2" /> },
                { id: 'skills', label: 'Skills', icon: <Code className="w-4 h-4 mr-2" /> },
                { id: 'projects', label: 'Projects', icon: <Layers className="w-4 h-4 mr-2" /> },
                { id: 'contact', label: 'Contact', icon: <MessageCircle className="w-4 h-4 mr-2" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div 
              className={`min-h-[200px] transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              {/* About Tab */}
              {activeTab === 'about' && (
                <div className="space-y-4">
                  <p className="text-gray-300">
                    I'm a passionate developer with expertise in creating responsive web applications
                    using modern frameworks and technologies. With a strong foundation in UI/UX principles,
                    I strive to build products that are both functional and beautiful.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-6">
                    <Button 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white group"
                      size="lg"
                    >
                      View Resume
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white"
                      size="lg"
                    >
                      Contact Me
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skill, index) => (
                    <div 
                      key={skill.name} 
                      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 hover:border-indigo-500/50 transition-all"
                      style={{ 
                        animationDelay: `${index * 150}ms`,
                        animation: 'fadeIn 0.5s ease forwards'
                      }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="p-2 rounded-md bg-indigo-500/10 text-indigo-400 mr-3">
                          {skill.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{skill.name}</h3>
                          <p className="text-xs text-gray-400">{skill.years} years experience</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" 
                          style={{ width: `${Math.min(skill.years * 25, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div 
                      key={project.title}
                      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 hover:border-indigo-500/50 transition-all"
                      style={{ 
                        animationDelay: `${index * 150}ms`,
                        animation: 'fadeIn 0.5s ease forwards'
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white">{project.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                        </div>
                        <div className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full px-2 py-1">
                          {project.progress}%
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-1.5 mt-4">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <p className="text-gray-300">
                    Feel free to reach out for collaborations or just a friendly chat about tech, design, or anything else.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-500/10 rounded-md flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <a href="mailto:hello@example.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        hello@example.com
                      </a>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-500/10 rounded-md flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300">
                        San Francisco, CA
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 mt-6">
                    <a 
                      href="#" 
                      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a 
                      href="#" 
                      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href="#" 
                      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Terminal */}
          <div 
            className={`w-full lg:w-1/2 h-[500px] transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="w-full h-full rounded-xl overflow-hidden backdrop-blur-sm border border-gray-800 shadow-2xl shadow-purple-900/10 relative">
              {/* Terminal header */}
              <div className="bg-gray-900 border-b border-gray-800 p-3 flex items-center">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 text-center text-sm text-gray-500 font-mono">
                  ~/portfolio — zsh
                </div>
              </div>
              
              {/* Terminal body */}
              <div 
                className="bg-gray-950 h-[calc(100%-44px)] p-4 font-mono text-sm overflow-y-auto"
                style={{
                  boxShadow: "inset 0 0 60px rgba(99, 102, 241, 0.1)"
                }}
              >
                {terminalCommands.map((item, index) => (
                  <div 
                    key={index} 
                    className={`mb-4 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDelay: `${800 + index * 300}ms` }}
                  >
                    <div className="flex">
                      <span className="text-green-400 mr-2">➜</span>
                      <span className="text-blue-400 mr-2">~/portfolio</span>
                      <span className="text-white">{item.command}</span>
                    </div>
                    {item.output && (
                      <div className="text-gray-400 mt-1 whitespace-pre-line ml-5">
                        {item.output}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Current command with blinking cursor */}
                <div className={`flex transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${800 + terminalCommands.length * 300}ms` }}>
                  <span className="text-green-400 mr-2">➜</span>
                  <span className="text-blue-400 mr-2">~/portfolio</span>
                  <span className="text-white">npm start</span>
                  <span className="w-2 h-4 bg-white ml-1 animate-pulse"></span>
                </div>
              </div>
              
              {/* Terminal reflection effect */}
              <div 
                className="absolute left-0 right-0 bottom-0 h-1/2 bg-gradient-to-t from-indigo-500/10 to-transparent pointer-events-none opacity-50"
              ></div>
            </div>
          </div>
        </div>
        
        {/* Social Icons Fixed */}
        <div 
          className={`fixed left-6 bottom-0 flex flex-col space-y-4 items-center transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <a 
            href="#" 
            className="w-10 h-10 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500 transition-all"
          >
            <Github className="w-5 h-5" />
          </a>
          <a 
            href="#" 
            className="w-10 h-10 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500 transition-all"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a 
            href="#" 
            className="w-10 h-10 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500 transition-all"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <div className="h-20 w-px bg-gradient-to-b from-transparent via-gray-700 to-indigo-500"></div>
        </div>
        
        {/* Email on right side */}
        <div 
          className={`fixed right-6 bottom-0 flex flex-col items-center transition-all duration-1000 delay-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <a 
            href="mailto:hello@example.com" 
            className="text-gray-400 hover:text-indigo-400 tracking-wider text-sm transform rotate-90 origin-bottom-right translate-y-20 hover:translate-y-16 transition-all"
          >
            hello@example.com
          </a>
          <div className="h-20 w-px bg-gradient-to-b from-transparent via-gray-700 to-indigo-500 mt-24"></div>
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes floatAnimation {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ModernHeroSection;