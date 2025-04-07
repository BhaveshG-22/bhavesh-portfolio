
import { useState } from "react";
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
  
  // Generate mock contribution data
  const generateMockData = (): MonthData[] => {
    // Use 12 months to match the image
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const mockData: MonthData[] = [];
    
    months.forEach((month, monthIndex) => {
      const daysInMonth = 31; // Simplified for visual consistency
      const days: ContributionDay[] = [];
      
      for (let i = 1; i <= daysInMonth; i++) {
        // Generate a pattern similar to the image
        let level: ContributionLevel = 0;
        let count = 0;
        
        // Create a pattern that resembles the image
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
  const totalContributions = 1362; // Hardcoded to match the image
    
  // Get color for contribution level
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
  
  return (
    <Card className="bg-black rounded-lg border border-gray-800 shadow-xl overflow-hidden">
      <CardContent className="p-5">
        <div className="w-full">
          {/* Month labels */}
          <div className="grid grid-cols-12 gap-1 mb-2 text-xs text-gray-400">
            {contributionsData.map((month, index) => (
              <div key={index} className="text-center">
                {month.name}
              </div>
            ))}
          </div>
          
          {/* Contribution grid */}
          <div className="grid grid-flow-col gap-[2px]">
            {Array.from({ length: 7 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex flex-col gap-[2px]">
                {Array.from({ length: 52 }).map((_, colIndex) => {
                  // Calculate month and day
                  const monthIndex = Math.floor(colIndex / 4.33);
                  const dayWithinMonth = Math.floor(colIndex % 4.33);
                  
                  const monthData = contributionsData[monthIndex >= 12 ? 11 : monthIndex];
                  
                  // Create a pattern that resembles the image
                  let level: ContributionLevel = 0;
                  if ((rowIndex * 53 + colIndex) % 5 === 1 || (rowIndex * colIndex) % 7 === 3) {
                    level = (Math.random() > 0.5 ? 
                      Math.floor(Math.random() * 4) as ContributionLevel : 
                      0) as ContributionLevel;
                  }
                  
                  const date = monthData ? `${monthData.name} ${dayWithinMonth + 1}, ${monthData.name === "Jan" || monthData.name === "Feb" || monthData.name === "Mar" ? "2025" : "2024"}` : "";
                  
                  return (
                    <TooltipProvider key={`${rowIndex}-${colIndex}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={cn("w-3 h-3 rounded-sm", getContributionColor(level))} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                          {level === 0 ? "No" : level} contribution{level !== 1 ? 's' : ''} on {date}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-800">
            <div className="text-sm text-gray-300">
              {totalContributions} contributions in the last year
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={cn("w-[10px] h-[10px] rounded-sm", getContributionColor(level as ContributionLevel))}
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
