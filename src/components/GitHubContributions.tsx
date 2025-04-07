import React, { useState } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Define contribution level types
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
  // Generate more realistic contribution data
  const generateContributionData = (): { data: MonthData[], total: number } => {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const data: MonthData[] = [];
    
    // Pattern to make it look more like the image
    // We'll create "hot spots" of activity in certain weeks
    const hotSpots = [
      { month: 1, week: 1 }, // May week 1
      { month: 2, week: 3 }, // Jun week 3
      { month: 3, week: 0 }, // Jul week 0
      { month: 4, week: 2 }, // Aug week 2
      { month: 5, week: 1 }, // Sep week 1
      { month: 5, week: 3 }, // Sep week 3
      { month: 7, week: 2 }, // Nov week 2
      { month: 8, week: 0 }, // Dec week 0
      { month: 9, week: 1 }, // Jan week 1
      { month: 9, week: 3 }, // Jan week 3
      { month: 10, week: 2 }, // Feb week 2
      { month: 11, week: 0 }, // Mar week 0
      { month: 11, week: 3 }, // Mar week 3
    ];
    
    let totalContributions = 0;
    
    months.forEach((month, monthIndex) => {
      const daysInMonth = 31; // Simplified for visual consistency
      const days: ContributionDay[] = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const week = Math.floor(day / 7);
        
        // Check if this day is in a hot spot
        const isHotSpot = hotSpots.some(spot => spot.month === monthIndex && spot.week === week);
        
        // Higher probability of contributions in hot spots
        const baseProb = isHotSpot ? 0.7 : 0.3;
        let level: ContributionLevel = 0;
        let count = 0;
        
        const rand = Math.random();
        if (rand < baseProb) {
          // Determine level based on randomness but weighted toward hot spots
          if (isHotSpot && rand < 0.2) {
            level = 4;
            count = Math.floor(Math.random() * 10) + 10;
          } else if (isHotSpot && rand < 0.4) {
            level = 3; 
            count = Math.floor(Math.random() * 5) + 5;
          } else if (rand < 0.6) {
            level = 2;
            count = Math.floor(Math.random() * 3) + 2;
          } else {
            level = 1;
            count = 1;
          }
          
          totalContributions += count;
        }
        
        days.push({
          date: `${month} ${day}, ${month === "Jan" || month === "Feb" || month === "Mar" ? "2025" : "2024"}`,
          count,
          level,
        });
      }
      
      data.push({
        name: month,
        days,
      });
    });
    
    return { data, total: totalContributions };
  };
  
  // Generate contribution data
  const { data: contributionsData, total } = generateContributionData();
  
  // Get color for contribution level - using the exact teal colors from the image
  const getContributionColor = (level: ContributionLevel) => {
    switch (level) {
      case 0:
        return "bg-gray-900 hover:bg-gray-800";
      case 1:
        return "bg-teal-900 hover:bg-teal-800";
      case 2:
        return "bg-teal-700 hover:bg-teal-600"; 
      case 3:
        return "bg-teal-500 hover:bg-teal-400";
      case 4:
        return "bg-teal-300 hover:bg-teal-200";
      default:
        return "bg-gray-900 hover:bg-gray-800";
    }
  };
  
  // Create a 7×53 grid of cells to represent days
  // 7 rows for days of the week (Mon-Sun)
  // ~53 columns for weeks in a year
  return (
    <div className="w-full bg-black rounded-lg overflow-hidden p-4">
      <div>
        {/* Month labels at the top */}
        <div className="grid grid-cols-12 gap-1 mb-2 text-xs text-gray-400">
          {contributionsData.map((month, index) => (
            <div key={index} className="text-center">
              {month.name}
            </div>
          ))}
        </div>
        
        {/* Contribution grid - 7 rows for days of week */}
        <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] gap-[2px] mb-4">
          {Array.from({ length: 7 }).map((_, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {Array.from({ length: 53 }).map((_, colIndex) => {
                // Calculate month and day based on position
                const monthIndex = Math.floor(colIndex / 4.4);
                const dayInMonth = rowIndex + (colIndex % 4) * 7;
                
                // Get month data or default to last month if out of bounds
                const month = contributionsData[monthIndex < 12 ? monthIndex : 11];
                
                // Get day data or default to level 0 if out of bounds
                const dayData = month && month.days[dayInMonth] 
                  ? month.days[dayInMonth]
                  : { level: 0, count: 0, date: "" };
                
                return (
                  <TooltipProvider key={`${rowIndex}-${colIndex}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={cn(
                            "w-3 h-3 rounded-sm", 
                            getContributionColor(dayData.level as ContributionLevel)
                          )} 
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200 text-xs">
                        {dayData.level === 0 ? "No" : dayData.count} contribution{dayData.count !== 1 ? 's' : ''} on {dayData.date}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        
        {/* Footer with total contributions and legend */}
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-300">
            {1362} contributions in the last year
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div 
                  key={level} 
                  className={cn(
                    "w-[10px] h-[10px] rounded-sm", 
                    getContributionColor(level as ContributionLevel)
                  )}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubContributions;