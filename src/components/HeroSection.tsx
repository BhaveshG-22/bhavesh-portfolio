// AlternativeHeroSection.tsx with enhanced terminal
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
  Monitor,
  Terminal,
  Play,
  X,
  CheckCircle2
} from "lucide-react";

// Helper function to create element with custom props
const createElement = (type, props = {}, ...children) => {
  return React.createElement(type, props, ...children);
};

// Enhanced terminal text scramble effect
const TextScramble = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#_$%&";
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

// Cursor blink component for terminal effect
const BlinkingCursor = () => {
  return createElement("span", {
    className: "inline-block w-2 h-4 bg-primary ml-1",
    style: {
      animation: "blink 1s step-end infinite"
    }
  });
};

// Main component
const AlternativeHeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [terminalCommand, setTerminalCommand] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [currentTab, setCurrentTab] = useState("terminal");
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
  
  // Terminal animation sequence
  useEffect(() => {
    if (isLoaded) {
      const commands = [
        { text: "npm install", delay: 800 },
        { text: "npx create-next-app@latest my-portfolio --typescript", delay: 2500 },
        { text: "cd my-portfolio", delay: 1000 },
        { text: "npm run dev -- --turbo", delay: 1500 },
        { text: "git add . && git commit -m \"Initial commit\"", delay: 2000 },
        { text: "git push origin main", delay: 1500 }
      ];
      
      let totalDelay = 1000;
      
      commands.forEach((cmd, index) => {
        // Start typing animation
        setTimeout(() => {
          setIsTyping(true);
          let i = 0;
          const typeInterval = setInterval(() => {
            if (i <= cmd.text.length) {
              setTerminalCommand(cmd.text.substring(0, i));
              i++;
            } else {
              clearInterval(typeInterval);
              setIsTyping(false);
              
              // Add command to history after completing typing
              setTimeout(() => {
                let response = "";
                if (cmd.text.includes("npm install")) {
                  response = "added 1252 packages in 12.5s";
                } else if (cmd.text.includes("create-next-app")) {
                  response = "✅ Creating a new Next.js app in my-portfolio";
                } else if (cmd.text.includes("npm run dev")) {
                  response = "ready - started server on 0.0.0.0:3000";
                } else if (cmd.text.includes("git commit")) {
                  response = "[main (root-commit) 8f23a21] Initial commit";
                } else if (cmd.text.includes("git push")) {
                  response = "Everything up-to-date";
                }
                
                setTerminalHistory(prev => [
                  ...prev, 
                  { 
                    type: "command", 
                    content: cmd.text,
                    timestamp: new Date().toLocaleTimeString()
                  },
                  { 
                    type: "response", 
                    content: response,
                    timestamp: new Date().toLocaleTimeString()
                  }
                ]);
                setTerminalCommand("");
              }, 300);
            }
          }, 20);
        }, totalDelay);
        
        totalDelay += cmd.delay + cmd.text.length * 20 + 600;
      });
    }
  }, [isLoaded]);
  
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
    
    @keyframes scanline {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(100%);
      }
    }
    
    @keyframes glitch {
      0% {
        clip: rect(0, 9999px, 2px, 0);
        transform: skew(0.65deg);
      }
      5% {
        clip: rect(0, 9999px, 42px, 0);
        transform: skew(0.4deg);
      }
      10% {
        clip: rect(0, 9999px, 10px, 0);
        transform: skew(0.25deg);
      }
      15% {
        clip: rect(0, 9999px, 28px, 0);
        transform: skew(0.65deg);
      }
      20% {
        clip: rect(0, 9999px, 16px, 0);
        transform: skew(0.15deg);
      }
      25% {
        clip: rect(0, 9999px, 5px, 0);
        transform: skew(0.55deg);
      }
      30% {
        clip: rect(0, 9999px, 16px, 0);
        transform: skew(0.85deg);
      }
      35% {
        clip: rect(0, 9999px, 25px, 0);
        transform: skew(0.35deg);
      }
      40% {
        clip: rect(0, 9999px, 18px, 0);
        transform: skew(0.45deg);
      }
      45% {
        clip: rect(0, 9999px, 12px, 0);
        transform: skew(0.65deg);
      }
      50% {
        clip: rect(0, 9999px, 2px, 0);
        transform: skew(0.25deg);
      }
      55% {
        clip: rect(0, 9999px, 12px, 0);
        transform: skew(0.65deg);
      }
      60% {
        clip: rect(0, 9999px, 16px, 0);
        transform: skew(0.25deg);
      }
      65% {
        clip: rect(0, 9999px, 38px, 0);
        transform: skew(0.75deg);
      }
      70% {
        clip: rect(0, 9999px, 9px, 0);
        transform: skew(0.35deg);
      }
      75% {
        clip: rect(0, 9999px, 23px, 0);
        transform: skew(0.05deg);
      }
      80% {
        clip: rect(0, 9999px, 13px, 0);
        transform: skew(0.45deg);
      }
      85% {
        clip: rect(0, 9999px, 36px, 0);
        transform: skew(0.2deg);
      }
      90% {
        clip: rect(0, 9999px, 6px, 0);
        transform: skew(0.65deg);
      }
      95% {
        clip: rect(0, 9999px, 42px, 0);
        transform: skew(0.15deg);
      }
      100% {
        clip: rect(0, 9999px, 2px, 0);
        transform: skew(0.65deg);
      }
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
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(55, 65, 81, 0.3);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
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
    
    .scanline {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 10px;
      background: linear-gradient(to bottom, 
        rgba(255,255,255,0) 0%,
        rgba(0,255,196,0.2) 50%, 
        rgba(255,255,255,0) 100%);
      opacity: 0.15;
      animation: scanline 8s linear infinite;
      z-index: 2;
    }
    
    .crt-effect:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
      background-size: 100% 4px;
      pointer-events: none;
      z-index: 10;
      opacity: 0.12;
    }
    
    .terminal-wrapper:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.4) 100%);
      pointer-events: none;
      z-index: 1;
    }
    
    .glitch {
      position: relative;
    }
    
    .glitch:after {
      content: attr(data-text);
      position: absolute;
      left: 0;
      top: 0;
      color: #0fe;
      overflow: hidden;
      clip: rect(0, 900px, 0, 0);
      animation: glitch 2s infinite linear alternate-reverse;
      opacity: 0.8;
    }
    
    .terminal-tabs {
      display: flex;
      background: rgba(17, 24, 39, 0.8);
      border-bottom: 1px solid rgba(75, 85, 99, 0.5);
    }
    
    .terminal-tab {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(209, 213, 219, 0.8);
      border-right: 1px solid rgba(75, 85, 99, 0.3);
      transition: all 0.2s ease;
    }
    
    .terminal-tab.active {
      background: rgba(0, 0, 0, 0.6);
      color: rgba(255, 255, 255, 0.95);
      border-bottom: 2px solid var(--primary);
      margin-bottom: -1px;
    }
    
    .terminal-tab:hover:not(.active) {
      background: rgba(31, 41, 55, 0.5);
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
  
  // Create terminal with enhanced appearance
  const createTerminal = () => {
    return createElement("div", {
      key: "terminal-3d",
      className: "glassmorphism relative rounded-md overflow-hidden w-full h-full crt-effect terminal-wrapper",
      style: getTiltStyle()
    }, [
      // Glow effect that follows cursor
      createElement("div", {
        key: "glow",
        className: "absolute pointer-events-none",
        style: {
          background: "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.4) 0%, transparent 70%)",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          left: `calc(${mousePosition.x * 100}% - 125px)`,
          top: `calc(${mousePosition.y * 100}% - 125px)`,
          opacity: 0.3,
          filter: "blur(30px)",
          transition: "left 0.2s, top 0.2s",
          mixBlendMode: "screen",
          zIndex: 2
        }
      }),
      
      // Scanline effect
      createElement("div", {
        key: "scanline",
        className: "scanline"
      }),
      
      // Terminal tabs
      createElement("div", {
        key: "terminal-tabs",
        className: "terminal-tabs"
      }, [
        createElement("div", {
          key: "tab-terminal",
          className: `terminal-tab ${currentTab === "terminal" ? "active" : ""}`,
          onClick: () => setCurrentTab("terminal")
        }, [
          createElement(Terminal, { key: "icon", className: "w-3.5 h-3.5" }),
          "Terminal"
        ]),
        createElement("div", {
          key: "tab-output",
          className: `terminal-tab ${currentTab === "output" ? "active" : ""}`,
          onClick: () => setCurrentTab("output")
        }, [
          createElement(Play, { key: "icon", className: "w-3.5 h-3.5" }),
          "Output"
        ])
      ]),
      
      // Terminal header
      createElement("div", {
        key: "terminal-header",
        className: "bg-black/90 p-2 flex items-center justify-between"
      }, [
        createElement("div", {
          key: "dots",
          className: "flex gap-1.5"
        }, [
          createElement("div", { 
            key: "dot-1", 
            className: "w-3 h-3 rounded-full bg-red-500 relative group cursor-pointer transition-all hover:brightness-110",
            title: "Close"
          }, [
            createElement(X, { 
              key: "icon", 
              className: "w-2 h-2 absolute inset-0 m-auto text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" 
            })
          ]),
          createElement("div", { 
            key: "dot-2", 
            className: "w-3 h-3 rounded-full bg-yellow-500 relative group cursor-pointer transition-all hover:brightness-110",
            title: "Minimize"
          }, [
            createElement("div", { 
              key: "icon", 
              className: "w-1.5 h-0.5 bg-yellow-900 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity" 
            })
          ]),
          createElement("div", { 
            key: "dot-3", 
            className: "w-3 h-3 rounded-full bg-green-500 relative group cursor-pointer transition-all hover:brightness-110",
            title: "Expand"
          }, [
            createElement(CheckCircle2, { 
              key: "icon", 
              className: "w-2 h-2 absolute inset-0 m-auto text-green-900 opacity-0 group-hover:opacity-100 transition-opacity"
            })
          ])
        ]),
        createElement("div", {
          key: "title",
          className: "absolute left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono tracking-wide",
          "data-text": "~/portfolio",
          style: {
            textShadow: "0 0 2px rgba(0,255,196,0.4), 0 0 4px rgba(0,255,196,0.2)"
          }
        }, "~/portfolio"),
        createElement("div", {
          key: "terminal-date",
          className: "text-xs text-gray-500 font-mono"
        }, new Date().toLocaleTimeString())
      ]),
      
      // Terminal body
      createElement("div", {
        key: "terminal-body",
        className: "bg-black/90 p-4 font-mono text-sm h-[calc(100%-78px)] overflow-auto no-scrollbar relative"
      }, [
        // Conditional content based on selected tab
        currentTab === "terminal" ? [
          // Terminal welcome message
          createElement("div", {
            key: "welcome",
            className: `mb-4 text-gray-400 ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`
          }, [
            createElement("div", { 
              key: "system-info", 
              className: "mb-2 flex flex-col space-y-0.5" 
            }, [
              createElement("span", { 
                key: "line-0", 
                className: "text-green-400 text-base glitch", 
                "data-text": "Welcome to DevTerminal v3.5.0"
              }, "Welcome to DevTerminal v3.5.0"),
              createElement("span", { 
                key: "line-1", 
                className: "text-blue-400 flex items-center text-xs" 
              }, [
                "OS: ", 
                createElement("span", { key: "os", className: "ml-1 text-gray-300" }, "NextOS v14.0.1")
              ]),
              createElement("span", { 
                key: "line-2", 
                className: "text-blue-400 flex items-center text-xs" 
              }, [
                "NODE: ", 
                createElement("span", { key: "node", className: "ml-1 text-gray-300" }, "v18.17.0")
              ]),
              createElement("span", { 
                key: "line-3", 
                className: "text-blue-400 flex items-center text-xs" 
              }, [
                "USER: ", 
                createElement("span", { key: "user", className: "ml-1 text-gray-300" }, "developer@portfolio")
              ])
            ]),
            createElement("div", {
              key: "divider",
              className: "w-full my-2 border-t border-gray-800 opacity-50"
            }),
            createElement("span", { 
              key: "motivation", 
              className: "block mb-1 text-green-400 opacity-80" 
            }, "// Crafting digital experiences with clean code"),
            createElement("span", { 
              key: "hint", 
              className: "block mb-1 text-gray-500 text-xs" 
            }, "// Type 'help' for available commands")
          ]),
          
          // Terminal history (commands and responses)
          ...terminalHistory.map((item, index) => {
            if (item.type === "command") {
              return createElement("div", {
                key: `history-cmd-${index}`,
                className: "flex mb-1 text-gray-300"
              }, [
                createElement("span", { key: "prompt", className: "text-green-400 mr-2" }, "➜"),
                createElement("span", { key: "path", className: "text-blue-400 mr-2" }, "~/portfolio"),
                createElement("span", { key: "command", className: "text-gray-300" }, item.content)
              ]);
            } else {
              return createElement("div", {
                key: `history-resp-${index}`,
                className: "pl-10 mb-2 text-gray-400 text-xs font-light"
              }, item.content);
            }
          }),
          
          // Current command line
          createElement("div", {
            key: "current-command",
            className: "flex items-start"
          }, [
            createElement("span", { key: "prompt", className: "text-green-400 mr-2" }, "➜"),
            createElement("span", { key: "path", className: "text-blue-400 mr-2" }, "~/portfolio"),
            createElement("span", { key: "command-text", className: "text-gray-300" }, terminalCommand),
            !isTyping && createElement(BlinkingCursor, { key: "cursor" })
          ])
        ] : [
          // Output tab content
          createElement("div", {
            key: "output-preview",
            className: "text-sm text-gray-300 bg-gray-900/50 p-4 rounded-md border border-gray-800/50"
          }, [
            createElement("div", {
              key: "preview-header",
              className: "mb-2 text-gray-300 border-b border-gray-700/50 pb-2 flex items-center"
            }, [
              createElement(Monitor, { key: "monitor-icon", className: "w-4 h-4 mr-2 text-primary" }),
              "Development Server"
            ]),
            createElement("div", {
              key: "output-content",
              className: "text-xs text-gray-400 font-mono space-y-1"
            }, [
              createElement("div", { key: "line-1", className: "text-blue-400" }, "ready - started server on 0.0.0.0:3000"),
              createElement("div", { key: "line-2" }, "event - compiled client and server successfully in 248 ms (17 modules)"),
              createElement("div", { key: "line-3", className: "text-green-500" }, "✓ Ready in 352ms")
            ]),
            createElement("div", {
              key: "preview-stats",
              className: "mt-4 grid grid-cols-2 gap-2 text-xs"
            }, [
              createElement("div", {
                key: "stat-1",
                className: "bg-gray-800/50 p-2 rounded-md flex flex-col"
              }, [
                createElement("span", { key: "label", className: "text-gray-500" }, "Build Time"),
                createElement("span", { key: "value", className: "text-white font-medium" }, "352ms")
              ]),
              createElement("div", {
                key: "stat-2",
                className: "bg-gray-800/50 p-2 rounded-md flex flex-col"
              }, [
                createElement("span", { key: "label", className: "text-gray-500" }, "Memory Usage"),
                createElement("span", { key: "value", className: "text-white font-medium" }, "124 MB")
              ]),
              createElement("div", {
                key: "stat-3",
                className: "bg-gray-800/50 p-2 rounded-md flex flex-col"
              }, [
                createElement("span", { key: "label", className: "text-gray-500" }, "Total Size"),
                createElement("span", { key: "value", className: "text-white font-medium" }, "4.2 MB")
              ]),
              createElement("div", {
                key: "stat-4",
                className: "bg-gray-800/50 p-2 rounded-md flex flex-col"
              }, [
                createElement("span", { key: "label", className: "text-gray-500" }, "Status"),
                createElement("span", { key: "value", className: "text-green-400 font-medium flex items-center" }, [
                  createElement(CheckCircle2, { key: "icon", className: "w-3 h-3 mr-1" }),
                  "Online"
                ])
              ])
            ])
          ])
        ]
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
        
        // Right column (Enhanced Terminal)
        createElement("div", {
          key: "right-column",
          className: `w-full h-[500px] ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-700 delay-500`,
          style: isLoaded ? { animation: "fadeIn 0.8s ease forwards", animationDelay: "500ms" } : {}
        }, createTerminal())
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