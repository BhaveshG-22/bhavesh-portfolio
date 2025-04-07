import React, { useState, useEffect } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

interface MonthData {
  name: string;
  days: ContributionDay[];
}

const GitHubContributions = () => {
  const [year] = useState("2025");
  const [columns, setColumns] = useState(53); // Default number of columns
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Adjust columns based on screen width
      if (window.innerWidth < 640) { // Small screens
        setColumns(26);
      } else if (window.innerWidth < 1024) { // Medium screens
        setColumns(39);
      } else { // Large screens
        setColumns(53);
      }
    };
    
    // Set initial columns
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Generate mock contribution data using the months from the image
  const generateMockData = (): MonthData[] => {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const mockData: MonthData[] = [];
    
    months.forEach((month) => {
      const daysInMonth = 31; // Simplified for visual consistency
      const days: ContributionDay[] = [];
      
      for (let i = 1; i <= daysInMonth; i++) {
        let level: ContributionLevel = 0;
        let count = 0;
        
        // Generate random contribution data with a pattern
        const rand = Math.random();
        if (rand > 0.8) {
          if (rand > 0.95) {
            count = Math.floor(Math.random() * 10) + 10;
            level = 4;
          } else if (rand > 0.9) {
            count = Math.floor(Math.random() * 5) + 5;
            level = 3;
          } else if (rand > 0.85) {
            count = Math.floor(Math.random() * 3) + 2;
            level = 2;
          } else {
            count = 1;
            level = 1;
          }
        }
        
        days.push({
          date: `${month} ${i}, ${month === "Jan" || month === "Feb" || month === "Mar" ? "2025" : "2024"}`,
          count,
          level,
        });
      }
      
      mockData.push({
        name: month,
        days,
      });
    });
    
    return mockData;
  };
  
  const contributionsData = generateMockData();
  const totalContributions = 1362; // Exactly as in the image
    
  // Get color for contribution level - using the teal colors from the image
  const getContributionColor = (level: ContributionLevel) => {
    switch (level) {
      case 0:
        return "bg-gray-800 hover:bg-gray-700";
      case 1:
        return "bg-teal-900 hover:bg-teal-800";
      case 2:
        return "bg-teal-700 hover:bg-teal-600"; 
      case 3:
        return "bg-teal-500 hover:bg-teal-400";
      case 4:
        return "bg-teal-300 hover:bg-teal-200";
      default:
        return "bg-gray-800 hover:bg-gray-700";
    }
  };

  // Calculate which months to display based on columns
  const getVisibleMonths = () => {
    if (columns === 53) return contributionsData;
    if (columns === 39) return contributionsData.slice(3); // Last 9 months
    return contributionsData.slice(6); // Last 6 months for smallest screens
  };

  const visibleMonths = getVisibleMonths();
  
  return (
    <Card className="bg-black rounded-lg border border-gray-800 shadow-xl overflow-hidden w-full">
      <CardContent className="p-2 sm:p-3 md:p-5">
        <div className="w-full">
          {/* Month labels at the top - responsive */}
          <div className="grid gap-1 mb-2 text-xs text-gray-400" 
               style={{ gridTemplateColumns: `repeat(${visibleMonths.length}, minmax(0, 1fr))` }}>
            {visibleMonths.map((month, index) => (
              <div key={index} className="text-center text-[10px] sm:text-xs">
                {month.name}
              </div>
            ))}
          </div>
          
          {/* Contribution grid - responsive */}
          <div className="grid gap-[1px] sm:gap-[2px]" 
               style={{ 
                 gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                 gridTemplateRows: `repeat(7, 1fr)`
               }}>
            {Array.from({ length: 7 }).map((_, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => {
                  // Calculate level based on position to create a pattern similar to the image
                  let level: ContributionLevel = 0;
                  
                  // Create a semi-random but visually consistent pattern
                  const patternValue = (rowIndex * columns + colIndex) % 12;
                  if (patternValue === 2 || patternValue === 5 || patternValue === 8) {
                    level = (Math.random() > 0.4 ? 
                      Math.floor(Math.random() * 4) as ContributionLevel : 
                      0) as ContributionLevel;
                  }
                  
                  // Set some specific patterns to match the image
                  if ((rowIndex === 2 && colIndex % 7 === 3) || 
                      (rowIndex === 3 && colIndex % 8 === 2) ||
                      (rowIndex === 4 && colIndex % 5 === 1)) {
                    level = Math.floor(Math.random() * 3 + 1) as ContributionLevel;
                  }
                  
                  // Convert column index to month and day based on visible months
                  const monthIndex = Math.floor(colIndex / (columns / visibleMonths.length));
                  const month = visibleMonths[monthIndex < visibleMonths.length ? monthIndex : visibleMonths.length - 1];
                  const dayInMonth = Math.floor((colIndex % (columns / visibleMonths.length)) * 7) + rowIndex;
                  const date = month ? `${month.name} ${dayInMonth > 31 ? 31 : dayInMonth}, ${month.name === "Jan" || month.name === "Feb" || month.name === "Mar" ? "2025" : "2024"}` : "";
                  const count = level === 0 ? 0 : level * Math.floor(Math.random() * 3 + 1);
                  
                  return (
                    <TooltipProvider key={`${rowIndex}-${colIndex}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={cn(
                              "w-2 h-2 sm:w-3 sm:h-3 rounded-sm", 
                              getContributionColor(level)
                            )} 
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200 text-xs">
                          {level === 0 ? "No" : count} contribution{count !== 1 ? 's' : ''} on {date}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          
          {/* Bottom section with total contributions count and legend - responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-3 sm:mt-5 text-xs sm:text-sm text-gray-300 gap-2">
            <div>
              {totalContributions} contributions in the last year
            </div>
            
            {/* Legend matching the image */}
            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={cn(
                      "w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-sm", 
                      getContributionColor(level as ContributionLevel)
                    )}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubContributions;