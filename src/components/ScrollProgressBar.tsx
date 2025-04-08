
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how far the user has scrolled
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Avoid division by zero
      if (scrollHeight === 0) return;
      
      // Calculate progress as a percentage (0 to 100)
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(Math.min(100, progress));
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();
    
    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress 
        value={scrollProgress} 
        className="h-1 rounded-none bg-background/50" 
      />
    </div>
  );
};

export default ScrollProgressBar;
