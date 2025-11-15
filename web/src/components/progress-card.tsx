"use client";

import { useState } from "react";

type ProgressCardProps = {
  title: string;
  description?: string;
  current: number;
  max: number;
  icon?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red";
  onClick?: () => void;
  showDetails?: boolean;
};

const COLOR_CLASSES = {
  blue: "from-blue-400 to-blue-600",
  green: "from-green-400 to-green-600",
  purple: "from-purple-400 to-purple-600",
  orange: "from-orange-400 to-orange-600",
  red: "from-red-400 to-red-600",
};

const COLOR_BG = {
  blue: "bg-blue-50 dark:bg-blue-900/20",
  green: "bg-green-50 dark:bg-green-900/20",
  purple: "bg-purple-50 dark:bg-purple-900/20",
  orange: "bg-orange-50 dark:bg-orange-900/20",
  red: "bg-red-50 dark:bg-red-900/20",
};

export function ProgressCard({
  title,
  description,
  current,
  max,
  icon = "📊",
  color = "blue",
  onClick,
  showDetails = true,
}: ProgressCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const percentage = max > 0 ? Math.round((current / max) * 100) : 0;
  const isComplete = current >= max;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 transition-all ${
        isComplete
          ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:border-green-600 dark:from-green-900/20 dark:to-emerald-900/20"
          : `border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${
              onClick ? "cursor-pointer hover:border-gray-300 hover:shadow-lg dark:hover:border-gray-600" : ""
            }`
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${COLOR_CLASSES[color]} text-2xl shadow-lg`}>
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
              {description && (
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{description}</p>
              )}
            </div>
          </div>
          {isComplete && (
            <div className="flex-shrink-0">
              <span className="text-2xl">✅</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {showDetails && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {current} / {max}
              </span>
              <span className={`font-bold ${
                isComplete ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
              }`}>
                {percentage}%
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-full bg-gradient-to-r ${COLOR_CLASSES[color]} transition-all duration-500 ease-out ${
                  isHovered ? "shadow-lg" : ""
                }`}
                style={{ width: `${percentage}%` }}
              >
                <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
              {isComplete && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">Complete!</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Completion Badge */}
        {isComplete && (
          <div className="mt-4 rounded-lg bg-green-100 p-2 text-center dark:bg-green-900/30">
            <p className="text-xs font-semibold text-green-700 dark:text-green-300">
              🎉 Milestone Achieved!
            </p>
          </div>
        )}
      </div>

      {/* Hover Effect */}
      {onClick && isHovered && (
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5" />
      )}
    </div>
  );
}

// Grid of Progress Cards
type ProgressCardGridProps = {
  cards: Array<Omit<ProgressCardProps, "onClick"> & { id: string; onClick?: () => void }>;
  columns?: 1 | 2 | 3 | 4;
};

export function ProgressCardGrid({ cards, columns = 3 }: ProgressCardGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {cards.map((card) => (
        <ProgressCard key={card.id} {...card} />
      ))}
    </div>
  );
}

