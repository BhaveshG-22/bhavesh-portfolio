// HeroSection.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Zap, Star, ExternalLink } from "lucide-react";

// Using React.createElement approach to avoid JSX parsing issues
const HeroSection = () => {
  // State for scroll position
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Text typing animation state
  const [textIndex, setTextIndex] = useState(0);
  const textOptions = ["web applications", "user interfaces", "digital experiences", "modern websites"];
  
  // Setup scroll listener and visibility
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
  
  // Text rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % textOptions.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Create CSS for animations using template strings
  const styles = `
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
  `;

  // Create particles array for floating particles
  const particles = Array(10).fill(null).map((_, i) => {
    return React.createElement("span", {
      key: `particle-${i}`,
      className: "particle",
      style: {
        '--particle-size': `${Math.random() * 10 + 5}px`,
        '--particle-opacity': Math.random() * 0.5 + 0.3,
        '--particle-duration': `${Math.random() * 10 + 15}s`,
        '--particle-delay': `${Math.random() * 5}s`,
        '--particle-left': `${Math.random() * 100}%`,
        '--particle-top': `${Math.random() * 100}%`,
      }
    });
  });

  // Create code lines for code editor
  const codeLines = [
    React.createElement("div", { key: "line-1", className: "flex" }, [
      React.createElement("span", { key: "number", className: "text-gray-500 w-6" }, "1"),
      React.createElement("span", { key: "import", className: "text-blue-400" }, "import"),
      React.createElement("span", { key: "react", className: "text-white" }, " React "),
      React.createElement("span", { key: "from", className: "text-blue-400" }, "from"),
      React.createElement("span", { key: "module", className: "text-green-400" }, " 'react'"),
      React.createElement("span", { key: "semi", className: "text-white" }, ";")
    ]),
    
    React.createElement("div", { key: "line-2", className: "flex" }, [
      React.createElement("span", { key: "number", className: "text-gray-500 w-6" }, "2"),
      React.createElement("span", { key: "empty", className: "text-white" }, "")
    ]),
    
    React.createElement("div", { key: "line-3", className: "flex" }, [
      React.createElement("span", { key: "number", className: "text-gray-500 w-6" }, "3"),
      React.createElement("span", { key: "const", className: "text-blue-400" }, "const"),
      React.createElement("span", { key: "name", className: "text-yellow-400" }, " Hero "),
      React.createElement("span", { key: "eq", className: "text-white" }, "= () => {")
    ]),
    
    React.createElement("div", { key: "line-4", className: "flex" }, [
      React.createElement("span", { key: "number", className: "text-gray-500 w-6" }, "4"),
      React.createElement("span", { key: "return", className: "text-white pl-4" }, "return (")
    ]),
    
    React.createElement("div", { key: "line-5", className: "flex" }, [
      React.createElement("span", { key: "number", className: "text-gray-500 w-6" }, "5"),
      React.createElement("span", { key: "div-open", className: "text-white pl-8 text-yellow-300" }, [
        "<",
        React.createElement("span", { key: "tag", className: "text-pink-400" }, "div"),
        " ",
        React.createElement("span", { key: "prop", className: "text-purple-400" }, "className"),
        "=",
        React.createElement("span", { key: "value", className: "text-green-400" }, '"container"'),
        ">"
      ])
    ]),
    
    React.createElement("div", { key: "line-6", className: "flex" }, [
      React.createElement("span", { key: "number", className: "text-gray-500 w-6" }, "6"),
      React.createElement("span", { key: "h1-open", className: "text-white pl-12 text-yellow-300" }, [
        "<",
        React.createElement("span", { key: "tag", className: "text-pink-400" }, "h1"),
        " ",
        React.createElement("span", { key: "prop", className: "text-purple-400" }, "className"),
        "=",
        React.createElement("span", { key: "value", className: "text-green-400" }, '"heading"'),
        ">"
      ]),
      React.createElement("span", { key: "content", className: "text-white animate-typing" }, "Hello, World!"),
      React.createElement("span", { key: "h1-close", className: "text-yellow-300" }, [
        "</",
        React.createElement("span", { key: "tag", className: "text-pink-400" }, "h1"),
        ">"
      ])
    ]),
    
    React.createElement("div", { key: "line-7", className: "flex" }, [
      React.createElement("span", { key: "number", className: "text-gray-500 w-6" }, "7"),
      React.createElement("span", { key: "div-close", className: "text-white pl-8 text-yellow-300" }, [
        "</",
        React.createElement("span", { key: "tag", className: "text-pink-400" }, "div"),
        ">"
      ])
    ]),
    
    React.createElement("div", { key: "line-8", className: "flex" }, [
      React.createElement("span", { key: "number", className: "text-gray-500 w-6" }, "8"),
      React.createElement("span", { key: "parens", className: "text-white pl-4" }, ");")
    ]),
    
    React.createElement("div", { key: "line-9", className: "flex" }, [
      React.createElement("span", { key: "number", className: "text-gray-500 w-6" }, "9"),
      React.createElement("span", { key: "closing", className: "text-white" }, "};")
    ]),
    
    React.createElement("div", { key: "line-10", className: "flex" }, [
      React.createElement("span", { key: "number", className: "text-gray-500 w-6" }, "10"),
      React.createElement("span", { key: "empty", className: "text-white" }, "")
    ]),
    
    React.createElement("div", { key: "line-11", className: "flex" }, [
      React.createElement("span", { key: "number", className: "text-gray-500 w-6" }, "11"),
      React.createElement("span", { key: "export", className: "text-blue-400" }, "export"),
      React.createElement("span", { key: "default", className: "text-blue-400" }, " default"),
      React.createElement("span", { key: "name", className: "text-yellow-400" }, " Hero"),
      React.createElement("span", { key: "semi", className: "text-white" }, ";")
    ]),
    
    React.createElement("div", { 
      key: "terminal",
      className: "h-12 mt-4 bg-portfolio-purple/10 dark:bg-portfolio-purple/5 rounded-md border border-portfolio-purple/30 flex items-center justify-between px-3"
    }, [
      React.createElement("div", { key: "term-left", className: "flex items-center" }, [
        React.createElement("span", { key: "dot", className: "h-2 w-2 bg-green-500 rounded-full mr-2" }),
        React.createElement("span", { key: "label", className: "text-xs text-white/60" }, "Terminal")
      ]),
      React.createElement("span", { key: "term-right", className: "text-white text-xs" }, [
        "npm run dev",
        React.createElement("span", { key: "cursor", className: "animate-blink ml-1" }, "|")
      ])
    ])
  ];

  // Build the complete component using React.createElement
  return React.createElement("div", 
    { 
      id: "hero", 
      className: "relative min-h-screen flex items-center pt-16 overflow-hidden" 
    },
    [
      // Dynamic Background with Parallax Effect
      React.createElement("div", {
        key: "bg-gradient",
        className: "absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 z-0"
      }),
      
      // Animated Orbs
      React.createElement("div", {
        key: "orb-1",
        className: "absolute top-20 right-10 h-72 w-72 bg-primary/20 rounded-full blur-3xl animate-pulse",
        style: { transform: `translateY(${scrollY * 0.1}px)` }
      }),
      
      React.createElement("div", {
        key: "orb-2",
        className: "absolute bottom-20 left-10 h-80 w-80 bg-portfolio-purple/20 rounded-full blur-3xl animate-pulse",
        style: { 
          animationDelay: "1s", 
          transform: `translateY(${-scrollY * 0.05}px)` 
        }
      }),
      
      React.createElement("div", {
        key: "orb-3",
        className: "absolute top-40 left-1/4 h-40 w-40 bg-portfolio-blue/15 rounded-full blur-2xl animate-pulse",
        style: { 
          animationDelay: "2s", 
          transform: `translateY(${scrollY * 0.08}px) translateX(${scrollY * 0.05}px)` 
        }
      }),
      
      // Grid pattern overlay
      React.createElement("div", {
        key: "grid-pattern",
        className: "absolute inset-0 bg-grid-pattern opacity-5 z-1"
      }),
      
      // Floating elements
      React.createElement("div", {
        key: "floating-code",
        className: "absolute hidden lg:block right-[10%] top-[20%] w-16 h-16 bg-gradient-to-tr from-primary to-accent p-3 rounded-lg shadow-xl animate-float opacity-70"
      }, React.createElement(Code, { className: "w-full h-full text-white" })),
      
      React.createElement("div", {
        key: "floating-zap",
        className: "absolute hidden lg:block left-[15%] bottom-[25%] w-10 h-10 bg-gradient-to-tr from-portfolio-purple to-portfolio-blue p-2 rounded-full shadow-xl animate-float-delayed opacity-70"
      }, React.createElement(Zap, { className: "w-full h-full text-white" })),
      
      // Main content container
      React.createElement("div", {
        key: "content-container",
        className: "max-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10"
      }, [
        // Left column - Text content
        React.createElement("div", {
          key: "text-content",
          className: `flex flex-col space-y-8 transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`
        }, [
          // Badge with star
          React.createElement("div", {
            key: "badge-container",
            className: "flex items-center space-x-2"
          }, [
            React.createElement("span", {
              key: "badge",
              className: "text-sm md:text-base font-medium text-primary px-4 py-2 bg-primary/10 rounded-full w-fit backdrop-blur-md border border-primary/20 shadow-sm"
            }, [
              React.createElement("span", {
                key: "status-dot",
                className: "inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"
              }),
              "Full-Stack Web Developer"
            ]),
            React.createElement(Star, {
              key: "star",
              className: "h-5 w-5 text-yellow-400 animate-spin-slow"
            })
          ]),
          
          // Main heading with gradient text
          React.createElement("h1", {
            key: "heading",
            className: "text-4xl md:text-5xl lg:text-7xl font-bold leading-tight"
          }, [
            "Crafting ",
            React.createElement("span", {
              key: "gradient-1",
              className: "bg-gradient-to-r from-primary to-portfolio-purple bg-clip-text text-transparent"
            }, "digital"),
            " ",
            React.createElement("span", {
              key: "gradient-container",
              className: "relative"
            }, [
              React.createElement("span", {
                key: "gradient-2",
                className: "bg-gradient-to-r from-portfolio-purple to-portfolio-blue bg-clip-text text-transparent"
              }, "experiences"),
              React.createElement("svg", {
                key: "underline",
                className: "absolute -bottom-2 left-0 w-full",
                viewBox: "0 0 300 10",
                xmlns: "http://www.w3.org/2000/svg"
              }, [
                React.createElement("path", {
                  key: "path",
                  d: "M3 7c28.6-4.2 77.8-7 147.8-1.6 70 5.3 113.2 4.8 147-1.1",
                  fill: "none",
                  stroke: "url(#gradient)",
                  strokeWidth: "3",
                  strokeLinecap: "round"
                }),
                React.createElement("defs", {
                  key: "defs"
                }, 
                  React.createElement("linearGradient", {
                    key: "gradient",
                    id: "gradient",
                    x1: "0%",
                    y1: "0%",
                    x2: "100%",
                    y2: "0%"
                  }, [
                    React.createElement("stop", {
                      key: "stop1",
                      offset: "0%",
                      stopColor: "var(--primary)"
                    }),
                    React.createElement("stop", {
                      key: "stop2",
                      offset: "100%",
                      stopColor: "var(--accent)"
                    })
                  ])
                )
              ])
            ])
          ]),
          
          // Animated text typing
          React.createElement("div", {
            key: "text-typing",
            className: "text-xl lg:text-2xl font-medium h-8"
          }, [
            "I build ",
            React.createElement("span", {
              key: "typing-container",
              className: "text-primary ml-2 inline-block min-w-40 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary/30"
            }, [
              textOptions[textIndex],
              React.createElement("span", {
                key: "cursor",
                className: "animate-blink ml-1"
              }, "|")
            ])
          ]),
          
          // Paragraph
          React.createElement("p", {
            key: "paragraph",
            className: "text-lg text-foreground/80 max-w-lg"
          }, "I build responsive, performant, and accessible web applications using modern technologies. Let's bring your ideas to life with elegant solutions."),
          
          // Buttons
          React.createElement("div", {
            key: "buttons",
            className: "flex flex-wrap gap-4 pt-4"
          }, [
            React.createElement(Button, {
              key: "primary-button",
              asChild: true,
              size: "lg",
              className: "relative overflow-hidden group bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-lg"
            }, 
              React.createElement("a", {
                href: "#projects",
                className: "px-6 py-3"
              }, [
                React.createElement("span", {
                  key: "button-bg",
                  className: "absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"
                }),
                React.createElement("span", {
                  key: "button-content",
                  className: "relative flex items-center"
                }, [
                  "View My Work",
                  React.createElement(ArrowRight, {
                    key: "arrow",
                    className: "ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  })
                ])
              ])
            ),
            
            React.createElement(Button, {
              key: "secondary-button",
              variant: "outline",
              size: "lg",
              asChild: true,
              className: "relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 dark:bg-black/30 dark:border-white/10 rounded-lg hover:bg-white/20 dark:hover:bg-black/40 transition-all duration-300"
            }, 
              React.createElement("a", {
                href: "#contact",
                className: "px-6 py-3"
              }, "Contact Me")
            )
          ])
        ]),
        
        // Right column - Code editor mockup
        React.createElement("div", {
          key: "code-editor",
          className: `relative w-full h-[400px] lg:h-[550px] p-4 transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`
        }, [
          // Editor glow effect
          React.createElement("div", {
            key: "editor-glow",
            className: "absolute inset-0 bg-gradient-to-tr from-portfolio-blue/40 to-portfolio-purple/40 rounded-2xl opacity-50 blur-xl animate-pulse-slow"
          }),
          
          // Editor border glow
          React.createElement("div", {
            key: "editor-border",
            className: "absolute inset-0 z-0 rounded-2xl overflow-hidden"
          }, 
            React.createElement("div", {
              key: "border-animation",
              className: "absolute -inset-[2px] bg-gradient-to-tr from-portfolio-blue via-primary to-portfolio-purple rounded-2xl animate-gradient-rotation"
            })
          ),
          
          // Editor main container
          React.createElement("div", {
            key: "editor-container",
            className: "absolute inset-1 backdrop-blur-md bg-white/10 dark:bg-black/50 rounded-xl flex items-center justify-center p-8 border border-white/20 dark:border-white/5 shadow-2xl"
          }, 
            React.createElement("div", {
              key: "editor-inner",
              className: "relative w-full h-full bg-black/80 dark:bg-black/90 rounded-lg border border-white/10 p-4 overflow-hidden"
            }, [
              // Window controls (dots)
              React.createElement("div", {
                key: "window-controls",
                className: "absolute top-3 left-3 flex gap-1.5"
              }, [
                React.createElement("div", { key: "red-dot", className: "w-3 h-3 rounded-full bg-red-500" }),
                React.createElement("div", { key: "yellow-dot", className: "w-3 h-3 rounded-full bg-yellow-500" }),
                React.createElement("div", { key: "green-dot", className: "w-3 h-3 rounded-full bg-green-500" })
              ]),
              
              // Filename tab
              React.createElement("div", {
                key: "filename-tab",
                className: "absolute top-2.5 left-0 right-0 flex justify-center"
              }, 
                React.createElement("div", {
                  key: "filename",
                  className: "px-4 py-0.5 text-xs text-white/60 bg-white/5 rounded-md"
                }, "index.tsx")
              ),
              
              // External link button
              React.createElement("div", {
                key: "external-link",
                className: "absolute top-3 right-3 flex gap-1"
              }, 
                React.createElement(Button, {
                  key: "link-button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-6 w-6 rounded-sm bg-white/5 hover:bg-white/10"
                }, 
                  React.createElement(ExternalLink, {
                    key: "link-icon",
                    className: "h-3 w-3 text-white/60"
                  })
                )
              ),
              
              // Code content
              React.createElement("div", {
                key: "code-content",
                className: "mt-10 space-y-3 font-mono text-sm"
              }, codeLines)
            ])
          )
        ])
      ]),
      
      // Floating particles
      React.createElement("div", {
        key: "particles",
        className: "particles"
      }, particles),
      
      // CSS for animations
      React.createElement("style", {
        key: "animation-styles",
        dangerouslySetInnerHTML: { __html: styles }
      })
    ]
  );
};

export default HeroSection;