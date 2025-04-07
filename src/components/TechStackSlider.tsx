
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface SliderProps {
  direction: "ltr" | "rtl";
  speed?: "slow" | "medium" | "fast";
  items: string[];
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
          animationDirection: direction === "rtl" ? "reverse" : "normal"
        }}
      >
        {allItems.map((item, index) => (
          <div key={`${item}-${index}`} className="mx-3">
            <Badge 
              className="px-4 py-2 text-sm font-medium glassmorphism-card hover:scale-110 transition-transform cursor-default"
              variant="outline"
            >
              {item}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackSlider;
