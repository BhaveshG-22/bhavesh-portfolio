import React, { useState, useEffect } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface ContributionData {
  date: string;
  count: number;
  level: ContributionLevel;
}

const GitHubContributions = () => {
  const [data, setData] = useState<ContributionData[]>([]);
  const [visibleWeeks, setVisibleWeeks] = useState(52);
  
  useEffect(() => {
    // Generate contribution data that matches the example
    generateData();
    
    // Handle responsive sizing
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleWeeks(26); // Show ~6 months on mobile
      } else if (window.innerWidth < 1024) {
        setVisibleWeeks(39); // Show ~9 months on tablets
      } else {
        setVisibleWeeks(52); // Show full year on desktop
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Generate contribution data that mimics the screenshot
  const generateData = () => {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const daysPerWeek = 7;
    const weeksInYear = 52;
    const contributions: ContributionData[] = [];
    
    // Pre-defined contribution density pattern to match screenshot
    // Higher values = more contributions in that part of the year
    const densityPattern = [
      0.2, 0.3, 0.3, 0.2, 0.3, 0.4, 0.4, 0.3, 0.5, 0.6, 0.5, 0.6
    ];
    
    // Generate data for each day in the year
    for (let week = 0; week < weeksInYear; week++) {
      const monthIndex = Math.floor((week / weeksInYear) * 12);
      const density = densityPattern[monthIndex];
      
      for (let day = 0; day < daysPerWeek; day++) {
        // Calculate date
        const dayOfYear = week * 7 + day;
        const monthOffset = Math.floor(dayOfYear / 30);
        const dayInMonth = (dayOfYear % 30) + 1;
        const month = months[monthOffset % 12];
        const year = month === "Jan" || month === "Feb" || month === "Mar" ? "2025" : "2024";
        
        // Determine contribution level based on random chance + density pattern
        let level: ContributionLevel = 0;
        const rand = Math.random();
        
        if (rand < density * 0.5) {
          level = 1;
        } else if (rand < density * 0.6) {
          level = 2;
        } else if (rand < density * 0.7) {
          level = 3;
        } else if (rand < density * 0.75) {
          level = 4;
        }
        
        // Create contribution count based on level
        const count = level === 0 ? 0 : level * Math.floor(Math.random() * 4 + 1);
        
        contributions.push({
          date: `${month} ${dayInMonth}, ${year}`,
          count,
          level
        });
      }
    }
    
    setData(contributions);
  };
  
  // Get color for contribution level to match the teal colors in the image
  const getContributionColor = (level: ContributionLevel) => {
    switch (level) {
      case 0:
        return "bg-gray-800 border-gray-700";
      case 1:
        return "bg-teal-900 border-teal-800";
      case 2:
        return "bg-teal-700 border-teal-600"; 
      case 3:
        return "bg-teal-500 border-teal-400";
      case 4:
        return "bg-teal-300 border-teal-200";
      default:
        return "bg-gray-800 border-gray-700";
    }
  };
  
  // Get visible data based on current visible weeks setting
  const visibleData = data.slice(-visibleWeeks * 7);
  
  // Get visible months based on visible weeks
  const getVisibleMonths = () => {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    if (visibleWeeks === 52) return months;
    if (visibleWeeks === 39) return months.slice(3); // 9 months
    return months.slice(6); // 6 months
  };
  
  const visibleMonths = getVisibleMonths();
  
  return (
    <div className="w-full bg-black rounded-lg border border-gray-800 shadow-xl overflow-hidden p-3 sm:p-4">
      {/* Month labels */}
      <div className="flex justify-between mb-1 text-xs text-gray-400">
        {visibleMonths.map((month, index) => (
          <div key={index} className="text-center">
            {month}
          </div>
        ))}
      </div>
      
      {/* Contribution grid */}
      <div className="grid grid-rows-7 grid-flow-col gap-1">
        {Array.from({ length: 7 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {visibleData
              .filter((_, index) => index % 7 === rowIndex)
              .map((day, colIndex) => (
                <TooltipProvider key={colIndex}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "w-3 h-3 sm:w-4 sm:h-4 rounded-sm border border-opacity-10",
                          getContributionColor(day.level)
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200 text-xs py-1 px-2">
                      {day.count === 0 ? "No" : day.count} contribution{day.count !== 1 ? 's' : ''} on {day.date}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>
        ))}
      </div>
      
      {/* Bottom section */}
      <div className="flex justify-between items-center mt-3 text-xs text-gray-300">
        <div>
          1,362 contributions in the last year
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-1">
          <span className="text-gray-400">Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div 
                key={level} 
                className={cn(
                  "w-3 h-3 rounded-sm border border-opacity-10", 
                  getContributionColor(level as ContributionLevel)
                )}
              />
            ))}
          </div>
          <span className="text-gray-400">More</span>
        </div>
      </div>
    </div>
  );
};

export default GitHubContributions;