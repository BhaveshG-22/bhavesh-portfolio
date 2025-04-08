import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react";
import { mockGithubData } from "@/data/mockGithubData";

// Type definitions
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
  weeks?: WeekData[];
}

interface GitHubContributionsProps {
  username?: string;
}

const GitHubContributions = ({ username }: GitHubContributionsProps) => {
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);
  
  useEffect(() => {
    // Process the mock data
    const processData = () => {
      setLoading(true);
      
      try {
        const data = { ...mockGithubData };
        
        // Add contribution levels to each day
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
        
        // Sort days by date
        processedDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Use exactly 53 weeks (371 days) for the grid
        const totalWeeks = 53;
        const totalDays = totalWeeks * 7;
        
        // Get the most recent days to fill the grid
        const mostRecentDays = processedDays.slice(-totalDays);
        
        // Group days into weeks
        const weeks: WeekData[] = [];
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
      } catch (err) {
        console.error("Error processing GitHub contributions data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    processData();
  }, []);
  
  // Get color based on contribution level
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

  // Format date string for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Generate accurate month labels
  const getMonthLabels = () => {
    if (!contributionData?.weeks || contributionData.weeks.length === 0) {
      return [];
    }
    
    // Get first and last days from the data to determine the range
    const firstWeek = contributionData.weeks[0];
    const lastWeek = contributionData.weeks[contributionData.weeks.length - 1];
    
    if (!firstWeek?.contributionDays.length || !lastWeek?.contributionDays.length) return [];
    
    const firstDay = firstWeek.contributionDays[0];
    const lastDay = lastWeek.contributionDays[lastWeek.contributionDays.length - 1];
    
    if (!firstDay || !lastDay) return [];
    
    const startDate = new Date(firstDay.date);
    const endDate = new Date(lastDay.date);
    
    // Calculate month positions for the labels
    const monthLabels = [];
    const totalWeeks = contributionData.weeks.length;
    
    // Create a label for each month in the range
    const currentDate = new Date(startDate);
    currentDate.setDate(1); // Start at the first of the month
    
    while (currentDate <= endDate) {
      // Calculate position as a percentage of the total width
      const position = Math.round(
        ((currentDate.getTime() - startDate.getTime()) / 
        (endDate.getTime() - startDate.getTime())) * (totalWeeks - 1)
      );
      
      monthLabels.push({
        month: currentDate.toLocaleDateString('en-US', { month: 'short' }),
        position
      });
      
      // Move to the next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Return all month labels - we'll handle spacing in the render
    return monthLabels;
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden p-6 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 text-teal-500 animate-spin mb-2 border-4 border-teal-500 border-t-transparent rounded-full" />
          <p className="text-gray-600 dark:text-gray-400">Loading GitHub contributions...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (!contributionData) {
    return (
      <div className="w-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden p-6 flex justify-center items-center">
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
  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="w-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden p-3 sm:p-4">
      {/* Info alert about mock data */}
      <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
          <div>
            <AlertTitle className="text-blue-800 dark:text-blue-300">Using Mock Data</AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
              Displaying hard-coded GitHub contribution data for demonstration purposes.
            </AlertDescription>
          </div>
        </div>
      </Alert>
      
      <div className="flex flex-col">
        <div className="flex">
          {/* Weekday labels column - fixed width */}
          <div className="w-8 flex flex-col justify-around text-xs text-gray-500 pr-2">
            {weekdayLabels.map((day, index) => (
              // Only show Monday, Wednesday, Friday
              index % 2 === 1 ? (
                <div key={day} className="h-3 flex items-center">
                  {day.charAt(0)}
                </div>
              ) : <div key={day} className="h-3" />
            ))}
          </div>
          
          {/* Contributions grid with month labels */}
          <div className="flex-1 overflow-hidden">
            {/* Month labels row */}
            <div className="relative h-5 mb-1">
              {monthLabels.map((labelData, index) => (
                <div 
                  key={index} 
                  className="absolute text-xs text-gray-500 dark:text-gray-400"
                  style={{ 
                    left: `${(labelData.position / contributionData.weeks.length) * 100}%`,
                    transform: 'translateX(-50%)' 
                  }}
                >
                  {labelData.month}
                </div>
              ))}
            </div>
            
            {/* Contribution grid */}
            <div className="grid grid-cols-7 grid-rows-53 grid-flow-col gap-1">
              {contributionData.weeks?.map((week, weekIndex) => (
                // For each week, render 7 days (Sunday to Saturday)
                week.contributionDays.map((day, dayIndex) => (
                  <Popover key={`${weekIndex}-${dayIndex}`}>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "w-3 h-3 rounded-sm border transition-all",
                          getContributionColor(day.level || 0),
                          "hover:ring-2 hover:ring-teal-300 dark:hover:ring-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        )}
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
                      </div>
                    </PopoverContent>
                  </Popover>
                ))
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom section with stats and legend */}
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
                    "w-3 h-3 rounded-sm border", 
                    getContributionColor(level as ContributionLevel)
                  )}
                />
              ))}
            </div>
            <span className="text-gray-500 dark:text-gray-400">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubContributions;