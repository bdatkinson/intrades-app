"use client";

import { useEffect, useState } from "react";

type ProgressData = {
  label: string;
  value: number;
  max: number;
  color?: string;
};

type ProgressVisualizationProps = {
  data: ProgressData[];
  type?: "bar" | "radial" | "circular";
  showLabels?: boolean;
  showPercentages?: boolean;
  animated?: boolean;
};

export function ProgressVisualization({
  data,
  type = "bar",
  showLabels = true,
  showPercentages = true,
  animated = true,
}: ProgressVisualizationProps) {
  const [displayValues, setDisplayValues] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!animated) {
      const initial: Record<string, number> = {};
      data.forEach((item) => {
        initial[item.label] = item.value;
      });
      setDisplayValues(initial);
      return;
    }

    // Animate values
    const duration = 1500;
    const startTime = Date.now();
    const startValues: Record<string, number> = {};
    data.forEach((item) => {
      startValues[item.label] = 0;
    });

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const newValues: Record<string, number> = {};
      data.forEach((item) => {
        newValues[item.label] = Math.floor(
          startValues[item.label] + (item.value - startValues[item.label]) * easeProgress
        );
      });
      
      setDisplayValues(newValues);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [data, animated]);

  if (type === "radial" || type === "circular") {
    return <RadialProgress data={data} displayValues={displayValues} showLabels={showLabels} showPercentages={showPercentages} />;
  }

  return (
    <div className="w-full space-y-4">
      {data.map((item, index) => {
        const displayValue = displayValues[item.label] ?? item.value;
        const percentage = item.max > 0 ? Math.round((displayValue / item.max) * 100) : 0;
        const color = item.color || "blue";

        return (
          <div key={item.label} className="space-y-2">
            {showLabels && (
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
                {showPercentages && (
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {displayValue} / {item.max} ({percentage}%)
                  </span>
                )}
              </div>
            )}
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-full bg-gradient-to-r transition-all duration-500 ease-out ${
                  color === "blue" ? "from-blue-400 to-blue-600" :
                  color === "green" ? "from-green-400 to-green-600" :
                  color === "purple" ? "from-purple-400 to-purple-600" :
                  color === "orange" ? "from-orange-400 to-orange-600" :
                  color === "red" ? "from-red-400 to-red-600" :
                  "from-gray-400 to-gray-600"
                }`}
                style={{ width: `${percentage}%` }}
              >
                <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RadialProgress({
  data,
  displayValues,
  showLabels,
  showPercentages,
}: {
  data: ProgressData[];
  displayValues: Record<string, number>;
  showLabels: boolean;
  showPercentages: boolean;
}) {
  const total = data.reduce((sum, item) => sum + item.max, 0);
  const completed = data.reduce((sum, item) => sum + (displayValues[item.label] ?? item.value), 0);
  const overallPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Main Radial Progress */}
      <div className="relative">
        <svg className="h-48 w-48 -rotate-90 transform">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-blue-600 transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {overallPercentage}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
          </div>
        </div>
      </div>

      {/* Individual Items */}
      {showLabels && (
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
          {data.map((item) => {
            const displayValue = displayValues[item.label] ?? item.value;
            const percentage = item.max > 0 ? Math.round((displayValue / item.max) * 100) : 0;
            const color = item.color || "blue";

            return (
              <div key={item.label} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex-shrink-0">
                  <div className={`h-3 w-3 rounded-full ${
                    color === "blue" ? "bg-blue-500" :
                    color === "green" ? "bg-green-500" :
                    color === "purple" ? "bg-purple-500" :
                    color === "orange" ? "bg-orange-500" :
                    color === "red" ? "bg-red-500" :
                    "bg-gray-500"
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                    {showPercentages && (
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {percentage}%
                      </span>
                    )}
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full transition-all duration-500 ${
                        color === "blue" ? "bg-blue-500" :
                        color === "green" ? "bg-green-500" :
                        color === "purple" ? "bg-purple-500" :
                        color === "orange" ? "bg-orange-500" :
                        color === "red" ? "bg-red-500" :
                        "bg-gray-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

