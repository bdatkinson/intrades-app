"use client";

import { useState } from "react";

export type AnalyticsData = {
  totalStudents: number;
  activeStudents: number;
  totalChallenges: number;
  completedChallenges: number;
  averageGrade: number;
  averageXP: number;
  completionRate: number;
  tierDistribution: Array<{ tier: string; count: number }>;
  challengePerformance: Array<{ challenge: string; averageGrade: number; completionRate: number }>;
  timeRange: "week" | "month" | "quarter" | "all";
};

type AnalyticsDashboardProps = {
  data: AnalyticsData;
  onTimeRangeChange?: (range: AnalyticsData["timeRange"]) => void;
};

export function AnalyticsDashboard({ data, onTimeRangeChange }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<AnalyticsData["timeRange"]>(data.timeRange);

  const handleTimeRangeChange = (range: AnalyticsData["timeRange"]) => {
    setTimeRange(range);
    onTimeRangeChange?.(range);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h2>
        {onTimeRangeChange && (
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value as AnalyticsData["timeRange"])}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="all">All Time</option>
          </select>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {data.totalStudents}
          </div>
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            {data.activeStudents} active
          </div>
        </div>

        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Challenge Completion
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {data.completedChallenges} / {data.totalChallenges}
          </div>
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            {data.completionRate.toFixed(1)}% rate
          </div>
        </div>

        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Grade</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {data.averageGrade.toFixed(1)}%
          </div>
        </div>

        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Average XP</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(data.averageXP).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tier Distribution */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Tier Distribution
        </h3>
        <div className="space-y-3">
          {data.tierDistribution.map((item) => {
            const percentage = data.totalStudents > 0 ? (item.count / data.totalStudents) * 100 : 0;
            return (
              <div key={item.tier} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.tier}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Challenge Performance */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Challenge Performance
        </h3>
        <div className="space-y-3">
          {data.challengePerformance.map((item, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100">{item.challenge}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {item.completionRate.toFixed(1)}% completion
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {item.averageGrade.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">avg grade</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

