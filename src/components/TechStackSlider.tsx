
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { FileCode, FileJson, FileType, Bot, Server, Layers, Flame, Code, Cpu, Zap, Star, MousePointer } from "lucide-react";

interface TechItem {
  name: string;
  logo?: React.ReactNode;
  color?: string;
  description?: string;
}

interface SliderProps {
  direction: "ltr" | "rtl";
  speed?: "slow" | "medium" | "fast";
  items: TechItem[];
  variant?: "default" | "glow" | "neon" | "minimal" | "floating" | "glassmorphic";
  showDescription?: boolean;
  autoplay?: boolean;
  className?: string;
}

// Enhanced tech logos with more vibrant color gradients and descriptions
const techLogos: Record<string, {
  icon: React.ReactNode;
  color: string;
  description: string;
}> = {
  "HTML": {
    icon: <FileCode className="h-3 w-3" />,
    color: "bg-gradient-to-r from-orange-600 via-red-500 to-orange-400",
    description: "The standard markup language for web pages"
  },
  "JavaScript": {
    icon: <FileJson className="h-3 w-3" />,
    color: "bg-gradient-to-r from-yellow-500 via-amber-400 to-amber-300",
    description: "The programming language of the web"
  },
  "TypeScript": {
    icon: <FileType className="h-3 w-3" />,
    color: "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400",
    description: "JavaScript with syntax for types"
  },
  "Next.js": {
    icon: <Code className="h-3 w-3" />,
    color: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700",
    description: "React framework for production"
  },
  "React": {
    icon: <Layers className="h-3 w-3" />,
    color: "bg-gradient-to-r from-blue-500 via-cyan-500 to-cyan-400",
    description: "JavaScript library for building user interfaces"
  },
  "TailwindCSS": {
    icon: <Layers className="h-3 w-3" />,
    color: "bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-400",
    description: "Utility-first CSS framework"
  },
  "Prisma": {
    icon: <Code className="h-3 w-3" />,
    color: "bg-gradient-to-r from-green-600 via-green-500 to-emerald-400",
    description: "Next-generation ORM for Node.js and TypeScript"
  },
  "Node.js": {
    icon: <Server className="h-3 w-3" />,
    color: "bg-gradient-to-r from-green-700 via-green-600 to-green-500",
    description: "JavaScript runtime built on Chrome's V8 engine"
  },
  "Firebase": {
    icon: <Flame className="h-3 w-3" />,
    color: "bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400",
    description: "Google's platform for mobile and web apps"
  },
  "Nginx": {
    icon: <Server className="h-3 w-3" />,
    color: "bg-gradient-to-r from-green-500 via-green-400 to-emerald-300",
    description: "High-performance HTTP server and reverse proxy"
  },
  "Express": {
    icon: <Server className="h-3 w-3" />,
    color: "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600",
    description: "Fast, unopinionated web framework for Node.js"
  },
  "TensorFlow": {
    icon: <Bot className="h-3 w-3" />,
    color: "bg-gradient-to-r from-orange-600 via-red-500 to-red-400",
    description: "Open-source machine learning framework"
  }
};

const TechStackSlider = ({
  direction,
  speed = "medium",
  items,
  variant = "default",
  showDescription = false,
  autoplay = true,
  className = ""
}: SliderProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Define animation speed based on prop
  const animationDuration = {
    slow: "40s",
    medium: "25s",
    fast: "15s"
  };
  
  useEffect(() => {
    if (sliderRef.current) {
      const sliderWidth = sliderRef.current.scrollWidth / 2;
      sliderRef.current.style.setProperty('--slider-width', `-${sliderWidth}px`);
      sliderRef.current.style.setProperty('--animation-duration', animationDuration[speed]);
    }
  }, [speed, items]);

  // Duplicate items to create continuous loop
  const allItems = [...items, ...items];

  // Generate badge classes based on variant - removing shadow styles
  const getBadgeClasses = (item: TechItem) => {
    // Reduced padding and focused styles for better fit
    const baseClasses = "px-2 py-1 text-xs font-medium flex items-center gap-1.5 transition-all duration-300";
    const itemName = item.name;
    const itemColor = item.color || techLogos[itemName]?.color || "bg-gradient-to-r from-gray-800 to-gray-600";
    const isActive = activeItem === itemName;
    
    switch (variant) {
      case "glow":
        return `${baseClasses} ${isActive ? 'scale-105' : 'hover:scale-105'} rounded-full ${itemColor} text-white border-none transform`;
      case "neon":
        return `${baseClasses} bg-black/80 text-white border ${isActive ? 'border-current scale-105' : 'border-current/50 hover:border-current hover:scale-105'} rounded-md`;
      case "minimal":
        return `${baseClasses} bg-transparent ${isActive ? 'bg-gray-100 dark:bg-gray-800 scale-105 border-gray-300 dark:border-gray-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 hover:border-gray-300 dark:hover:border-gray-600'} rounded-lg border border-gray-200 dark:border-gray-700`;
      case "floating":
        return `${baseClasses} ${isActive ? 'translate-y-[-4px] scale-105' : 'hover:translate-y-[-4px] hover:scale-105'} bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 transform transition-transform duration-500`;
      case "glassmorphic":
        return `${baseClasses} backdrop-blur-lg bg-white/20 dark:bg-black/20 ${isActive ? 'bg-white/30 dark:bg-black/30 scale-105' : 'hover:bg-white/30 dark:hover:bg-black/30 hover:scale-105'} border border-white/50 dark:border-white/10 rounded-xl`;
      default:
        return `${baseClasses} bg-white/10 backdrop-blur-md dark:bg-black/20 rounded-xl border border-gray-200 dark:border-gray-800 ${isActive ? 'scale-105 border-gray-300 dark:border-gray-700' : 'hover:scale-105 hover:border-gray-300 dark:hover:border-gray-700'}`;
    }
  };
  
  const sliderAnimationClasses = `
    animate-marquee 
    ${direction === "rtl" ? "animate-marquee-reverse" : ""} 
    ${isHovered || !autoplay ? "paused" : "running"}
  `.trim();
  
  const handleItemClick = (name: string) => {
    setActiveItem(activeItem === name ? null : name);
  };
  
  const getDescriptionPanel = () => {
    if (!showDescription || !activeItem) return null;
    const item = techLogos[activeItem];
    if (!item) return null;
    
    return (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 z-20 w-64 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm mb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className={`flex items-center justify-center w-5 h-5 rounded-full ${item.color} text-white`}>
            {item.icon}
          </span>
          <strong>{activeItem}</strong>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-inherit border-r border-b border-gray-200 dark:border-gray-700"></div>
      </div>
    );
  };
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => {
        setIsHovered(false);
        if (!autoplay) setActiveItem(null);
      }} 
      className=""
    >
      {!autoplay && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-1 rounded-full border border-gray-200 dark:border-gray-700">
          <MousePointer className="h-3 w-3" />
          <span>Hover and click to explore</span>
        </div>
      )}
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(var(--slider-width)); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-marquee {
          animation: marquee var(--animation-duration) linear infinite;
        }
        .animate-marquee-reverse {
          animation-direction: reverse;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .paused {
          animation-play-state: paused;
        }
        .running {
          animation-play-state: running;
        }
        .tech-item {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .tech-item:hover {
          z-index: 20;
        }
      `}</style>
      
      <div 
        ref={sliderRef} 
        className={`flex items-center whitespace-nowrap ${sliderAnimationClasses}`} 
        style={{
          animationDuration: animationDuration[speed],
          width: "fit-content"
        }}
      >
        {allItems.map((item, index) => {
          const itemName = item.name;
          const logoInfo = techLogos[itemName] || {
            icon: <Cpu className="h-3 w-3" />,
            color: "bg-gradient-to-r from-gray-800 to-gray-600",
            description: "Technology component"
          };
          const isActive = activeItem === itemName;
          
          return (
            <div 
              key={`${itemName}-${index}`} 
              className={`mx-1.5 tech-item relative ${variant === "floating" && isActive ? "animate-float" : ""}`} 
              onClick={() => handleItemClick(itemName)}
            >
              {showDescription && isActive && getDescriptionPanel()}
              
              <Badge className={getBadgeClasses(item)} variant="outline">
                {variant === "neon" ? (
                  <span className={`flex items-center justify-center w-4 h-4 rounded-full bg-current/20 text-current shrink-0`}>
                    {item.logo || logoInfo.icon}
                  </span>
                ) : (
                  <span className={`flex items-center justify-center w-4 h-4 rounded-full ${variant === "minimal" ? "" : logoInfo.color} text-white shrink-0`}>
                    {item.logo || logoInfo.icon}
                  </span>
                )}
                
                <span className="truncate max-w-[50px] text-xs">{itemName}</span>
                
                {isActive && <Star className="h-2.5 w-2.5 ml-1 text-yellow-400 shrink-0" />}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechStackSlider;
