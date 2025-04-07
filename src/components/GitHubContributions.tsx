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
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  // Helper to calculate responsive cell size for mobile
  const getCellSize = () => {
    return isMobile ? "w-[6px] h-[6px]" : "w-[15px] h-[15px]";
  };

  // Filter less days for mobile view to make it fit
  const renderDays = () => {
    // For mobile, we'll only show Monday and Friday (fewer rows)
    const daysToShow = isMobile ? ["Mon", "Fri"] : ["Mon", "Wed", "Fri"];
    
    return daysToShow.map((day, dayIndex) => (
      <div key={dayIndex} className="flex items-center w-full">
        <div className={cn("text-xs text-gray-500 shrink-0", isMobile ? "w-5" : "w-8")}>{day.substring(0, 1)}</div>
        <div className={cn("grow grid gap-[2px]", isMobile ? "grid-cols-52" : "grid-cols-52")}>
          {contributionsData.flatMap((month) => 
            month.days
              .filter((_, i) => {
                // For mobile view, we filter differently to show fewer rows
                const factor = isMobile ? 3 : 2;
                const offset = isMobile ? dayIndex * 3 : dayIndex * 2;
                return i % 7 === offset;
              })
              .map((day, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn("grid-cell", getCellSize(), getContributionColor(day.level))} />
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
    ));
  };
  
  return (
    <div className="bg-gray-900/95 rounded-xl p-4 sm:p-6 w-full mx-auto border border-gray-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-white">
            <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{totalContributions} contributions in the last year</span>
          </h3>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className={cn(
              "px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition-colors text-xs sm:text-sm",
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
              "px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition-colors text-xs sm:text-sm",
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
              "px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition-colors text-xs sm:text-sm",
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
      
      <div className="w-full">
        <div className="flex mb-1 sm:mb-2">
          <div className={cn("shrink-0", isMobile ? "w-5" : "w-8")}></div>
          <div className="grow grid grid-cols-12 gap-1">
            {contributionsData.map((month, index) => (
              <div key={index} className="text-[10px] sm:text-xs text-center text-gray-400">
                {isMobile ? month.name.substring(0, 1) : month.name}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-[2px] sm:gap-1">
          {renderDays()}
        </div>
        
        <div className="flex justify-between mt-3 sm:mt-5 text-[10px] sm:text-sm">
          <button className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors">
            <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Learn how we count contributions</span>
          </button>
          
          <div className="flex items-center gap-1 sm:gap-2 text-gray-400">
            <span className="text-[10px] sm:text-xs">Less</span>
            <div className="flex gap-[2px] sm:gap-1">
              <div className={cn("grid-cell", getCellSize(), getContributionColor(0))}></div>
              <div className={cn("grid-cell", getCellSize(), getContributionColor(1))}></div>
              <div className={cn("grid-cell", getCellSize(), getContributionColor(2))}></div>
              <div className={cn("grid-cell", getCellSize(), getContributionColor(3))}></div>
              <div className={cn("grid-cell", getCellSize(), getContributionColor(4))}></div>
            </div>
            <span className="text-[10px] sm:text-xs">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubContributions;
