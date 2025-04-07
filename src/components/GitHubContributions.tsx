
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
  
  // Generate mock contribution data - simplified for a cleaner look
  const generateMockData = (): MonthData[] => {
    // Use only 6 months to match the image
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    const mockData: MonthData[] = [];
    
    months.forEach((month, monthIndex) => {
      const daysInMonth = new Date(2025, monthIndex + 4, 0).getDate(); // Starting from April (month 4)
      const days: ContributionDay[] = [];
      
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(2025, monthIndex + 3, i);
        
        // Generate random contribution count with more zeros for a sparse look
        const rand = Math.random();
        let count = 0;
        let level: ContributionLevel = 0;
        
        if (rand > 0.75) {
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
          date: `${month} ${i}, 2025`,
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
  const totalContributions = 1362; // Hardcoded to match the design
    
  // Get color for contribution level - styled for dark theme with teal colors
  const getContributionColor = (level: ContributionLevel) => {
    switch (level) {
      case 0:
        return "bg-gray-800/60 hover:bg-gray-700/60";
      case 1:
        return "bg-teal-900 hover:bg-teal-800";
      case 2:
        return "bg-teal-700 hover:bg-teal-600"; 
      case 3:
        return "bg-teal-500 hover:bg-teal-400";
      case 4:
        return "bg-teal-300 hover:bg-teal-200";
      default:
        return "bg-gray-800/60 hover:bg-gray-700/60";
    }
  };
  
  return (
    <Card className="bg-black rounded-lg border border-gray-800 shadow-xl overflow-hidden">
      <CardContent className="p-5">
        <div className="w-full">
          {/* Month labels */}
          <div className="grid grid-cols-6 gap-1 mb-2 text-xs text-gray-500">
            {contributionsData.map((month, index) => (
              <div key={index} className="text-center">
                {month.name}
              </div>
            ))}
          </div>
          
          {/* Contribution grid - even more compact */}
          <div className="space-y-[2px]">
            {Array.from({ length: 7 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex">
                <div className="grow grid grid-cols-[repeat(180,minmax(0,1fr))] gap-[1px]">
                  {contributionsData.flatMap((month) => 
                    month.days.map((day, dayIndex) => {
                      // Generate a pattern similar to the image
                      let level: ContributionLevel = 0;
                      if ((rowIndex + dayIndex) % 7 === 3 || (rowIndex * dayIndex) % 11 === 2) {
                        level = Math.floor(Math.random() * 4) as ContributionLevel;
                        if (level > 0) level = (level % 3 + 1) as ContributionLevel;
                      }
                      
                      return (
                        <TooltipProvider key={`${month.name}-${dayIndex}`}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={cn("w-[9px] h-[9px] rounded-[1px]", getContributionColor(level))} />
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                              {level === 0 ? "No" : level} contribution{level !== 1 ? 's' : ''} on {day.date}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })
                  )}
                </div>
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
                    className={cn("w-[10px] h-[10px] rounded-[1px]", getContributionColor(level as ContributionLevel))}
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
