// CreativeHeroSection.tsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Globe, 
  Layers, 
  Compass, 
  Award,
  Download,
  ExternalLink
} from "lucide-react";

// Creative Hero Section with 3D elements, modern design, and interactive features
const CreativeHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Features list with title and description
  const features = [
    {
      icon: Layers,
      title: "Frontend Development",
      description: "Creating responsive, accessible, and performant user interfaces with modern technologies."
    },
    {
      icon: Globe,
      title: "Backend Solutions",
      description: "Building robust APIs, microservices, and database architectures that scale."
    },
    {
      icon: Compass,
      title: "UI/UX Design",
      description: "Designing intuitive user experiences with a focus on usability and aesthetics."
    },
    {
      icon: Award,
      title: "Performance Optimization",
      description: "Improving application speed, SEO, and overall user experience."
    }
  ];
  
  // Initialize animation and scroll effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    // Feature rotation interval
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);
    
    // Animation for 3D mesh
    let ctx;
    let animation;
    let time = 0;
    let width, height;
    
    // Particle system configuration
    const particleCount = 100;
    const particles = [];
    const maxDistance = 150;
    
    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      ctx = canvas.getContext('2d');
      
      // Set canvas to full size
      const updateSize = () => {
        width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      };
      
      updateSize();
      window.addEventListener('resize', updateSize);
      
      // Initialize particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
        });
      }
      
      // Animation loop
      const animate = () => {
        time += 0.01;
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw particles
        for (let i = 0; i < particleCount; i++) {
          const p = particles[i];
          
          // Move particles
          p.x += p.speedX;
          p.y += p.speedY;
          
          // Wrap around edges
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(var(--primary-rgb), ${0.2 + Math.sin(time) * 0.1})`;
          ctx.fill();
        }
        
        // Draw connections between particles
        ctx.strokeStyle = 'rgba(var(--primary-rgb), 0.15)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < particleCount; i++) {
          for (let j = i + 1; j < particleCount; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
        
        animation = requestAnimationFrame(animate);
      };
      
      animate();
    };
    
    initCanvas();
    
    return () => {
      clearTimeout(timer);
      clearInterval(featureInterval);
      if (animation) {
        cancelAnimationFrame(animation);
      }
      window.removeEventListener('resize', () => {});
    };
  }, []);
  
  // CSS Styles for animation and effects
  const styles = `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    
    @keyframes fadeInUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes shimmer {
      0% { background-position: -500px 0; }
      100% { background-position: 500px 0; }
    }
    
    /* Glow effect classes */
    .glow-effect {
      position: relative;
    }
    
    .glow-effect::before {
      content: '';
      position: absolute;
      inset: -1px;
      background: linear-gradient(90deg, 
        var(--primary), 
        var(--accent), 
        var(--primary)
      );
      background-size: 200% auto;
      border-radius: inherit;
      z-index: -1;
      animation: shimmer 3s linear infinite;
    }
    
    /* Animated text */
    .gradient-text {
      background: linear-gradient(90deg, var(--primary), var(--accent));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-size: 200% auto;
      animation: shimmer 3s linear infinite;
    }
    
    /* Feature card animation */
    .feature-card {
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }
    
    .feature-card:hover {
      transform: translateZ(20px) rotateX(5deg) rotateY(5deg);
    }
    
    /* Animated underline */
    .animated-underline {
      position: relative;
    }
    
    .animated-underline::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--primary);
      transition: width 0.3s ease;
    }
    
    .animated-underline:hover::after {
      width: 100%;
    }
  `;
  
  // Function to create staggered animated elements
  const createAnimatedElement = (tag, props, children, delay = 0) => {
    const animationClass = isVisible ? "opacity-100" : "opacity-0";
    const style = isVisible ? { 
      animation: "fadeInUp 0.8s ease forwards",
      animationDelay: `${delay}ms` 
    } : {};
    
    return React.createElement(
      tag,
      {
        ...props,
        className: `${props.className || ""} ${animationClass} transition-all`,
        style: { ...props.style, ...style }
      },
      children
    );
  };
  
  // Create 3D card component
  const create3DCard = () => {
    return React.createElement("div", {
      key: "3d-card",
      className: "relative rounded-2xl overflow-hidden bg-black/10 backdrop-blur-sm border border-white/10 shadow-xl h-[450px] md:h-[500px] feature-card"
    }, [
      // Canvas for particle network
      React.createElement("canvas", {
        key: "particle-canvas",
        ref: canvasRef,
        className: "absolute inset-0 w-full h-full"
      }),
      
      // Content overlay
      React.createElement("div", {
        key: "card-content",
        className: "absolute inset-0 flex flex-col justify-between p-8"
      }, [
        // Card header
        React.createElement("div", {
          key: "card-header",
          className: "flex justify-between items-start"
        }, [
          React.createElement("div", {
            key: "card-title",
            className: "flex flex-col"
          }, [
            React.createElement("span", {
              key: "title-badge",
              className: "text-xs uppercase tracking-wide text-primary/80 mb-1"
            }, "Portfolio Highlights"),
            React.createElement("h3", {
              key: "card-heading",
              className: "text-xl font-bold"
            }, "Featured Projects")
          ]),
          
          React.createElement(ExternalLink, {
            key: "link-icon",
            className: "w-5 h-5 text-white/50"
          })
        ]),
        
        // Card body with features
        React.createElement("div", {
          key: "feature-section",
          className: "flex-1 flex items-center justify-center"
        }, 
          React.createElement("div", {
            key: "feature-list",
            className: "relative h-[250px] w-full"
          }, 
            features.map((feature, index) => {
              const isActive = index === activeFeature;
              return React.createElement("div", {
                key: `feature-${index}`,
                className: `absolute inset-0 flex flex-col items-center text-center transition-all duration-500 ease-in-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`
              }, [
                React.createElement("div", {
                  key: "icon-container",
                  className: "w-16 h-16 rounded-full bg-gradient-to-tr from-primary/30 to-accent/30 flex items-center justify-center mb-4 glow-effect"
                }, 
                  React.createElement(feature.icon, {
                    key: "feature-icon",
                    className: "w-8 h-8 text-white"
                  })
                ),
                React.createElement("h3", {
                  key: "feature-title",
                  className: "text-xl font-bold mb-2 gradient-text"
                }, feature.title),
                React.createElement("p", {
                  key: "feature-desc",
                  className: "max-w-xs text-white/80 text-sm"
                }, feature.description)
              ]);
            })
          )
        ),
        
        // Card footer
        React.createElement("div", {
          key: "card-footer",
          className: "pt-6 mt-auto"
        }, 
          React.createElement("div", {
            key: "indicator-wrap",
            className: "flex justify-center gap-2"
          }, 
            features.map((_, index) => {
              const isActive = index === activeFeature;
              return React.createElement("button", {
                key: `indicator-${index}`,
                className: `w-2 h-2 rounded-full transition-all ${isActive ? 'bg-primary w-6' : 'bg-white/30'}`,
                onClick: () => setActiveFeature(index)
              });
            })
          )
        )
      ])
    ]);
  };
  
  // Render main component using React.createElement
  return React.createElement("div", {
    key: "hero-container",
    ref: sectionRef,
    id: "hero",
    className: "relative min-h-screen flex items-center py-16 overflow-hidden"
  }, [
    // Background elements
    React.createElement("div", {
      key: "bg-gradient",
      className: "absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0"
    }),
    
    React.createElement("div", {
      key: "circle-1",
      className: "absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/10 filter blur-[100px] opacity-60 animate-pulse z-0"
    }),
    
    React.createElement("div", {
      key: "circle-2",
      className: "absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-accent/10 filter blur-[100px] opacity-50 animate-pulse z-0",
      style: { animationDelay: "1s" }
    }),
    
    // Main content
    React.createElement("div", {
      key: "content-container",
      className: "container mx-auto px-4 relative z-10"
    }, [
      createAnimatedElement("div", {
        key: "two-column-grid",
        className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      }, [
        // Left column - text content
        React.createElement("div", {
          key: "text-column",
          className: "space-y-8"
        }, [
          // Badge
          createAnimatedElement("span", {
            key: "badge",
            className: "inline-flex items-center px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium"
          }, [
            "Developer & Designer",
          ], 100),
          
          // Heading
          createAnimatedElement("h1", {
            key: "heading",
            className: "text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
          }, [
            "Transforming ",
            React.createElement("span", { 
              key: "gradient-text",
              className: "gradient-text"
            }, "ideas"),
            " into ",
            React.createElement("br", { key: "line-break" }),
            "digital reality"
          ], 200),
          
          // Description
          createAnimatedElement("p", {
            key: "description",
            className: "text-lg text-white/80 max-w-xl"
          }, "I build immersive web experiences that seamlessly blend form and function. Specializing in full-stack development with a focus on modern, responsive, and accessible applications.", 300),
          
          // Stats section
          createAnimatedElement("div", {
            key: "stats-section",
            className: "grid grid-cols-3 gap-4 py-4 max-w-md"
          }, [
            React.createElement("div", { 
              key: "stat-1",
              className: "flex flex-col"
            }, [
              React.createElement("span", { 
                key: "stat-number-1",
                className: "text-3xl font-bold text-primary"
              }, "5+"),
              React.createElement("span", { 
                key: "stat-label-1",
                className: "text-sm text-white/60"
              }, "Years Experience")
            ]),
            React.createElement("div", { 
              key: "stat-2",
              className: "flex flex-col"
            }, [
              React.createElement("span", { 
                key: "stat-number-2",
                className: "text-3xl font-bold text-primary"
              }, "50+"),
              React.createElement("span", { 
                key: "stat-label-2",
                className: "text-sm text-white/60"
              }, "Projects Completed")
            ]),
            React.createElement("div", { 
              key: "stat-3",
              className: "flex flex-col"
            }, [
              React.createElement("span", { 
                key: "stat-number-3",
                className: "text-3xl font-bold text-primary"
              }, "10+"),
              React.createElement("span", { 
                key: "stat-label-3",
                className: "text-sm text-white/60"
              }, "Technologies")
            ])
          ], 400),
          
          // Buttons
          createAnimatedElement("div", {
            key: "button-group",
            className: "flex flex-wrap gap-4 pt-4"
          }, [
            React.createElement(Button, {
              key: "primary-button",
              size: "lg",
              className: "glow-effect bg-black text-white hover:text-white transition-all duration-300"
            }, [
              "See My Work",
              React.createElement(ArrowRight, {
                key: "arrow-icon",
                className: "ml-2 h-4 w-4"
              })
            ]),
            
            React.createElement(Button, {
              key: "secondary-button",
              variant: "outline",
              size: "lg",
              className: "border-white/20 hover:border-primary text-white hover:text-primary transition-all duration-300"
            }, [
              React.createElement(Download, {
                key: "download-icon",
                className: "mr-2 h-4 w-4"
              }),
              "Download CV"
            ])
          ], 500),
          
          // Tech badges
          createAnimatedElement("div", {
            key: "tech-badges",
            className: "flex flex-wrap gap-2 pt-6"
          }, [
            "React", "TypeScript", "Next.js", "Node.js", "TailwindCSS"
          ].map((tech, i) => 
            React.createElement("span", {
              key: `tech-${i}`,
              className: "px-3 py-1 text-xs bg-white/10 rounded-full text-white/70 hover:bg-primary/20 hover:text-white cursor-default transition-colors"
            }, tech)
          ), 600)
        ]),
        
        // Right column - 3D interactive card
        createAnimatedElement("div", {
          key: "interactive-column",
          className: "w-full"
        }, create3DCard(), 500)
      ])
    ]),
    
    // CSS styles
    React.createElement("style", {
      key: "hero-styles",
      dangerouslySetInnerHTML: { __html: styles }
    })
  ]);
};

export default CreativeHeroSection;