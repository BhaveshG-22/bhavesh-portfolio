// AlternativeHeroSection.tsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ChevronRight, 
  Github, 
  Linkedin, 
  Twitter, 
  ExternalLink,
  Code2,
  Sparkles,
  Monitor
} from "lucide-react";

// Helper function to create element with custom props
const createElement = (type, props = {}, ...children) => {
  return React.createElement(type, props, ...children);
};

// Custom text scramble effect component
const TextScramble = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  const ref = useRef(null);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    let iteration = 0;
    let originalText = text;
    
    clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setDisplayText(prevText => {
        return originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
      });
      
      if (iteration >= originalText.length) {
        clearInterval(intervalRef.current);
      }
      
      iteration += 1 / 3;
    }, 30);
    
    return () => clearInterval(intervalRef.current);
  }, [text]);
  
  return createElement("span", { ref }, displayText);
};

// Main component
const AlternativeHeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  
  // Custom hooks for animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  // Terminal animation text items
  const [terminalIndex, setTerminalIndex] = useState(0);
  const terminalTexts = [
    "npx create-next-app@latest my-portfolio",
    "npm run dev -- --turbo",
    "git push origin main",
    "npm run build"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTerminalIndex(prev => (prev + 1) % terminalTexts.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  // 3D tilt effect styles based on mouse position
  const getTiltStyle = () => {
    const maxTilt = 6; // max tilt in degrees
    
    return {
      transform: `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * -maxTilt}deg) rotateY(${(mousePosition.x - 0.5) * maxTilt}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: "transform 0.1s ease"
    };
  };
  
  // Custom CSS
  const styles = `
    @keyframes fadeUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    
    @keyframes floatSlow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
    
    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    
    .noise-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.05;
      z-index: 1;
    }
    
    .glassmorphism {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    
    .text-gradient {
      background-size: 200% auto;
      background-image: linear-gradient(to right, var(--primary) 0%, var(--accent) 50%, var(--primary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientMove 4s linear infinite;
    }
    
    .code-typing {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      border-right: 3px solid var(--primary);
      animation: typewriter 4s steps(40) infinite, blink 1s step-end infinite;
    }
    
    .grid-bg {
      background-size: 30px 30px;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    }
    
    .animate-delay-100 { animation-delay: 100ms; }
    .animate-delay-200 { animation-delay: 200ms; }
    .animate-delay-300 { animation-delay: 300ms; }
    .animate-delay-400 { animation-delay: 400ms; }
    .animate-delay-500 { animation-delay: 500ms; }
  `;
  
  // CSS variables for dynamic styling
  const cssVars = {
    "--mouse-x": mousePosition.x,
    "--mouse-y": mousePosition.y,
  };
  
  // Animated dots for loading effect
  const dots = Array(3).fill().map((_, i) => {
    return createElement("span", {
      key: `dot-${i}`,
      className: "inline-block w-2 h-2 rounded-full bg-primary mx-[1px]",
      style: { 
        animationName: "pulse",
        animationDuration: "1s",
        animationIterationCount: "infinite",
        animationDelay: `${i * 0.2}s`
      }
    });
  });
  
  // Create the 3D card that follows mouse movement
  const create3DCard = () => {
    return createElement("div", {
      key: "card-3d",
      className: "glassmorphism relative rounded-2xl overflow-hidden w-full h-full",
      style: getTiltStyle()
    }, [
      // Glow effect that follows cursor
      createElement("div", {
        key: "glow",
        className: "absolute pointer-events-none",
        style: {
          background: "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.6) 0%, transparent 50%)",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          left: `calc(${mousePosition.x * 100}% - 75px)`,
          top: `calc(${mousePosition.y * 100}% - 75px)`,
          opacity: 0.3,
          filter: "blur(20px)",
          transition: "left 0.2s, top 0.2s",
          mixBlendMode: "screen",
        }
      }),
      
      // Terminal header
      createElement("div", {
        key: "terminal-header",
        className: "bg-black/70 p-2 border-b border-gray-700 flex items-center"
      }, [
        createElement("div", {
          key: "dots",
          className: "flex gap-1.5"
        }, [
          createElement("div", { key: "dot-1", className: "w-3 h-3 rounded-full bg-red-500" }),
          createElement("div", { key: "dot-2", className: "w-3 h-3 rounded-full bg-yellow-500" }),
          createElement("div", { key: "dot-3", className: "w-3 h-3 rounded-full bg-green-500" })
        ]),
        createElement("div", {
          key: "title",
          className: "mx-auto text-xs text-gray-400"
        }, "~/portfolio")
      ]),
      
      // Terminal body
      createElement("div", {
        key: "terminal-body",
        className: "bg-black/80 p-6 font-mono text-sm h-[calc(100%-40px)] overflow-hidden"
      }, [
        createElement("div", {
          key: "welcome",
          className: `mb-4 text-gray-400 ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`
        }, [
          createElement("span", { key: "line-1", className: "block mb-1 text-green-400" }, "// Welcome to my portfolio"),
          createElement("span", { key: "line-2", className: "block mb-1" }, "// Crafting digital experiences with code")
        ]),
        
        createElement("div", {
          key: "command-line",
          className: `flex items-start mb-6 ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500 delay-300`
        }, [
          createElement("span", { key: "prompt", className: "text-green-400 mr-2" }, "➜"),
          createElement("span", { key: "path", className: "text-blue-400 mr-2" }, "~/portfolio"),
          createElement(TextScramble, { key: "command", text: terminalTexts[terminalIndex] })
        ]),
        
        // Project preview
        createElement("div", {
          key: "project-preview",
          className: `mt-6 ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-700 delay-500`
        }, [
          createElement("div", {
            key: "preview-header",
            className: "text-gray-400 mb-2 flex items-center"
          }, [
            createElement(Code2, { key: "code-icon", className: "w-4 h-4 mr-2 text-primary" }),
            "Latest Projects:"
          ]),
          
          createElement("div", {
            key: "projects",
            className: "space-y-2"
          }, [
            createElement("div", {
              key: "project-1",
              className: "bg-gray-800/50 p-3 rounded-md border border-gray-700/50 hover:border-primary/50 transition-all cursor-pointer flex justify-between items-center"
            }, [
              createElement("div", { key: "project-info" }, [
                createElement("div", { key: "project-name", className: "font-medium text-white" }, "Portfolio Website"),
                createElement("div", { key: "project-tech", className: "text-xs text-gray-400" }, "Next.js • TypeScript • Tailwind")
              ]),
              createElement(ChevronRight, { key: "chevron", className: "w-4 h-4 text-gray-400" })
            ]),
            
            createElement("div", {
              key: "project-2",
              className: "bg-gray-800/50 p-3 rounded-md border border-gray-700/50 hover:border-primary/50 transition-all cursor-pointer flex justify-between items-center"
            }, [
              createElement("div", { key: "project-info" }, [
                createElement("div", { key: "project-name", className: "font-medium text-white" }, "E-commerce App"),
                createElement("div", { key: "project-tech", className: "text-xs text-gray-400" }, "React • Node.js • MongoDB")
              ]),
              createElement(ChevronRight, { key: "chevron", className: "w-4 h-4 text-gray-400" })
            ])
          ])
        ])
      ])
    ]);
  };
  
  // Create social links with hover effects
  const createSocialLinks = () => {
    const socialIcons = [
      { icon: Github, href: "#", label: "GitHub" },
      { icon: Linkedin, href: "#", label: "LinkedIn" },
      { icon: Twitter, href: "#", label: "Twitter" }
    ];
    
    return createElement("div", {
      key: "social-links",
      className: `flex gap-4 ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-700 delay-700`
    }, 
      socialIcons.map((social, index) => 
        createElement("a", {
          key: `social-${index}`,
          href: social.href,
          className: "w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-gray-300 hover:text-white hover:border-primary/50 transition-all hover:scale-110",
          "aria-label": social.label
        }, 
          createElement(social.icon, { className: "w-5 h-5" })
        )
      )
    );
  };
  
  // Build the complete component with React.createElement
  return createElement("div", {
    key: "hero-container",
    ref: heroRef,
    id: "hero",
    className: "relative min-h-screen flex items-center py-20 overflow-hidden",
    style: cssVars
  }, [
    // Background elements
    createElement("div", {
      key: "bg-gradient",
      className: "absolute inset-0 bg-gradient-to-br from-black to-gray-900 z-0"
    }),
    
    createElement("div", {
      key: "noise-overlay",
      className: "noise-bg"
    }),
    
    createElement("div", {
      key: "grid-overlay",
      className: "absolute inset-0 grid-bg z-0"
    }),
    
    // Glowing orbs
    createElement("div", {
      key: "orb-1",
      className: "absolute top-[10%] left-[20%] w-80 h-80 rounded-full bg-primary/20 filter blur-[100px] opacity-60 animate-floatSlow z-0"
    }),
    
    createElement("div", {
      key: "orb-2",
      className: "absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full bg-accent/20 filter blur-[120px] opacity-50 animate-floatSlow z-0",
      style: { animationDelay: "2s" }
    }),
    
    // Main content wrapper
    createElement("div", {
      key: "content-wrapper",
      className: "container mx-auto px-4 relative z-10"
    }, [
      // Two column layout
      createElement("div", {
        key: "two-col-layout",
        className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      }, [
        // Left column (Text content)
        createElement("div", {
          key: "left-column",
          className: "space-y-8"
        }, [
          createElement("div", {
            key: "badge",
            className: `inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-500`,
            style: isLoaded ? { animation: "fadeUp 0.6s ease forwards" } : {}
          }, [
            createElement(Sparkles, { key: "icon", className: "w-3.5 h-3.5 mr-2" }),
            "Full-Stack Developer"
          ]),
          
          createElement("h1", {
            key: "heading",
            className: `text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-500 delay-100`,
            style: isLoaded ? { animation: "fadeUp 0.6s ease forwards", animationDelay: "100ms" } : {}
          }, [
            "Building ",
            createElement("span", { key: "gradient-text", className: "text-gradient" }, "exceptional"),
            createElement("br", { key: "br" }),
            "digital experiences"
          ]),
          
          createElement("p", {
            key: "description",
            className: `text-lg text-gray-300 max-w-xl ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-500 delay-200`,
            style: isLoaded ? { animation: "fadeUp 0.6s ease forwards", animationDelay: "200ms" } : {}
          }, "I create responsive, high-performance web applications with modern technologies. Specializing in crafting beautiful interfaces and seamless user experiences."),
          
          createElement("div", {
            key: "buttons",
            className: `flex flex-wrap gap-4 ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-500 delay-300`,
            style: isLoaded ? { animation: "fadeUp 0.6s ease forwards", animationDelay: "300ms" } : {}
          }, [
            createElement(Button, {
              key: "primary-btn",
              asChild: true,
              size: "lg",
              className: "relative overflow-hidden group bg-gradient-to-r from-primary to-accent text-white font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            }, 
              createElement("a", {
                href: "#projects",
                className: "flex items-center"
              }, [
                createElement(Monitor, { key: "icon", className: "mr-2 h-4 w-4" }),
                "Explore Projects",
                createElement(ArrowRight, { key: "arrow", className: "ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" })
              ])
            ),
            
            createElement(Button, {
              key: "secondary-btn",
              variant: "outline",
              size: "lg",
              asChild: true,
              className: "border-gray-600 hover:border-white text-gray-200 hover:text-white transition-all duration-300"
            }, 
              createElement("a", {
                href: "#contact",
                className: "flex items-center"
              }, "Get in Touch")
            )
          ]),
          
          // Social links
          createSocialLinks()
        ]),
        
        // Right column (3D Card)
        createElement("div", {
          key: "right-column",
          className: `w-full h-[450px] ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-700 delay-500`,
          style: isLoaded ? { animation: "fadeIn 0.8s ease forwards", animationDelay: "500ms" } : {}
        }, create3DCard())
      ])
    ]),
    
    // CSS styles
    createElement("style", {
      key: "custom-styles", 
      dangerouslySetInnerHTML: { __html: styles }
    })
  ]);
};

export default AlternativeHeroSection;