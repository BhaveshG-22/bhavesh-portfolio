
import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { mockGithubData } from "../data/mockGithubData";

type ContributionDay = {
  contributionCount: number;
  date: string;
  level?: number;
};

type FormattedContribution = ContributionDay & { level: number };

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

const GitHubContributions = () => {
  const [data, setData] = useState<FormattedContribution[]>([]);

  useEffect(() => {
    const processed = mockGithubData.contributionDays.map((day) => {
      const count = day.contributionCount;
      let level = 0;
      if (count === 0) level = 0;
      else if (count === 1) level = 1;
      else if (count <= 4) level = 2;
      else if (count <= 9) level = 3;
      else level = 4;
      return { ...day, level };
    });
    setData(processed);
  }, []);

  const startDate = new Date(data[0]?.date || new Date());
  const endDate = new Date(data[data.length - 1]?.date || new Date());
  const dateMap = new Map(data.map((d) => [d.date, d]));

  const weeks: FormattedContribution[][] = [];
  let current = new Date(startDate);
  current.setDate(current.getDate() - current.getDay());

  while (current <= endDate) {
    const week: FormattedContribution[] = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = current.toISOString().split("T")[0];
      week.push(dateMap.get(dateStr) || { date: dateStr, contributionCount: 0, level: 0 });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  // Generate month labels
  const getMonthLabels = () => {
    const labels: { month: string, position: number }[] = [];
    let currentMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      week.forEach(day => {
        const date = new Date(day.date);
        const month = date.getMonth();
        if (month !== currentMonth) {
          currentMonth = month;
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          labels.push({
            month: monthNames[month],
            position: weekIndex
          });
        }
      });
    });
    return labels;
  };

  const monthLabels = getMonthLabels();

  const getColor = (level: number) => {
    return [
      "bg-gray-100 dark:bg-gray-800",
      "bg-green-200 dark:bg-green-700",
      "bg-green-400 dark:bg-green-600",
      "bg-green-600 dark:bg-green-500",
      "bg-green-800 dark:bg-green-300"
    ][level];
  };

  return (
    <div className="bg-black p-4 rounded-lg">
      <div className="mb-4 bg-blue-900/20 border border-blue-800 rounded-md p-3">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-300 mt-0.5 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-blue-300">Using Mock Data</h4>
            <p className="text-sm text-blue-400">Displaying hard-coded GitHub contribution data for demonstration purposes.</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex">
          <div className="flex flex-col gap-1 mr-2 mt-5 text-xs text-gray-400">
            {["Sun", "Tue", "Thu", "Sat"].map((day, i) => (
              <div key={i} className="h-3">{day}</div>
            ))}
          </div>
          
          <div>
            <div className="flex mb-1 text-xs text-gray-400">
              {monthLabels.map((label, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0"
                  style={{ 
                    position: 'relative', 
                    left: `${label.position * 13}px`,
                    width: 'max-content',
                    marginRight: '5px'
                  }}
                >
                  {label.month}
                </div>
              ))}
            </div>
            
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={day.date}
                      className={`w-3 h-3 ${getColor(day.level)} rounded-sm`}
                      title={`${day.contributionCount} contributions on ${new Date(day.date).toDateString()}`}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="flex items-center mt-4 gap-2">
              <span className="text-xs text-gray-400">Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div key={level} className={`w-3 h-3 ${getColor(level)} rounded-sm`}></div>
              ))}
              <span className="text-xs text-gray-400">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubContributions;
