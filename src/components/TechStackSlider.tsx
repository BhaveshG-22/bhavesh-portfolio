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
  Zap,
  CheckCircle
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
  variant?: "default" | "glow" | "neon" | "minimal" | "pill";
  className?: string;
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
  variant = "default",
  className = ""
}: SliderProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [glowColors, setGlowColors] = useState<Record<string, string>>({});
  
  // Define animation speed based on prop
  const animationDuration = {
    slow: "40s",
    medium: "25s",
    fast: "15s"
  };
  
  // Initialize random glow colors for neon effect
  useEffect(() => {
    if (variant === "neon") {
      const colors: Record<string, string> = {};
      const neonColors = ["blue-500", "purple-500", "pink-500", "emerald-500", "cyan-500", "fuchsia-500"];
      
      items.forEach(item => {
        colors[item.name] = neonColors[Math.floor(Math.random() * neonColors.length)];
      });
      
      setGlowColors(colors);
    }
  }, [items, variant]);

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
    const logoInfo = techLogos[item.name] || { icon: <Cpu className="h-4 w-4" />, color: "bg-gradient-to-r from-gray-800 to-gray-600" };
    const itemColor = item.color || logoInfo.color;
    const isSelected = selectedItem === item.name;
    
    switch(variant) {
      case "glow":
        return `${baseClasses} shadow-md hover:shadow-lg ${isSelected ? 'scale-110 ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400' : ''} hover:shadow-blue-400/20 dark:hover:shadow-blue-500/40 rounded-full ${itemColor} text-white border-none transform hover:scale-110`;
      case "neon":
        return `${baseClasses} ${isSelected ? 'scale-105 bg-gray-900 shadow-lg shadow-blue-500/30' : 'bg-black/80'} text-white border border-blue-500/50 hover:border-blue-400 rounded-md hover:shadow-inner hover:shadow-blue-500/30 hover:scale-105`;
      case "minimal":
        return `${baseClasses} bg-transparent ${isSelected ? 'bg-gray-100 dark:bg-gray-800 scale-105' : ''} hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-105`;
      case "pill":
        return `${baseClasses} ${isSelected ? 'scale-105 shadow-md' : ''} bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:scale-105 hover:border-gray-300 dark:hover:border-gray-700`;
      default:
        return `${baseClasses} ${isSelected ? 'scale-110 shadow-md border-gray-300 dark:border-gray-700' : 'bg-white/10 backdrop-blur-md dark:bg-black/20'} rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:scale-110 hover:border-gray-300 dark:hover:border-gray-700`;
    }
  };

  // Get icon container classes based on variant
  const getIconContainerClasses = (item: TechItem) => {
    const logoInfo = techLogos[item.name] || { icon: <Cpu className="h-4 w-4" />, color: "bg-gradient-to-r from-gray-800 to-gray-600" };
    const itemColor = item.color || logoInfo.color;
    const colorName = itemColor.includes('from-') ? itemColor.split('from-')[1].split(' ')[0] : 'blue-500';
    
    switch(variant) {
      case "minimal":
        return "flex items-center justify-center w-6 h-6 rounded-full p-1 text-blue-500 dark:text-blue-400";
      case "neon":
        return `flex items-center justify-center w-7 h-7 rounded-full p-1 bg-${colorName} text-white shadow-md shadow-${colorName}/50`;
      case "pill":
        return `flex items-center justify-center w-6 h-6 rounded-full p-1 ${itemColor} text-white`;
      default:
        return `flex items-center justify-center w-6 h-6 rounded-full p-1 ${itemColor} text-white`;
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
      className={`w-full overflow-hidden relative py-6 
        before:absolute before:left-0 before:top-0 before:z-10 before:w-24 before:h-full before:bg-gradient-to-r 
        before:from-white dark:before:from-black before:to-transparent 
        after:absolute after:right-0 after:top-0 after:z-10 after:w-24 after:h-full after:bg-gradient-to-l 
        after:from-white dark:after:from-black after:to-transparent
        ${variant === "neon" ? "bg-gray-950 dark:bg-black rounded-xl" : ""} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setSelectedItem(null);
      }}
    >
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(var(--slider-width)); }
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
        className={`flex items-center gap-4 whitespace-nowrap ${sliderAnimationClasses} ${variant === "neon" ? "py-3" : ""}`}
        style={{
          animationDuration: animationDuration[speed],
          width: "fit-content"
        }}
      >
        {allItems.map((item, index) => {
          const logoInfo = techLogos[item.name] || { icon: <Cpu className="h-4 w-4" />, color: "bg-gradient-to-r from-gray-800 to-gray-600" };
          const isSelected = selectedItem === item.name;
          
          return (
            <div 
              key={`${item.name}-${index}`} 
              className={`mx-3 ${variant === "neon" ? "relative group" : ""}`}
              onClick={() => setSelectedItem(isSelected ? null : item.name)}
            >
              {variant === "neon" && (
                <div className={`absolute inset-0 blur-md bg-${glowColors[item.name] || "blue-500"}/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
              )}
              <Badge 
                className={getBadgeClasses(item)}
                variant="outline"
              >
                <span className={getIconContainerClasses(item)}>
                  {item.logo || logoInfo.icon}
                </span>
                <span className="whitespace-nowrap">{item.name}</span>
                {isSelected && variant !== "minimal" && (
                  <CheckCircle className="h-3 w-3 ml-1 text-white" />
                )}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Example usage
const Example = () => {
  const techItems: TechItem[] = [
    { name: "React" },
    { name: "TypeScript" },
    { name: "TailwindCSS" },
    { name: "Next.js" },
    { name: "Node.js" },
    { name: "Firebase" },
    { name: "Express" },
    { name: "Prisma" },
    { name: "HTML" },
    { name: "JavaScript" },
  ];

  return (
    <div className="space-y-12 py-8 max-w-5xl mx-auto">
      <div className="bg-black p-8 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 text-center text-white">Neon Tech Stack</h3>
        <TechStackSlider 
          direction="ltr" 
          speed="medium" 
          items={techItems} 
          variant="neon"
          className="mb-6"
        />
        <TechStackSlider 
          direction="rtl" 
          speed="slow" 
          items={techItems.slice().reverse()} 
          variant="neon"
        />
      </div>
    </div>
  );
};

export default Example;