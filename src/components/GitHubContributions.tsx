import React, { useState, useEffect, useRef, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, RefreshCw, GitBranch } from "lucide-react";
import { format, parseISO, subYears } from "date-fns";

// Types
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
  className?: string;
  onError?: (error: string) => void;
  hideStats?: boolean; // New prop to control stats visibility
}

// Custom hook for fetching contributions
function useGitHubContributions(username: string) {
  const [data, setData] = useState<ContributionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(subYears(new Date(), 1));
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchContributions = useCallback(async (retryCount = 0) => {
    if (!username) return;

    setIsLoading(true);
    setError(null);

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Using the token directly, but in a production environment you should use environment variables
      const response = await fetch(
        `https://54p3k92j7i.execute-api.us-east-1.amazonaws.com/api/contributions?username=${username}&token=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`,
        {
          signal: controller.signal
        }
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
      }
    } catch (err) {
      // Don't set error state if the request was intentionally aborted
      if ((err as Error).name !== 'AbortError') {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch contributions";
        setError(errorMessage);

        // Retry logic with exponential backoff
        if (retryCount < 3) {
          setTimeout(() => {
            fetchContributions(retryCount + 1);
          }, 1000 * Math.pow(2, retryCount));
        }
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, [username]);

  useEffect(() => {
    fetchContributions();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchContributions]);

  return { data, isLoading, error, refetch: fetchContributions, startDate };
}

const GitHubContributions = ({
  username,
  className = "",
  onError,
  hideStats = false, // Default to false for backward compatibility
}: GitHubContributionsProps) => {
  const { data, isLoading, error, refetch, startDate } = useGitHubContributions(username);
  const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Add custom CSS for scrollbar
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .contribution-scroll::-webkit-scrollbar {
        height: 6px;
      }
      .contribution-scroll::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }
      .contribution-scroll::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }
      .contribution-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Inform parent component about errors
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-700 dark:bg-gray-800';
    if (count < 5) return 'bg-green-900 dark:bg-green-900';
    if (count < 10) return 'bg-green-700 dark:bg-green-700';
    if (count < 20) return 'bg-green-500 dark:bg-green-500';
    return 'bg-green-300 dark:bg-green-300';
  };

  const handleTooltip = useCallback((e: React.MouseEvent, content: string | null) => {
    if (!content) {
      setTooltip(null);
      return;
    }

    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const chartRect = chartRef.current?.getBoundingClientRect();

    if (!chartRect) return;

    // Calculate the tooltip position relative to the chart container
    let x = rect.left + rect.width / 2 - chartRect.left;
    let y = rect.top - chartRect.top;

    // Ensure the tooltip stays within the chart boundaries
    setTooltip({ content, x, y });
  }, []);

  // Position tooltip to stay within viewport
  useEffect(() => {
    if (tooltip && tooltipRef.current && chartRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const chartRect = chartRef.current.getBoundingClientRect();

      // Adjust horizontal position if tooltip would overflow
      if (tooltipRect.right > window.innerWidth) {
        tooltipRef.current.style.left = 'auto';
        tooltipRef.current.style.right = '0';
      }

      // Adjust vertical position if tooltip would overflow
      if (tooltipRect.top < 0) {
        tooltipRef.current.style.top = '100%';
        tooltipRef.current.style.bottom = 'auto';
      }
    }
  }, [tooltip]);

  // Group contribution days by week
  const groupByWeek = () => {
    if (!data?.contributionDays) return [];

    const map = new Map<string, ContributionDay[]>();

    data.contributionDays.forEach((day) => {
      const week = format(parseISO(day.date), 'I-yyyy');
      if (!map.has(week)) map.set(week, []);
      map.get(week)?.push(day);
    });

    return Array.from(map.values());
  };

  const weeks = groupByWeek();

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!data?.contributionDays) return {
      longest: 0, current: 0, best: 0, average: 0
    };

    let current = 0;
    let longest = 0;
    let totalDays = 0;
    let totalContributions = 0;

    // Sort by date ascending
    const sortedDays = [...data.contributionDays].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sortedDays.forEach(day => {
      if (day.contributionCount > 0) {
        current++;
        totalDays++;
        totalContributions += day.contributionCount;
      } else {
        if (current > longest) {
          longest = current;
        }
        current = 0;
      }
    });

    // Check if current streak is the longest
    if (current > longest) {
      longest = current;
    }

    const average = totalDays > 0
      ? Math.round((totalContributions / totalDays) * 10) / 10
      : 0;

    const best = sortedDays.reduce(
      (max, day) => Math.max(max, day.contributionCount), 0
    );

    return { longest, current, best, average };
  }, [data]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`w-full bg-black/80 p-4 rounded-lg border border-gray-700 ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <h3 className="text-base font-medium text-white">GitHub Contributions</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/3 bg-gray-700" />
            <Skeleton className="h-4 w-1/4 bg-gray-700" />
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <div className="flex flex-col justify-between h-24 py-2">
              <Skeleton className="h-3 w-6 bg-gray-700" />
              <Skeleton className="h-3 w-6 bg-gray-700" />
              <Skeleton className="h-3 w-6 bg-gray-700" />
            </div>
            <div className="grid grid-cols-12 gap-1 h-24">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <Skeleton key={j} className="w-3 h-3 rounded bg-gray-700" />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-3">
            <Skeleton className="h-4 w-1/5 bg-gray-700" />
            <Skeleton className="h-4 w-1/4 bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`w-full bg-black/80 p-4 rounded-lg border border-gray-700 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <h3 className="text-base font-medium text-white">GitHub Contributions</h3>
          </div>
          <button
            onClick={() => refetch()}
            className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            aria-label="Retry loading contributions"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">Error loading GitHub contributions: {error}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-md transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // No data
  if (!data) {
    return (
      <div className={`w-full bg-black/80 p-4 rounded-lg border border-gray-700 ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <h3 className="text-base font-medium text-white">GitHub Contributions</h3>
        </div>
        <div className="p-4 text-center">
          <p className="text-sm text-gray-400">No contribution data available for @{username}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-black/80 p-4 rounded-lg border border-gray-700 relative ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <h3 className="text-base font-medium text-white">
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center"
            >
              @{data.userName}
            </a>
          </h3>
        </div>
        <div className="text-sm text-gray-400">
          <span className="font-semibold text-white">{data.totalContributions.toLocaleString()}</span> contributions
        </div>
      </div>

      {/* Conditionally render stats */}
      {!hideStats && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-gray-800/50 rounded p-2 text-center">
            <div className="text-xs text-gray-400">Current Streak</div>
            <div className="text-white font-bold">{stats.current} days</div>
          </div>
          <div className="bg-gray-800/50 rounded p-2 text-center">
            <div className="text-xs text-gray-400">Longest Streak</div>
            <div className="text-white font-bold">{stats.longest} days</div>
          </div>
          <div className="bg-gray-800/50 rounded p-2 text-center">
            <div className="text-xs text-gray-400">Best Day</div>
            <div className="text-white font-bold">{stats.best}</div>
          </div>
          <div className="bg-gray-800/50 rounded p-2 text-center">
            <div className="text-xs text-gray-400">Daily Average</div>
            <div className="text-white font-bold">{stats.average}</div>
          </div>
        </div>
      )}

      <div ref={chartRef} className="relative">
        <div className="grid grid-cols-[auto_1fr] gap-x-1 overflow-hidden">
          <div className="flex flex-col justify-between pb-1 text-xs text-gray-500">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>
          <div className="flex overflow-x-auto pb-1 contribution-scroll justify-between">
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-1 mx-[1px]">
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  // Adjust to start with Sunday (0) instead of Monday
                  const day = week.find(
                    (d) => new Date(d.date).getDay() === dayIdx
                  );
                  const count = day?.contributionCount || 0;
                  const dateStr = day ? format(parseISO(day.date), 'MMM dd, yyyy') : '';
                  const tooltipContent = day
                    ? `${count} contribution${count !== 1 ? 's' : ''} on ${dateStr}`
                    : null;

                  return (
                    <div
                      key={dayIdx}
                      className={`w-4 h-4 rounded cursor-pointer ${getColor(count)} 
                                hover:ring-1 hover:ring-offset-1 hover:ring-white hover:scale-110 
                                transition-all duration-150 ease-in-out transform-gpu`}
                      onMouseEnter={(e) => handleTooltip(e, tooltipContent)}
                      onMouseLeave={() => setTooltip(null)}
                      role="gridcell"
                      aria-label={tooltipContent || "No contributions"}
                      tabIndex={0}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 text-xs">
          <div className="flex items-center">
            <GitBranch className="h-3 w-3 text-gray-500 mr-1" />
            <a
              href={`https://github.com/${username}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors hover:underline"
            >
              View repositories
            </a>
          </div>

          <div className="flex items-center">
            <span className="mr-2 text-gray-500">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-2.5 h-2.5 rounded-sm ${getColor(level * 5)}`}
                  aria-label={`Level ${level} contributions`}
                />
              ))}
            </div>
            <span className="ml-1 text-gray-500">More</span>
          </div>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            ref={tooltipRef}
            className="absolute bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-xl 
                      z-10 pointer-events-none transform -translate-x-1/2 backdrop-blur-sm
                      border border-gray-700 animate-in fade-in duration-200"
            style={{
              top: `${tooltip.y - 35}px`,
              left: `${tooltip.x}px`,
              maxWidth: '180px',
            }}
          >
            {tooltip.content}
            <div className="absolute w-2 h-2 bg-gray-900 border-r border-b border-gray-700 
                          transform rotate-45 left-1/2 -ml-1 -bottom-1"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubContributions;
