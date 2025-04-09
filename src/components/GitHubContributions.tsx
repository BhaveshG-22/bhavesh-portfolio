
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Calendar, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContributionDay {
  contributionCount: number;
  date: string;
  level?: number;
}

interface ContributionsData {
  userName: string;
  totalContributions: number;
  contributionDays: ContributionDay[];
}

export interface GitHubContributionsProps {
  username: string;
}

const GitHubContributions = ({ username }: GitHubContributionsProps) => {
  const [data, setData] = useState<ContributionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<ContributionDay[]>([]);

  useEffect(() => {
    const fetchContributions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://54p3k92j7i.execute-api.us-east-1.amazonaws.com/api/contributions?username=${username}&token=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`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub contributions");
        }
        
        const responseData: ContributionsData = await response.json();
        setData(responseData);
        
        // Process data to determine contribution levels
        const processed = responseData.contributionDays.map((day) => {
          const count = day.contributionCount;
          let level = 0;
          
          if (count === 0) level = 0;
          else if (count === 1) level = 1;
          else if (count <= 4) level = 2;
          else if (count <= 9) level = 3;
          else level = 4;
          
          return { ...day, level };
        });
        
        setProcessedData(processed);
      } catch (err) {
        console.error("Error fetching GitHub contributions:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch contributions");
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchContributions();
    }
  }, [username]);

  // Function to organize data into weeks
  const organizeDataIntoWeeks = () => {
    if (!processedData.length) return [];
    
    const startDate = new Date(processedData[0]?.date || new Date());
    const endDate = new Date(processedData[processedData.length - 1]?.date || new Date());
    const dateMap = new Map(processedData.map((d) => [d.date, d]));
    
    const weeks: ContributionDay[][] = [];
    let current = new Date(startDate);
    current.setDate(current.getDate() - current.getDay()); // Start from Sunday
    
    while (current <= endDate) {
      const week: ContributionDay[] = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = current.toISOString().split("T")[0];
        week.push(
          dateMap.get(dateStr) || { 
            date: dateStr, 
            contributionCount: 0, 
            level: 0 
          }
        );
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }
    
    return weeks;
  };

  // Get months for the labels
  const getMonthLabels = () => {
    if (!processedData.length) return [];
    
    const startDate = new Date(processedData[0]?.date || new Date());
    const endDate = new Date(processedData[processedData.length - 1]?.date || new Date());
    
    const months: { name: string, index: number }[] = [];
    let current = new Date(startDate);
    current.setDate(1); // Start from first day of month
    
    while (current <= endDate) {
      months.push({
        name: current.toLocaleString('default', { month: 'short' }),
        index: weeks.findIndex(week => {
          return week.some(day => {
            const dayDate = new Date(day.date);
            return dayDate.getMonth() === current.getMonth() && dayDate.getDate() <= 7;
          });
        })
      });
      
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  const getColor = (level: number) => {
    return [
      "bg-gray-800 hover:bg-gray-700", // No contributions
      "bg-[#0e4429] hover:bg-[#0e4429]/80", // 1 contribution
      "bg-[#006d32] hover:bg-[#006d32]/80", // 2-4 contributions
      "bg-[#26a641] hover:bg-[#26a641]/80", // 5-9 contributions  
      "bg-[#39d353] hover:bg-[#39d353]/80"  // 10+ contributions
    ][level];
  };

  const weeks = organizeDataIntoWeeks();
  const monthLabels = getMonthLabels();

  if (isLoading) {
    return (
      <div className="bg-black/80 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <h3 className="text-base font-medium text-white">GitHub Contributions</h3>
        </div>
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <Loader className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-gray-400">Loading GitHub contributions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/80 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <h3 className="text-base font-medium text-white">GitHub Contributions</h3>
        </div>
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">Error loading GitHub contributions: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/80 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <h3 className="text-base font-medium text-white">GitHub Contributions</h3>
        </div>
        {data && (
          <div className="text-sm text-gray-400">
            <span className="font-semibold text-white">{data.totalContributions}</span> contributions in the last year
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="min-w-fit">
          <div className="flex mb-2">
            {/* Month labels */}
            <div className="flex flex-col mr-2 mt-6">
              <div className="h-4"></div>
            </div>
            <div className="flex-1 flex">
              {monthLabels.map((month, idx) => (
                <div 
                  key={idx} 
                  className="text-xs text-gray-500" 
                  style={{ 
                    position: 'absolute', 
                    marginLeft: `${month.index * 14}px`,
                    marginTop: '-20px'
                  }}
                >
                  {month.name}
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            {/* Day of week labels */}
            <div className="flex flex-col mr-2 text-xs text-gray-500 items-start pt-1.5">
              <div className="h-3">Mon</div>
              <div className="h-3 mt-[7px]"></div>
              <div className="h-3 mt-[7px]">Wed</div>
              <div className="h-3 mt-[7px]"></div>
              <div className="h-3 mt-[7px]">Fri</div>
            </div>

            {/* Calendar grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIdx) => (
                    <div
                      key={`${weekIdx}-${dayIdx}`}
                      className={cn(
                        "w-3 h-3 rounded-sm cursor-pointer transition-colors",
                        getColor(day.level || 0)
                      )}
                      title={`${day.date}: ${day.contributionCount} contribution${
                        day.contributionCount !== 1 ? "s" : ""
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-end items-center mt-4">
            <span className="text-xs text-gray-500 mr-2">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn("w-3 h-3 rounded-sm mr-[3px]", getColor(level))}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubContributions;
