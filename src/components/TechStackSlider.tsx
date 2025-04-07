
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { icons } from "lucide-react";

interface TechItem {
  name: string;
  logo: React.ReactNode;
  color?: string;
}

interface SliderProps {
  direction: "ltr" | "rtl";
  speed?: "slow" | "medium" | "fast";
  items: TechItem[];
}

const TechStackSlider = ({ direction, speed = "medium", items }: SliderProps) => {
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
  
  return (
    <div 
      className="w-full overflow-hidden relative py-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={sliderRef}
        className={`flex items-center whitespace-nowrap ${
          isHovered ? "pause-animation" : "animate-slide"
        } ${direction === "rtl" ? "animate-slide-reverse" : ""}`}
        style={{
          animationPlayState: isHovered ? "paused" : "running",
          animationDuration: animationDuration[speed],
          animationDirection: direction === "rtl" ? "reverse" : "normal",
          width: "fit-content"
        }}
      >
        {allItems.map((item, index) => (
          <div key={`${item.name}-${index}`} className="mx-3">
            <Badge 
              className="px-4 py-2 text-sm font-medium glassmorphism-card hover:scale-110 transition-transform cursor-default flex items-center"
              variant="outline"
              style={{ boxShadow: `0 4px 12px rgba(0,0,0,0.1)` }}
            >
              <div className="mr-2 flex items-center justify-center">{item.logo}</div>
              <span style={item.color ? { color: item.color } : {}}>{item.name}</span>
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackSlider;
