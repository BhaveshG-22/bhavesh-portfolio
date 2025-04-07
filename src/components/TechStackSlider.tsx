
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface TechItem {
  name: string;
  logo?: React.ReactNode;
  color?: string;
}

interface SliderProps {
  direction?: "ltr" | "rtl";
  speed?: "slow" | "medium" | "fast";
  items: TechItem[];
  variant?: "default" | "glow" | "neon" | "minimal";
}

const TechStackSlider = ({ 
  direction = "ltr", 
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
  
  // Generate badge classes based on variant with improved shadows
  const getBadgeClasses = (item: TechItem) => {
    const baseClasses = "px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all duration-300";
    const itemColor = item.color || "bg-gradient-to-r from-gray-800 to-gray-600";
    
    switch(variant) {
      case "glow":
        return `${baseClasses} shadow-lg hover:shadow-xl hover:shadow-primary/10 rounded-full ${itemColor} text-white border-none transform hover:scale-110 hover:-translate-y-1`;
      case "neon":
        return `${baseClasses} bg-black/80 text-white border border-primary/50 hover:border-primary rounded-md hover:shadow-[0_0_12px_2px_rgba(98,126,234,0.2)] hover:scale-105`;
      case "minimal":
        return `${baseClasses} bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-105 hover:shadow`;
      default:
        return `${baseClasses} bg-white/10 backdrop-blur-md dark:bg-black/20 rounded-xl border border-gray-200 dark:border-gray-800 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.3)] hover:scale-105 hover:border-gray-300 dark:hover:border-gray-700`;
    }
  };

  // Custom animation styles with improved gradient shadows
  const sliderAnimationClasses = `
    animate-marquee 
    ${direction === "rtl" ? "animate-marquee-reverse" : ""} 
    ${isHovered ? "paused" : "running"}
  `.trim();

  return (
    <div 
      className="w-full overflow-hidden relative py-6 before:absolute before:left-0 before:z-10 before:w-16 before:h-full before:bg-gradient-to-r before:from-background before:to-transparent after:absolute after:right-0 after:z-10 after:w-16 after:h-full after:bg-gradient-to-l after:from-background after:to-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />
      
      <div
        ref={sliderRef}
        className={`flex items-center whitespace-nowrap ${sliderAnimationClasses}`}
        style={{
          animationDuration: animationDuration[speed],
          width: "fit-content"
        }}
      >
        {allItems.map((item, index) => {
          return (
            <div key={`${item.name}-${index}`} className="mx-3">
              <Badge 
                className={getBadgeClasses(item)}
                variant="outline"
              >
                {item.logo && (
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full p-1 ${variant === "minimal" ? "" : itemColor || "bg-gradient-to-r from-gray-800 to-gray-600"} text-white shadow-inner`}>
                    {item.logo}
                  </span>
                )}
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
