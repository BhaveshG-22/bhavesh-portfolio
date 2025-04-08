import React, { useState, useEffect } from "react";
import { AlertTriangle, Info } from "lucide-react";

// Utility function to replace cn from @/lib/utils
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Full mock data included in the component
const mockGithubData = {
  userName: "hkirat",
  totalContributions: 1711,
  contributionDays: [
    { contributionCount: 2, date: "2024-04-07" },
    { contributionCount: 9, date: "2024-04-08" },
    { contributionCount: 3, date: "2024-04-09" },
    { contributionCount: 1, date: "2024-04-10" },
    { contributionCount: 14, date: "2024-04-11" },
    { contributionCount: 10, date: "2024-04-12" },
    { contributionCount: 9, date: "2024-04-13" },
    { contributionCount: 25, date: "2024-04-14" },
    { contributionCount: 11, date: "2024-04-15" },
    { contributionCount: 11, date: "2024-04-16" },
    { contributionCount: 3, date: "2024-04-17" },
    { contributionCount: 11, date: "2024-04-18" },
    { contributionCount: 47, date: "2024-04-19" },
    { contributionCount: 11, date: "2024-04-20" },
    { contributionCount: 37, date: "2024-04-21" },
    { contributionCount: 42, date: "2024-04-22" },
    { contributionCount: 1, date: "2024-04-23" },
    { contributionCount: 0, date: "2024-04-24" },
    { contributionCount: 3, date: "2024-04-25" },
    { contributionCount: 0, date: "2024-04-26" },
    { contributionCount: 2, date: "2024-04-27" },
    { contributionCount: 3, date: "2024-04-28" },
    { contributionCount: 0, date: "2024-04-29" },
    { contributionCount: 20, date: "2024-04-30" },
    { contributionCount: 1, date: "2024-05-01" },
    { contributionCount: 0, date: "2024-05-02" },
    { contributionCount: 3, date: "2024-05-03" },
    { contributionCount: 1, date: "2024-05-04" },
    { contributionCount: 3, date: "2024-05-05" },
    { contributionCount: 10, date: "2024-05-06" },
    { contributionCount: 35, date: "2024-05-07" },
    { contributionCount: 1, date: "2024-05-08" },
    { contributionCount: 0, date: "2024-05-09" },
    { contributionCount: 0, date: "2024-05-10" },
    { contributionCount: 2, date: "2024-05-11" },
    { contributionCount: 27, date: "2024-05-12" },
    { contributionCount: 56, date: "2024-05-13" },
    { contributionCount: 1, date: "2024-05-14" },
    { contributionCount: 3, date: "2024-05-15" },
    { contributionCount: 0, date: "2024-05-16" },
    { contributionCount: 7, date: "2024-05-17" },
    { contributionCount: 0, date: "2024-05-18" },
    { contributionCount: 16, date: "2024-05-19" },
    { contributionCount: 15, date: "2024-05-20" },
    { contributionCount: 3, date: "2024-05-21" },
    { contributionCount: 9, date: "2024-05-22" },
    { contributionCount: 0, date: "2024-05-23" },
    { contributionCount: 0, date: "2024-05-24" },
    { contributionCount: 0, date: "2024-05-25" },
    { contributionCount: 2, date: "2024-05-26" },
    { contributionCount: 4, date: "2024-05-27" },
    { contributionCount: 3, date: "2024-05-28" },
    { contributionCount: 4, date: "2024-05-29" },
    { contributionCount: 3, date: "2024-05-30" },
    { contributionCount: 0, date: "2024-05-31" },
    { contributionCount: 5, date: "2024-06-01" },
    { contributionCount: 3, date: "2024-06-02" },
    { contributionCount: 11, date: "2024-06-03" },
    { contributionCount: 6, date: "2024-06-04" },
    { contributionCount: 11, date: "2024-06-05" },
    { contributionCount: 20, date: "2024-06-06" },
    { contributionCount: 8, date: "2024-06-07" },
    { contributionCount: 2, date: "2024-06-08" },
    { contributionCount: 1, date: "2024-06-09" },
    { contributionCount: 10, date: "2024-06-10" },
    { contributionCount: 13, date: "2024-06-11" },
    { contributionCount: 6, date: "2024-06-12" },
    { contributionCount: 3, date: "2024-06-13" },
    { contributionCount: 3, date: "2024-06-14" },
    { contributionCount: 8, date: "2024-06-15" },
    { contributionCount: 5, date: "2024-06-16" },
    { contributionCount: 1, date: "2024-06-17" },
    { contributionCount: 4, date: "2024-06-18" },
    { contributionCount: 15, date: "2024-06-19" },
    { contributionCount: 26, date: "2024-06-20" },
    { contributionCount: 4, date: "2024-06-21" },
    { contributionCount: 2, date: "2024-06-22" },
    { contributionCount: 6, date: "2024-06-23" },
    { contributionCount: 1, date: "2024-06-24" },
    { contributionCount: 5, date: "2024-06-25" },
    { contributionCount: 9, date: "2024-06-26" },
    { contributionCount: 3, date: "2024-06-27" },
    { contributionCount: 2, date: "2024-06-28" },
    { contributionCount: 6, date: "2024-06-29" },
    { contributionCount: 2, date: "2024-06-30" },
    { contributionCount: 3, date: "2024-07-01" },
    { contributionCount: 0, date: "2024-07-02" },
    { contributionCount: 1, date: "2024-07-03" },
    { contributionCount: 1, date: "2024-07-04" },
    { contributionCount: 2, date: "2024-07-05" },
    { contributionCount: 0, date: "2024-07-06" },
    { contributionCount: 0, date: "2024-07-07" },
    { contributionCount: 1, date: "2024-07-08" },
    { contributionCount: 0, date: "2024-07-09" },
    { contributionCount: 19, date: "2024-07-10" },
    { contributionCount: 4, date: "2024-07-11" },
    { contributionCount: 4, date: "2024-07-12" },
    { contributionCount: 2, date: "2024-07-13" },
    { contributionCount: 2, date: "2024-07-14" },
    { contributionCount: 1, date: "2024-07-15" },
    { contributionCount: 0, date: "2024-07-16" },
    { contributionCount: 2, date: "2024-07-17" },
    { contributionCount: 4, date: "2024-07-18" },
    { contributionCount: 1, date: "2024-07-19" },
    { contributionCount: 6, date: "2024-07-20" },
    { contributionCount: 3, date: "2024-07-21" },
    { contributionCount: 5, date: "2024-07-22" },
    { contributionCount: 1, date: "2024-07-23" },
    { contributionCount: 2, date: "2024-07-24" },
    { contributionCount: 2, date: "2024-07-25" },
    { contributionCount: 4, date: "2024-07-26" },
    { contributionCount: 9, date: "2024-07-27" },
    { contributionCount: 0, date: "2024-07-28" },
    { contributionCount: 0, date: "2024-07-29" },
    { contributionCount: 4, date: "2024-07-30" },
    { contributionCount: 2, date: "2024-07-31" },
    { contributionCount: 8, date: "2024-08-01" },
    { contributionCount: 0, date: "2024-08-02" },
    { contributionCount: 3, date: "2024-08-03" },
    { contributionCount: 4, date: "2024-08-04" },
    { contributionCount: 6, date: "2024-08-05" },
    { contributionCount: 0, date: "2024-08-06" },
    { contributionCount: 9, date: "2024-08-07" },
    { contributionCount: 0, date: "2024-08-08" },
    { contributionCount: 1, date: "2024-08-09" },
    { contributionCount: 2, date: "2024-08-10" },
    { contributionCount: 9, date: "2024-08-11" },
    { contributionCount: 3, date: "2024-08-12" },
    { contributionCount: 0, date: "2024-08-13" },
    { contributionCount: 8, date: "2024-08-14" },
    { contributionCount: 0, date: "2024-08-15" },
    { contributionCount: 7, date: "2024-08-16" },
    { contributionCount: 3, date: "2024-08-17" },
    { contributionCount: 0, date: "2024-08-18" },
    { contributionCount: 0, date: "2024-08-19" },
    { contributionCount: 14, date: "2024-08-20" },
    { contributionCount: 3, date: "2024-08-21" },
    { contributionCount: 0, date: "2024-08-22" },
    { contributionCount: 5, date: "2024-08-23" },
    { contributionCount: 3, date: "2024-08-24" },
    { contributionCount: 3, date: "2024-08-25" },
    { contributionCount: 17, date: "2024-08-26" },
    { contributionCount: 10, date: "2024-08-27" },
    { contributionCount: 0, date: "2024-08-28" },
    { contributionCount: 9, date: "2024-08-29" },
    { contributionCount: 10, date: "2024-08-30" },
    { contributionCount: 6, date: "2024-08-31" },
    { contributionCount: 3, date: "2024-09-01" },
    { contributionCount: 1, date: "2024-09-02" },
    { contributionCount: 1, date: "2024-09-03" },
    { contributionCount: 0, date: "2024-09-04" },
    { contributionCount: 4, date: "2024-09-05" },
    { contributionCount: 6, date: "2024-09-06" },
    { contributionCount: 3, date: "2024-09-07" },
    { contributionCount: 4, date: "2024-09-08" },
    { contributionCount: 6, date: "2024-09-09" },
    { contributionCount: 1, date: "2024-09-10" },
    { contributionCount: 3, date: "2024-09-11" },
    { contributionCount: 2, date: "2024-09-12" },
    { contributionCount: 0, date: "2024-09-13" },
    { contributionCount: 4, date: "2024-09-14" },
    { contributionCount: 4, date: "2024-09-15" },
    { contributionCount: 15, date: "2024-09-16" },
    { contributionCount: 23, date: "2024-09-17" },
    { contributionCount: 1, date: "2024-09-18" },
    { contributionCount: 7, date: "2024-09-19" },
    { contributionCount: 1, date: "2024-09-20" },
    { contributionCount: 10, date: "2024-09-21" },
    { contributionCount: 10, date: "2024-09-22" },
    { contributionCount: 0, date: "2024-09-23" },
    { contributionCount: 2, date: "2024-09-24" },
    { contributionCount: 0, date: "2024-09-25" },
    { contributionCount: 5, date: "2024-09-26" },
    { contributionCount: 2, date: "2024-09-27" },
    { contributionCount: 4, date: "2024-09-28" },
    { contributionCount: 7, date: "2024-09-29" },
    { contributionCount: 3, date: "2024-09-30" },
    { contributionCount: 4, date: "2024-10-01" },
    { contributionCount: 4, date: "2024-10-02" },
    { contributionCount: 4, date: "2024-10-03" },
    { contributionCount: 4, date: "2024-10-04" },
    { contributionCount: 0, date: "2024-10-05" },
    { contributionCount: 3, date: "2024-10-06" },
    { contributionCount: 5, date: "2024-10-07" },
    { contributionCount: 5, date: "2024-10-08" },
    { contributionCount: 2, date: "2024-10-09" },
    { contributionCount: 1, date: "2024-10-10" },
    { contributionCount: 2, date: "2024-10-11" },
    { contributionCount: 0, date: "2024-10-12" },
    { contributionCount: 2, date: "2024-10-13" },
    { contributionCount: 0, date: "2024-10-14" },
    { contributionCount: 1, date: "2024-10-15" },
    { contributionCount: 0, date: "2024-10-16" },
    { contributionCount: 2, date: "2024-10-17" },
    { contributionCount: 1, date: "2024-10-18" },
    { contributionCount: 0, date: "2024-10-19" },
    { contributionCount: 3, date: "2024-10-20" },
    { contributionCount: 8, date: "2024-10-21" },
    { contributionCount: 2, date: "2024-10-22" },
    { contributionCount: 0, date: "2024-10-23" },
    { contributionCount: 3, date: "2024-10-24" },
    { contributionCount: 1, date: "2024-10-25" },
    { contributionCount: 4, date: "2024-10-26" },
    { contributionCount: 3, date: "2024-10-27" },
    { contributionCount: 18, date: "2024-10-28" },
    { contributionCount: 1, date: "2024-10-29" },
    { contributionCount: 1, date: "2024-10-30" },
    { contributionCount: 0, date: "2024-10-31" },
    { contributionCount: 4, date: "2024-11-01" },
    { contributionCount: 8, date: "2024-11-02" },
    { contributionCount: 4, date: "2024-11-03" },
    { contributionCount: 4, date: "2024-11-04" },
    { contributionCount: 6, date: "2024-11-05" },
    { contributionCount: 6, date: "2024-11-06" },
    { contributionCount: 6, date: "2024-11-07" },
    { contributionCount: 5, date: "2024-11-08" },
    { contributionCount: 21, date: "2024-11-09" },
    { contributionCount: 2, date: "2024-11-10" },
    { contributionCount: 7, date: "2024-11-11" },
    { contributionCount: 29, date: "2024-11-12" },
    { contributionCount: 0, date: "2024-11-13" },
    { contributionCount: 0, date: "2024-11-14" },
    { contributionCount: 3, date: "2024-11-15" },
    { contributionCount: 3, date: "2024-11-16" },
    { contributionCount: 5, date: "2024-11-17" },
    { contributionCount: 0, date: "2024-11-18" },
    { contributionCount: 1, date: "2024-11-19" },
    { contributionCount: 1, date: "2024-11-20" },
    { contributionCount: 5, date: "2024-11-21" },
    { contributionCount: 3, date: "2024-11-22" },
    { contributionCount: 1, date: "2024-11-23" },
    { contributionCount: 9, date: "2024-11-24" },
    { contributionCount: 1, date: "2024-11-25" },
    { contributionCount: 5, date: "2024-11-26" },
    { contributionCount: 4, date: "2024-11-27" },
    { contributionCount: 6, date: "2024-11-28" },
    { contributionCount: 7, date: "2024-11-29" },
    { contributionCount: 2, date: "2024-11-30" },
    { contributionCount: 1, date: "2024-12-01" },
    { contributionCount: 0, date: "2024-12-02" },
    { contributionCount: 0, date: "2024-12-03" },
    { contributionCount: 4, date: "2024-12-04" },
    { contributionCount: 2, date: "2024-12-05" },
    { contributionCount: 3, date: "2024-12-06" },
    { contributionCount: 8, date: "2024-12-07" },
    { contributionCount: 19, date: "2024-12-08" },
    { contributionCount: 3, date: "2024-12-09" },
    { contributionCount: 1, date: "2024-12-10" },
    { contributionCount: 3, date: "2024-12-11" },
    { contributionCount: 6, date: "2024-12-12" },
    { contributionCount: 0, date: "2024-12-13" },
    { contributionCount: 2, date: "2024-12-14" },
    { contributionCount: 0, date: "2024-12-15" },
    { contributionCount: 0, date: "2024-12-16" },
    { contributionCount: 4, date: "2024-12-17" },
    { contributionCount: 1, date: "2024-12-18" },
    { contributionCount: 1, date: "2024-12-19" },
    { contributionCount: 0, date: "2024-12-20" },
    { contributionCount: 0, date: "2024-12-21" },
    { contributionCount: 3, date: "2024-12-22" },
    { contributionCount: 2, date: "2024-12-23" },
    { contributionCount: 0, date: "2024-12-24" },
    { contributionCount: 2, date: "2024-12-25" },
    { contributionCount: 1, date: "2024-12-26" },
    { contributionCount: 3, date: "2024-12-27" },
    { contributionCount: 2, date: "2024-12-28" },
    { contributionCount: 3, date: "2024-12-29" },
    { contributionCount: 7, date: "2024-12-30" },
    { contributionCount: 17, date: "2024-12-31" },
    { contributionCount: 4, date: "2025-01-01" },
    { contributionCount: 0, date: "2025-01-02" },
    { contributionCount: 1, date: "2025-01-03" },
    { contributionCount: 2, date: "2025-01-04" },
    { contributionCount: 0, date: "2025-01-05" },
    { contributionCount: 0, date: "2025-01-06" },
    { contributionCount: 0, date: "2025-01-07" },
    { contributionCount: 0, date: "2025-01-08" },
    { contributionCount: 16, date: "2025-01-09" },
    { contributionCount: 1, date: "2025-01-10" },
    { contributionCount: 4, date: "2025-01-11" },
    { contributionCount: 6, date: "2025-01-12" },
    { contributionCount: 0, date: "2025-01-13" },
    { contributionCount: 2, date: "2025-01-14" },
    { contributionCount: 0, date: "2025-01-15" },
    { contributionCount: 10, date: "2025-01-16" },
    { contributionCount: 11, date: "2025-01-17" },
    { contributionCount: 5, date: "2025-01-18" },
    { contributionCount: 3, date: "2025-01-19" },
    { contributionCount: 1, date: "2025-01-20" },
    { contributionCount: 0, date: "2025-01-21" },
    { contributionCount: 0, date: "2025-01-22" },
    { contributionCount: 2, date: "2025-01-23" },
    { contributionCount: 7, date: "2025-01-24" },
    { contributionCount: 2, date: "2025-01-25" },
    { contributionCount: 1, date: "2025-01-26" },
    { contributionCount: 0, date: "2025-01-27" },
    { contributionCount: 0, date: "2025-01-28" },
    { contributionCount: 0, date: "2025-01-29" },
    { contributionCount: 1, date: "2025-01-30" },
    { contributionCount: 5, date: "2025-01-31" },
    { contributionCount: 0, date: "2025-02-01" },
    { contributionCount: 27, date: "2025-02-02" },
    { contributionCount: 2, date: "2025-02-03" },
    { contributionCount: 0, date: "2025-02-04" },
    { contributionCount: 0, date: "2025-02-05" },
    { contributionCount: 1, date: "2025-02-06" },
    { contributionCount: 1, date: "2025-02-07" },
    { contributionCount: 0, date: "2025-02-08" },
    { contributionCount: 1, date: "2025-02-09" },
    { contributionCount: 2, date: "2025-02-10" },
    { contributionCount: 1, date: "2025-02-11" },
    { contributionCount: 11, date: "2025-02-12" },
    { contributionCount: 3, date: "2025-02-13" },
    { contributionCount: 0, date: "2025-02-14" },
    { contributionCount: 4, date: "2025-02-15" },
    { contributionCount: 41, date: "2025-02-16" },
    { contributionCount: 0, date: "2025-02-17" },
    { contributionCount: 0, date: "2025-02-18" },
    { contributionCount: 0, date: "2025-02-19" },
    { contributionCount: 0, date: "2025-02-20" },
    { contributionCount: 1, date: "2025-02-21" },
    { contributionCount: 4, date: "2025-02-22" },
    { contributionCount: 7, date: "2025-02-23" },
    { contributionCount: 21, date: "2025-02-24" },
    { contributionCount: 0, date: "2025-02-25" },
    { contributionCount: 0, date: "2025-02-26" },
    { contributionCount: 0, date: "2025-02-27" },
    { contributionCount: 1, date: "2025-02-28" },
    { contributionCount: 4, date: "2025-03-01" },
    { contributionCount: 3, date: "2025-03-02" },
    { contributionCount: 8, date: "2025-03-03" },
    { contributionCount: 28, date: "2025-03-04" },
    { contributionCount: 7, date: "2025-03-05" },
    { contributionCount: 2, date: "2025-03-06" },
    { contributionCount: 2, date: "2025-03-07" },
    { contributionCount: 2, date: "2025-03-08" },
    { contributionCount: 5, date: "2025-03-09" },
    { contributionCount: 11, date: "2025-03-10" },
    { contributionCount: 8, date: "2025-03-11" },
    { contributionCount: 1, date: "2025-03-12" },
    { contributionCount: 0, date: "2025-03-13" },
    { contributionCount: 0, date: "2025-03-14" },
    { contributionCount: 1, date: "2025-03-15" },
    { contributionCount: 1, date: "2025-03-16" },
    { contributionCount: 0, date: "2025-03-17" },
    { contributionCount: 5, date: "2025-03-18" },
    { contributionCount: 1, date: "2025-03-19" },
    { contributionCount: 2, date: "2025-03-20" },
    { contributionCount: 2, date: "2025-03-21" },
    { contributionCount: 9, date: "2025-03-22" },
    { contributionCount: 0, date: "2025-03-23" },
    { contributionCount: 0, date: "2025-03-24" },
    { contributionCount: 0, date: "2025-03-25" },
    { contributionCount: 0, date: "2025-03-26" },
    { contributionCount: 3, date: "2025-03-27" },
    { contributionCount: 1, date: "2025-03-28" },
    { contributionCount: 0, date: "2025-03-29" },
    { contributionCount: 0, date: "2025-03-30" },
    { contributionCount: 2, date: "2025-03-31" },
    { contributionCount: 0, date: "2025-04-01" },
    { contributionCount: 0, date: "2025-04-02" },
    { contributionCount: 1, date: "2025-04-03" },
    { contributionCount: 2, date: "2025-04-04" },
    { contributionCount: 1, date: "2025-04-05" },
    { contributionCount: 1, date: "2025-04-06" },
    { contributionCount: 0, date: "2025-04-07" },
    { contributionCount: 1, date: "2025-04-08" }
  ]
};

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
      <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Using Mock Data</h4>
            <div className="text-sm text-blue-700 dark:text-blue-400">
              Displaying hard-coded GitHub contribution data for demonstration purposes.
            </div>
          </div>
        </div>
      </div>
      
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
            <div className="flex gap-1">
              {contributionData.weeks?.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {/* For each week, render 7 days (Sunday to Saturday) */}
                  {week.contributionDays.map((day, dayIndex) => (
                    <div key={`${weekIndex}-${dayIndex}`} className="relative group">
                      <button
                        className={cn(
                          "w-3 h-3 rounded-sm border transition-all",
                          getContributionColor(day.level || 0),
                          "hover:ring-2 hover:ring-teal-300 dark:hover:ring-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        )}
                        aria-label={`${day.contributionCount} contributions on ${formatDate(day.date)}`}
                      />
                      {/* Simplified tooltip that shows on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        {formatDate(day.date)}: {day.contributionCount} contribution{day.contributionCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
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