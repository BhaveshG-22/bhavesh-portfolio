
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Calendar, Loader } from "lucide-react";
import Heatmap from '@react-sandbox/heatmap';

interface ContributionDay {
  date: string;
  contributionCount: number;
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
  const [heatmapValues, setHeatmapValues] = useState<{ date: Date; count: number }[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());

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
        
        // Transform data for heatmap library
        if (responseData.contributionDays.length > 0) {
          // Sort days to make sure they're in chronological order
          const sortedDays = [...responseData.contributionDays].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          // Calculate start date (one year ago from latest contribution)
          const latestDate = new Date(sortedDays[sortedDays.length - 1].date);
          const calculatedStartDate = new Date(latestDate);
          calculatedStartDate.setFullYear(calculatedStartDate.getFullYear() - 1);
          setStartDate(calculatedStartDate);
          
          // Format data for the heatmap component
          const formattedValues = sortedDays.map(day => ({
            date: new Date(day.date),
            count: day.contributionCount
          }));
          
          setHeatmapValues(formattedValues);
        }
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

  if (isLoading) {
    return (
      <div className="w-full bg-black/80 p-4 rounded-lg border border-gray-700">
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
      <div className="w-full bg-black/80 p-4 rounded-lg border border-gray-700">
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
    <div className="w-full bg-black/80 p-4 rounded-lg border border-gray-700">
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

      <div className="w-full overflow-x-auto py-2">
        <div className="min-w-full w-full">
          {heatmapValues.length > 0 && (
            <Heatmap
              startDate={startDate}
              values={heatmapValues}
              emptyColor={[30, 40, 50]}
              baseColor={[57, 211, 83]} // GitHub's green color
              scaleFactor={15}
              style={{ 
                width: '100%', 
                borderRadius: '4px',
                padding: '0.5rem'
              }}
            />
          )}
        </div>
      </div>
      
      <div className="flex justify-end items-center mt-4 text-xs text-gray-500">
        <span className="mr-2">Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: level === 0 
                  ? 'rgb(30, 40, 50)' 
                  : `rgba(57, 211, 83, ${level * 0.25})`,
                borderRadius: '2px'
              }}
            />
          ))}
        </div>
        <span className="ml-1">More</span>
      </div>
    </div>
  );
};

export default GitHubContributions;
