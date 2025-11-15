"use client";

import { useState } from "react";

export type ProgressData = {
  label: string;
  value: number;
  color?: string;
};

type ProgressOverviewChartsProps = {
  cohortProgress?: ProgressData[];
  tierDistribution?: ProgressData[];
  challengeCompletion?: ProgressData[];
  xpDistribution?: { min: number; max: number; count: number }[];
  timeRange?: "week" | "month" | "all";
  onTimeRangeChange?: (range: "week" | "month" | "all") => void;
};

export function ProgressOverviewCharts({
  cohortProgress,
  tierDistribution,
  challengeCompletion,
  xpDistribution,
  timeRange = "all",
  onTimeRangeChange,
}: ProgressOverviewChartsProps) {
  const [selectedChart, setSelectedChart] = useState<"progress" | "tiers" | "challenges" | "xp">(
    "progress"
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Progress Overview</h2>
        <div className="flex gap-2">
          {onTimeRangeChange && (
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value as any)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          )}
        </div>
      </div>

      {/* Chart Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {cohortProgress && (
          <button
            onClick={() => setSelectedChart("progress")}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedChart === "progress"
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            Cohort Progress
          </button>
        )}
        {tierDistribution && (
          <button
            onClick={() => setSelectedChart("tiers")}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedChart === "tiers"
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            Tier Distribution
          </button>
        )}
        {challengeCompletion && (
          <button
            onClick={() => setSelectedChart("challenges")}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedChart === "challenges"
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            Challenge Completion
          </button>
        )}
        {xpDistribution && (
          <button
            onClick={() => setSelectedChart("xp")}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedChart === "xp"
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            XP Distribution
          </button>
        )}
      </div>

      {/* Charts */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {selectedChart === "progress" && cohortProgress && (
          <CohortProgressChart data={cohortProgress} />
        )}
        {selectedChart === "tiers" && tierDistribution && (
          <TierDistributionChart data={tierDistribution} />
        )}
        {selectedChart === "challenges" && challengeCompletion && (
          <ChallengeCompletionChart data={challengeCompletion} />
        )}
        {selectedChart === "xp" && xpDistribution && (
          <XPDistributionChart data={xpDistribution} />
        )}
      </div>
    </div>
  );
}

function CohortProgressChart({ data }: { data: ProgressData[] }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cohort Progress</h3>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const color = item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`;

          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                <span className="text-gray-600 dark:text-gray-400">{item.value}%</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TierDistributionChart({ data }: { data: ProgressData[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tier Distribution</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
          const color = item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`;

          return (
            <div key={item.label} className="text-center">
              <div
                className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {item.value}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{percentage}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChallengeCompletionChart({ data }: { data: ProgressData[] }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Challenge Completion Rate
      </h3>
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const color = item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`;

          return (
            <div key={item.label} className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </div>
              <div className="flex-1">
                <div className="h-6 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                  />
                </div>
              </div>
              <div className="w-16 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                {item.value}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function XPDistributionChart({
  data,
}: {
  data: { min: number; max: number; count: number }[];
}) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">XP Distribution</h3>
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = (item.count / maxCount) * 100;
          const color = `hsl(${(index * 240) / data.length}, 70%, 50%)`;

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {item.min.toLocaleString()} - {item.max.toLocaleString()} XP
                </span>
                <span className="text-gray-600 dark:text-gray-400">{item.count} students</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

