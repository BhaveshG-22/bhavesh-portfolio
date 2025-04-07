
import { useState } from "react";
import { CalendarIcon, HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  // Generate mock contribution data
  const generateMockData = (): MonthData[] => {
    const months = isMobile 
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"] // Reduced months for mobile
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const weekdays = ["Sun", "Mon", "Wed", "Fri"]; // Only display 3 rows instead of 7
    const mockData: MonthData[] = [];
    
    months.forEach((month, monthIndex) => {
      const daysInMonth = new Date(2025, monthIndex + 1, 0).getDate();
      const days: ContributionDay[] = [];
      
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(2025, monthIndex, i);
        const dayOfWeek = date.getDay();
        
        // Only include days that match our reduced weekdays for mobile
        if (!isMobile || weekdays.includes(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek])) {
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
            date: `${month} ${i}, 2025 (${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek]})`,
            count,
            level,
          });
        }
      }
      
      mockData.push({
        name: month,
        days,
      });
    });
    
    return mockData;
  };
  
  const contributionsData = generateMockData();
  const totalContributions = 630; // Fixed number as shown in the reference image
    
  // Get color for contribution level - updated for the dark theme look
  const getContributionColor = (level: ContributionLevel) => {
    switch (level) {
      case 0:
        return "bg-gray-800/80 hover:bg-gray-700/80";
      case 1:
        return "bg-teal-900/80 hover:bg-teal-800/90";
      case 2:
        return "bg-teal-700/80 hover:bg-teal-600/90"; 
      case 3:
        return "bg-teal-500/80 hover:bg-teal-400/90";
      case 4:
        return "bg-teal-300/80 hover:bg-teal-200/90";
      default:
        return "bg-gray-800/80 hover:bg-gray-700/80";
    }
  };
  
  return (
    <div className="bg-gray-900/95 rounded-xl p-4 sm:p-6 w-full mx-auto border border-gray-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-white" />
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {totalContributions} contributions in the last year
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className={cn(
              "px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition-colors text-sm",
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
              "px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition-colors text-sm",
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
              "px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition-colors text-sm",
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
      
      <div className="overflow-hidden w-full">
        <div className="w-full">
          <div className="flex mb-2">
            <div className="w-6 shrink-0"></div>
            <div className="grow grid grid-cols-8 sm:grid-cols-12 gap-1">
              {contributionsData.map((month, index) => (
                <div key={index} className="text-xs text-center text-gray-400">
                  {month.name}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            {isMobile ? ["Mon", "Wed", "Fri"].map((day, dayIndex) => (
              <div key={dayIndex} className="flex items-center w-full">
                <div className="w-6 text-xs text-gray-500 shrink-0">{day}</div>
                <div className="grow grid grid-cols-30 sm:grid-cols-52 gap-1">
                  {contributionsData.flatMap((month) => 
                    month.days.map((day, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={cn("grid-cell w-[12px] h-[12px] sm:w-[15px] sm:h-[15px]", getContributionColor(day.level))} />
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
            )) : ["Mon", "Wed", "Fri"].map((day, dayIndex) => (
              <div key={dayIndex} className="flex items-center w-full">
                <div className="w-6 text-xs text-gray-500 shrink-0">{day}</div>
                <div className="grow grid grid-cols-52 gap-1">
                  {contributionsData.flatMap((month) => 
                    month.days.map((day, index) => (
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
          
          <div className="flex justify-between mt-3 text-sm">
            <button className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors text-xs">
              <HelpCircle className="h-3 w-3" />
              Learn how we count contributions
            </button>
            
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <span>Less</span>
              <div className="flex gap-1">
                <div className={cn("w-[10px] h-[10px] rounded-sm", getContributionColor(0))}></div>
                <div className={cn("w-[10px] h-[10px] rounded-sm", getContributionColor(1))}></div>
                <div className={cn("w-[10px] h-[10px] rounded-sm", getContributionColor(2))}></div>
                <div className={cn("w-[10px] h-[10px] rounded-sm", getContributionColor(3))}></div>
                <div className={cn("w-[10px] h-[10px] rounded-sm", getContributionColor(4))}></div>
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
