
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  const [year, setYear] = useState("2025");
  
  // Generate mock contribution data
  const generateMockData = (): MonthData[] => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const mockData: MonthData[] = [];
    
    months.forEach((month, monthIndex) => {
      const daysInMonth = new Date(2025, monthIndex + 1, 0).getDate();
      const days: ContributionDay[] = [];
      
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(2025, monthIndex, i);
        const weekDay = weekdays[date.getDay()];
        
        // Generate random contribution count, weighted to have more zeros and ones
        const rand = Math.random();
        let count = 0;
        let level: ContributionLevel = 0;
        
        if (rand > 0.6) {
          if (rand > 0.95) {
            count = Math.floor(Math.random() * 10) + 10;
            level = 4;
          } else if (rand > 0.85) {
            count = Math.floor(Math.random() * 5) + 5;
            level = 3;
          } else if (rand > 0.75) {
            count = Math.floor(Math.random() * 3) + 2;
            level = 2;
          } else {
            count = 1;
            level = 1;
          }
        }
        
        days.push({
          date: `${month} ${i}, 2025 (${weekDay})`,
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
  const totalContributions = contributionsData
    .flatMap(month => month.days)
    .reduce((sum, day) => sum + day.count, 0);
    
  // Get color for contribution level - updated with more seamless gradient
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
    <div className="bg-gray-900 rounded-xl p-6 w-full mx-auto border border-gray-800 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-white">
            <CalendarIcon className="h-5 w-5" />
            <span>{totalContributions} contributions in the last year</span>
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className={cn(
              "px-3 py-1.5 rounded-md transition-colors",
              year === "2025" 
                ? "bg-gray-700 text-white" 
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            )}
            onClick={() => setYear("2025")}
          >
            2025
          </button>
          <button
            className={cn(
              "px-3 py-1.5 rounded-md transition-colors",
              year === "2024" 
                ? "bg-gray-700 text-white" 
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            )}
            onClick={() => setYear("2024")}
          >
            2024
          </button>
          <button
            className={cn(
              "px-3 py-1.5 rounded-md transition-colors",
              year === "2023" 
                ? "bg-gray-700 text-white" 
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            )}
            onClick={() => setYear("2023")}
          >
            2023
          </button>
        </div>
      </div>
      
      <div className="relative w-full pb-4">
        <div className="w-full">
          <div className="flex mb-2">
            <div className="w-8 shrink-0"></div>
            <div className="grow grid grid-cols-12 gap-1">
              {contributionsData.map((month, index) => (
                <div key={index} className="text-xs text-center text-gray-400">
                  {month.name}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            {["Mon", "Wed", "Fri"].map((day, dayIndex) => (
              <div key={dayIndex} className="flex items-center w-full">
                <div className="w-8 text-xs text-gray-500 shrink-0">{day}</div>
                <div className="grow grid grid-cols-52 gap-1">
                  {contributionsData.flatMap((month) => 
                    month.days
                      .filter((_, i) => i % 7 === dayIndex * 2)
                      .map((day, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={cn("grid-cell", getContributionColor(day.level))} />
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                              {day.count} contribution{day.count !== 1 ? 's' : ''} on {day.date}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-5 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                <div className={cn("grid-cell", getContributionColor(0))}></div>
                <div className={cn("grid-cell", getContributionColor(1))}></div>
                <div className={cn("grid-cell", getContributionColor(2))}></div>
                <div className={cn("grid-cell", getContributionColor(3))}></div>
                <div className={cn("grid-cell", getContributionColor(4))}></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubContributions;
