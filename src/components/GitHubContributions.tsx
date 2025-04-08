
import React, { useState, useEffect } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface ContributionDay {
  contributionCount: number;
  date: string;
  level: ContributionLevel;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface GitHubContributionsProps {
  username?: string;
}

const GitHubContributions = ({ username = "octocat" }: GitHubContributionsProps) => {
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchContributions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // GitHub GraphQL API endpoint
        const endpoint = 'https://api.github.com/graphql';
        
        // The GraphQL query to fetch contribution data
        const query = `
          query($userName:String!) { 
            user(login: $userName){
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `;

        // Execute the query without an access token (public data only)
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { userName: username }
          })
        });

        const result = await response.json();
        
        // Check if we got a rate limit error
        if (response.status === 403) {
          console.error("GitHub API rate limit exceeded");
          throw new Error('GitHub API rate limit exceeded. Using simulated contribution data instead.');
        }
        
        if (result.errors) {
          throw new Error(result.errors[0].message || 'Error fetching GitHub data');
        }
        
        if (!result.data?.user?.contributionsCollection?.contributionCalendar) {
          throw new Error('No contribution data found');
        }
        
        const calendar = result.data.user.contributionsCollection.contributionCalendar;
        
        // Process the data to add contribution levels
        const processedWeeks = calendar.weeks.map((week: any) => {
          const processedDays = week.contributionDays.map((day: any) => {
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
          
          return {
            contributionDays: processedDays
          };
        });
        
        setContributionData({
          totalContributions: calendar.totalContributions,
          weeks: processedWeeks
        });
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching GitHub contributions:", err);
        
        // Show toast notification for API rate limit
        if (err.message.includes('rate limit')) {
          toast({
            title: "GitHub API Rate Limited",
            description: "Showing simulated contribution data instead.",
            variant: "destructive"
          });
        }
        
        setError(err.message || "Failed to fetch GitHub contributions");
        setLoading(false);
        
        // Generate fallback data if the API fails
        generateFallbackData();
      }
    };
    
    fetchContributions();
  }, [username, toast]);
  
  // Generate fallback contribution data if the API fails
  const generateFallbackData = () => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    const weeks: ContributionWeek[] = [];
    let totalContributions = 0;
    
    // Generate 52 weeks of data (1 year)
    for (let weekIndex = 0; weekIndex < 52; weekIndex++) {
      const contributionDays: ContributionDay[] = [];
      
      // Generate 7 days per week
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const date = new Date(oneYearAgo);
        date.setDate(date.getDate() + (weekIndex * 7) + dayIndex);
        
        // Random contribution count
        const rand = Math.random();
        let contributionCount = 0;
        let level: ContributionLevel = 0;
        
        if (rand < 0.6) {
          contributionCount = 0;
          level = 0;
        } else if (rand < 0.75) {
          contributionCount = 1;
          level = 1;
        } else if (rand < 0.85) {
          contributionCount = Math.floor(Math.random() * 3) + 2; // 2-4
          level = 2;
        } else if (rand < 0.95) {
          contributionCount = Math.floor(Math.random() * 5) + 5; // 5-9
          level = 3;
        } else {
          contributionCount = Math.floor(Math.random() * 15) + 10; // 10-24
          level = 4;
        }
        
        contributionDays.push({
          contributionCount,
          date: date.toISOString().split('T')[0],
          level
        });
        
        totalContributions += contributionCount;
      }
      
      weeks.push({ contributionDays });
    }
    
    setContributionData({
      totalContributions,
      weeks
    });
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Get month labels based on contribution data
  const getMonthLabels = () => {
    if (!contributionData?.weeks || contributionData.weeks.length === 0) {
      return [];
    }
    
    const months: string[] = [];
    const seenMonths = new Set<string>();
    
    // Process all dates to extract month names
    contributionData.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        const date = new Date(day.date);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        if (!seenMonths.has(monthName)) {
          months.push(monthName);
          seenMonths.add(monthName);
        }
      });
    });
    
    // Ensure we only return a reasonable number of month labels
    const filteredMonths: string[] = [];
    for (let i = 0; i < months.length; i++) {
      if (i % 2 === 0 || i === months.length - 1) {
        filteredMonths.push(months[i]);
      } else {
        filteredMonths.push('');
      }
    }
    
    return filteredMonths;
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
      {error && (
        <Alert variant="destructive" className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>GitHub API Rate Limited</AlertTitle>
          <AlertDescription>
            Showing simulated contribution data instead.
          </AlertDescription>
        </Alert>
      )}
      
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
              {contributionData.weeks.map((week, weekIndex) => {
                // Find the day entry for this day-of-week index
                const day = week.contributionDays.find((_, i) => i === dayOfWeekIndex);
                
                if (!day) {
                  // Empty cell for days that don't exist
                  return <div key={weekIndex} className="w-3 h-3 sm:w-3 sm:h-3" />;
                }
                
                return (
                  <TooltipProvider key={`${weekIndex}-${dayOfWeekIndex}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "w-3 h-3 sm:w-3 sm:h-3 rounded-sm border border-opacity-10",
                            getContributionColor(day.level)
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-xs py-1 px-2">
                        {day.contributionCount === 0 ? "No" : day.contributionCount} contribution{day.contributionCount !== 1 ? 's' : ''} on {formatDate(day.date)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
          {error && <span className="text-xs text-gray-500 ml-1">(simulated)</span>}
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
