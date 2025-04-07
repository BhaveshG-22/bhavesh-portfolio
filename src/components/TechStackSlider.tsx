import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  FileCode,
  FileJson,
  FileType,
  Bot,
  Server,
  Layers,
  Flame,
  Code,
  Cpu,
  Zap
} from "lucide-react";

interface TechItem {
  name: string;
  logo?: React.ReactNode;
  color?: string;
}

interface SliderProps {
  direction: "ltr" | "rtl";
  speed?: "slow" | "medium" | "fast";
  items: TechItem[];
  variant?: "default" | "glow" | "neon" | "minimal";
}

// Map of tech names to their corresponding logo components and colors
const techLogos: Record<string, { icon: React.ReactNode; color: string }> = {
  "HTML": { 
    icon: <FileCode className="h-4 w-4" />, 
    color: "bg-gradient-to-r from-orange-600 to-orange-400"
  },
  "JavaScript": { 
    icon: <FileJson className="h-4 w-4" />, 
    color: "bg-gradient-to-r from-yellow-500 to-amber-300" 
  },
  "TypeScript": { 
    icon: <FileType className="h-4 w-4" />, 
    color: "bg-gradient-to-r from-blue-600 to-blue-400" 
  },
  "Next.js": { 
    icon: <Code className="h-4 w-4" />, 
    color: "bg-gradient-to-r from-gray-900 to-gray-700" 
  },
  "React": { 
    icon: <Layers className="h-4 w-4" />, 
    color: "bg-gradient-to-r from-blue-500 to-cyan-400" 
  },
  "TailwindCSS": { 
    icon: <Layers className="h-4 w-4" />, 
    color: "bg-gradient-to-r from-cyan-600 to-cyan-400" 
  },
  "Prisma": { 
    icon: <Code className="h-4 w-4" />, 
    color: "bg-gradient-to-r from-green-600 to-emerald-400" 
  },
  "Node.js": { 
    icon: <Server className="h-4 w-4" />, 
    color: "bg-gradient-to-r from-green-700 to-green-500" 
  },
  "Firebase": { 
    icon: <Flame className="h-4 w-4" />, 
    color: "bg-gradient-to-r from-orange-600 to-yellow-400" 
  },
  "Nginx": { 
    icon: <Server className="h-4 w-4" />, 
    color: "bg-gradient-to-r from-green-500 to-emerald-300" 
  },
  "Express": { 
    icon: <Server className="h-4 w-4" />, 
    color: "bg-gradient-to-r from-gray-800 to-gray-600" 
  },
  "TensorFlow": { 
    icon: <Bot className="h-4 w-4" />, 
    color: "bg-gradient-to-r from-orange-600 to-red-400" 
  },
};

const TechStackSlider = ({ 
  direction, 
  speed = "medium", 
  items,
  variant = "default" 
}: SliderProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Define animation speed based on prop
  const animationDuration = {
    slow: "30s",
    medium: "20s",
    fast: "10s"
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
  
  // Generate badge classes based on variant
  const getBadgeClasses = (item: TechItem) => {
    const baseClasses = "px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all duration-300";
    const itemColor = item.color || (techLogos[item.name]?.color || "bg-gradient-to-r from-gray-800 to-gray-600");
    
    switch(variant) {
      case "glow":
        return `${baseClasses} shadow-md hover:shadow-lg hover:shadow-${itemColor.split('-').pop()}/20 rounded-full ${itemColor} text-white border-none transform hover:scale-110 hover:translate-y-1`;
      case "neon":
        return `${baseClasses} bg-black/80 text-white border border-${itemColor.split('-').pop()}/50 hover:border-${itemColor.split('-').pop()} rounded-md hover:shadow-inner hover:shadow-${itemColor.split('-').pop()}/30 hover:scale-105`;
      case "minimal":
        return `${baseClasses} bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-105`;
      default:
        return `${baseClasses} bg-white/10 backdrop-blur-md dark:bg-black/20 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:scale-110 hover:border-gray-300 dark:hover:border-gray-700`;
    }
  };

  // Custom animation styles
  const sliderAnimationClasses = `
    animate-marquee 
    ${direction === "rtl" ? "animate-marquee-reverse" : ""} 
    ${isHovered ? "paused" : "running"}
  `.trim();

  return (
    <div 
      className="w-full overflow-hidden relative py-6 before:absolute before:left-0 before:z-10 before:w-16 before:h-full before:bg-gradient-to-r before:from-white dark:before:from-black before:to-transparent after:absolute after:right-0 after:z-10 after:w-16 after:h-full after:bg-gradient-to-l after:from-white dark:after:from-black after:to-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(var(--slider-width) * -1)); }
        }
        .animate-marquee {
          animation: marquee var(--animation-duration) linear infinite;
        }
        .animate-marquee-reverse {
          animation-direction: reverse;
        }
        .paused {
          animation-play-state: paused;
        }
        .running {
          animation-play-state: running;
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
          const logoInfo = techLogos[item.name] || { icon: <Cpu />, color: "bg-gradient-to-r from-gray-800 to-gray-600" };
          
          return (
            <div key={`${item.name}-${index}`} className="mx-3">
              <Badge 
                className={getBadgeClasses(item)}
                variant="outline"
              >
                <span className={`flex items-center justify-center w-6 h-6 rounded-full p-1 ${variant === "minimal" ? "" : logoInfo.color} text-white`}>
                  {item.logo || logoInfo.icon || <Zap className="h-4 w-4" />}
                </span>
                <span>{item.name}</span>
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechStackSlider;