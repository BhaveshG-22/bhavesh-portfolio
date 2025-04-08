
import React, { useState, useEffect } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { mockGithubData } from "@/data/mockGithubData";

type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface ContributionDay {
  contributionCount: number;
  date: string;
  level?: ContributionLevel;
}

interface WeekData {
  contributionDays: ContributionDay[];
}

interface ContributionData {
  userName: string;
  totalContributions: number;
  contributionDays: ContributionDay[];
  weeks?: WeekData[]; // Generated from contributionDays
}

interface GitHubContributionsProps {
  username?: string;
}

const GitHubContributions = ({ username: propUsername }: GitHubContributionsProps) => {
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);
  
  useEffect(() => {
    // Use the mock data directly without fetching
    const processData = () => {
      setLoading(true);
      
      try {
        const data = { ...mockGithubData };
        
        // Process the data to add contribution levels to each day
        const processedDays = data.contributionDays.map(day => {
          // Determine level based on count
          let level: ContributionLevel = 0;
          const count = day.contributionCount;
          
          if (count === 0) level = 0;
          else if (count === 1) level = 1;
          else if (count >= 2 && count <= 4) level = 2;
          else if (count >= 5 && count <= 9) level = 3;
          else level = 4;
          
          return {
            ...day,
            level
          };
        });
        
        // Sort the days by date to ensure proper ordering
        processedDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Calculate the total days needed (fixed at 52 weeks * 7 days = 364 days for consistency)
        const totalDays = 52 * 7;
        
        // Get the most recent 364 days
        const mostRecentDays = processedDays.length > totalDays 
          ? processedDays.slice(processedDays.length - totalDays) 
          : processedDays;
        
        // Group the days into weeks (for the last year)
        const weeks: WeekData[] = [];
        
        // Group days into weeks
        for (let i = 0; i < mostRecentDays.length; i += 7) {
          const weekDays = mostRecentDays.slice(i, i + 7);
          weeks.push({
            contributionDays: weekDays
          });
        }
        
        setContributionData({
          ...data,
          contributionDays: processedDays,
          weeks: weeks
        });
      } catch (err: any) {
        console.error("Error processing GitHub contributions data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    processData();
  }, []);
  
  // Get color for contribution level to match the teal colors in the image
  const getContributionColor = (level: ContributionLevel) => {
    switch (level) {
      case 0:
        return "bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700";
      case 1:
        return "bg-teal-100 border-teal-200 dark:bg-teal-900 dark:border-teal-800";
      case 2:
        return "bg-teal-300 border-teal-400 dark:bg-teal-700 dark:border-teal-600"; 
      case 3:
        return "bg-teal-500 border-teal-600 dark:bg-teal-500 dark:border-teal-400";
      case 4:
        return "bg-teal-600 border-teal-700 dark:bg-teal-300 dark:border-teal-200";
      default:
        return "bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Get month labels based on the actual data we're displaying
  const getMonthLabels = () => {
    if (!contributionData?.weeks || contributionData.weeks.length === 0) {
      return [];
    }
    
    // Flatten all weeks to get individual days
    const allDays = contributionData.weeks.flatMap(week => week.contributionDays);
    
    // For more accurate labeling, get data range that we're displaying
    const startDate = new Date(allDays[0]?.date || '');
    const endDate = new Date(allDays[allDays.length - 1]?.date || '');
    
    // Create an array of all months between start and end date
    const months = [];
    const currentDate = new Date(startDate);
    
    // Set to first day of month to ensure we get consistent monthly increments
    currentDate.setDate(1);
    
    while (currentDate <= endDate) {
      const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' });
      months.push(monthName);
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Return appropriate number of labels based on available space
    // For a typical contribution graph, showing every other month works well
    return months.filter((_, index) => index % 2 === 0);
  };
  
  const handleContributionClick = (day: ContributionDay) => {
    setSelectedDay(day);
  };
  
  const closeSelectedDay = () => {
    setSelectedDay(null);
  };
  
  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden p-20 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 text-teal-500 animate-spin mb-2 border-4 border-teal-500 border-t-transparent rounded-full" />
          <p className="text-gray-600 dark:text-gray-400">Loading GitHub contributions...</p>
        </div>
      </div>
    );
  }
  
  if (!contributionData) {
    return (
      <div className="w-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden p-10 flex justify-center items-center">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-500 mb-2">Failed to load GitHub contributions</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            An unexpected error occurred.
          </p>
        </div>
      </div>
    );
  }
  
  const monthLabels = getMonthLabels();
  
  return (
    <div className="w-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden p-3 sm:p-4">
      {/* Info alert that we're using mock data */}
      <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <AlertTitle>Using Mock Data</AlertTitle>
        <AlertDescription>
          Displaying hard-coded GitHub contribution data for demonstration purposes.
        </AlertDescription>
      </Alert>
      
      {/* Month labels */}
      <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400">
        {monthLabels.map((month, index) => (
          <div key={index} className="text-center">
            {month}
          </div>
        ))}
      </div>
      
      {/* Contribution grid */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-rows-7 grid-flow-col gap-1 min-w-fit">
          {/* Create 7 rows (for days of the week) */}
          {Array.from({ length: 7 }).map((_, dayOfWeekIndex) => (
            <div key={dayOfWeekIndex} className="flex gap-1">
              {/* Map weeks data */}
              {contributionData.weeks?.map((week, weekIndex) => {
                // Find the day entry for this day-of-week index
                const day = week.contributionDays.find((_, i) => i === dayOfWeekIndex);
                
                if (!day) {
                  // Empty cell for days that don't exist
                  return <div key={weekIndex} className="w-3 h-3 sm:w-3 sm:h-3" />;
                }
                
                return (
                  <Popover key={`${weekIndex}-${dayOfWeekIndex}`}>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "w-3 h-3 sm:w-3 sm:h-3 rounded-sm border border-opacity-10",
                          getContributionColor(day.level || 0),
                          "hover:ring-2 hover:ring-teal-300 dark:hover:ring-teal-600 hover:ring-opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                        )}
                        onClick={() => handleContributionClick(day)}
                        aria-label={`${day.contributionCount} contributions on ${formatDate(day.date)}`}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {formatDate(day.date)}
                          </h4>
                          <div 
                            className={cn(
                              "w-4 h-4 rounded-sm",
                              getContributionColor(day.level || 0)
                            )} 
                          />
                        </div>
                        <div className="py-1 text-center">
                          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {day.contributionCount}
                          </span>
                          <p className="text-gray-500 dark:text-gray-400">
                            contribution{day.contributionCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {day.contributionCount > 0 && (
                          <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <Info className="h-3.5 w-3.5 mr-1" />
                            <span>Click to view details</span>
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 text-xs text-gray-700 dark:text-gray-300 gap-2">
        <div>
          {contributionData.totalContributions.toLocaleString()} contributions in the last year
          <span className="text-xs text-gray-500 ml-1">(mock data)</span>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-1">
          <span className="text-gray-500 dark:text-gray-400">Less</span>
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
          <span className="text-gray-500 dark:text-gray-400">More</span>
        </div>
      </div>
    </div>
  );
};

export default GitHubContributions;
