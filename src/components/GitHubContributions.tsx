
import React, { useState, useEffect } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface ContributionData {
  date: string;
  count: number;
  level: ContributionLevel;
}

interface GitHubContributionsProps {
  username?: string;
}

const GitHubContributions = ({ username = "octocat" }: GitHubContributionsProps) => {
  const [data, setData] = useState<ContributionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  
  // Always show full year (52 weeks)
  const visibleWeeks = 52;
  
  useEffect(() => {
    // Update container width on mount and resize
    const updateContainerWidth = () => {
      const container = document.getElementById('contributions-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };
    
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);
  
  useEffect(() => {
    const fetchGitHubContributions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // GitHub API endpoint for user contributions (past year)
        const currentDate = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
        
        const fromDate = oneYearAgo.toISOString().split('T')[0];
        const toDate = currentDate.toISOString().split('T')[0];
        
        // GitHub API V3 endpoint for user activity
        const response = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
        
        if (!response.ok) {
          throw new Error(`GitHub API request failed with status: ${response.status}`);
        }
        
        const eventsData = await response.json();
        
        // Process the GitHub events data into our contribution format
        const contributionsMap = new Map<string, number>();
        let total = 0;
        
        // Count contributions by date
        eventsData.forEach((event: any) => {
          const date = event.created_at.split('T')[0];
          const currentCount = contributionsMap.get(date) || 0;
          
          // Count different event types differently
          let increment = 0;
          if (event.type === 'PushEvent') {
            // Each commit in a push counts
            increment = event.payload.commits?.length || 1;
          } else if (['PullRequestEvent', 'IssuesEvent', 'IssueCommentEvent'].includes(event.type)) {
            increment = 1;
          }
          
          if (increment > 0) {
            contributionsMap.set(date, currentCount + increment);
            total += increment;
          }
        });
        
        // Fill in the past year with dates, including those with no contributions
        const contributionData: ContributionData[] = [];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 1);
        
        // Generate dates for the past year
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          const count = contributionsMap.get(dateStr) || 0;
          
          // Determine level based on count
          let level: ContributionLevel = 0;
          if (count > 0) {
            if (count >= 10) level = 4;
            else if (count >= 6) level = 3;
            else if (count >= 3) level = 2;
            else level = 1;
          }
          
          // Format date for display
          const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
          const displayDate = new Date(dateStr).toLocaleDateString('en-US', options);
          
          contributionData.push({
            date: displayDate,
            count,
            level
          });
        }
        
        setData(contributionData);
        setTotalContributions(total);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching GitHub contributions:", err);
        setError(err.message || "Failed to fetch GitHub contributions");
        setLoading(false);
        
        // Fallback to generated data if API fails
        generateFallbackData();
      }
    };
    
    fetchGitHubContributions();
  }, [username]);
  
  // Generate fallback contribution data if the API fails
  const generateFallbackData = () => {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const daysPerWeek = 7;
    const weeksInYear = 52;
    const contributions: ContributionData[] = [];
    let total = 0;
    
    // Pre-defined contribution density pattern
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
        total += count;
        
        contributions.push({
          date: `${month} ${dayInMonth}, ${year}`,
          count,
          level
        });
      }
    }
    
    setData(contributions);
    setTotalContributions(total);
  };
  
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
  
  // Get visible data based on current visible weeks setting
  const visibleData = data.slice(-visibleWeeks * 7);
  
  // Get all months in the past year for labels
  const getMonthLabels = () => {
    const months: string[] = [];
    const now = new Date();
    let date = new Date();
    date.setFullYear(now.getFullYear() - 1);
    
    for (let i = 0; i < 12; i++) {
      date.setMonth(date.getMonth() + 1);
      months.push(date.toLocaleString('en-US', { month: 'short' }));
    }
    
    return months;
  };
  
  const monthLabels = getMonthLabels();
  
  // Calculate sizing based on container width
  const cellSize = Math.max(Math.min(4, Math.floor(containerWidth / (visibleWeeks + 4))), 2);
  const cellGap = Math.max(1, Math.floor(cellSize / 4));
  
  const cellStyle = {
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    borderRadius: `${Math.max(1, Math.floor(cellSize / 4))}px`,
  };
  
  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden p-20 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-teal-500 animate-spin mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Loading GitHub contributions...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden p-10 flex justify-center items-center">
        <div className="flex flex-col items-center text-center">
          <p className="text-red-500 mb-2">Error loading GitHub contributions</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Showing simulated data instead</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      id="contributions-container"
      className="w-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden p-3 sm:p-4"
    >
      {/* Month labels */}
      <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400 px-1">
        {monthLabels.map((month, index) => (
          <div key={index} className="text-center">{month}</div>
        ))}
      </div>
      
      {/* Scrollable contribution grid */}
      <ScrollArea className="h-full w-full">
        <div className="grid grid-rows-7 grid-flow-col gap-[1px]" style={{ gap: `${cellGap}px` }}>
          {Array.from({ length: 7 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-[1px]" style={{ gap: `${cellGap}px` }}>
              {visibleData
                .filter((_, index) => index % 7 === rowIndex)
                .map((day, colIndex) => (
                  <TooltipProvider key={colIndex}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "rounded-sm border border-opacity-10",
                            getContributionColor(day.level)
                          )}
                          style={cellStyle}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2">
                        {day.count === 0 ? "No" : day.count} contribution{day.count !== 1 ? 's' : ''} on {day.date}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Bottom section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-3 text-xs text-gray-700 dark:text-gray-300 gap-2">
        <div>
          {totalContributions.toLocaleString()} contributions in the last year
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
