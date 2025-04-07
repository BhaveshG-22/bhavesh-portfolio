
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
  Cpu
} from "lucide-react";

interface TechItem {
  name: string;
  logo?: React.ReactNode;
}

interface SliderProps {
  direction: "ltr" | "rtl";
  speed?: "slow" | "medium" | "fast";
  items: TechItem[];
}

// Map of tech names to their corresponding logo components
const techLogos: Record<string, React.ReactNode> = {
  "HTML": <FileCode className="mr-2 h-4 w-4 text-orange-500" />,
  "JavaScript": <FileJson className="mr-2 h-4 w-4 text-yellow-400" />,
  "TypeScript": <FileType className="mr-2 h-4 w-4 text-blue-500" />,
  "Next.js": <Code className="mr-2 h-4 w-4" />,
  "React": <Layers className="mr-2 h-4 w-4 text-blue-400" />,
  "TailwindCSS": <Layers className="mr-2 h-4 w-4 text-cyan-500" />,
  "Prisma": <Code className="mr-2 h-4 w-4 text-green-500" />,
  "Node.js": <Server className="mr-2 h-4 w-4 text-green-600" />,
  "Firebase": <Flame className="mr-2 h-4 w-4 text-orange-500" />,
  "Nginx": <Server className="mr-2 h-4 w-4 text-green-400" />,
  "Express": <Server className="mr-2 h-4 w-4" />,
  "TensorFlow": <Bot className="mr-2 h-4 w-4 text-orange-600" />,
};

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
            >
              {item.logo || techLogos[item.name] || <Cpu className="mr-2 h-4 w-4" />}
              {item.name}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackSlider;
