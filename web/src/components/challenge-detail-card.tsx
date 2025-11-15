"use client";

import { useState } from "react";
import type { Challenge } from "@/data/challenges";

type ChallengeDetailCardProps = {
  challenge: Challenge;
  xpReward?: number;
  estimatedTime?: string;
  requirements?: string[];
  onStart?: () => void;
  onComplete?: () => void;
  isCompleted?: boolean;
  progress?: number;
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const TRADE_ICONS: Record<string, string> = {
  Electrical: "⚡",
  Plumbing: "🔧",
  Carpentry: "🪚",
  HVAC: "❄️",
  Welding: "🔥",
};

export function ChallengeDetailCard({
  challenge,
  xpReward = 50,
  estimatedTime,
  requirements = [],
  onStart,
  onComplete,
  isCompleted = false,
  progress = 0,
}: ChallengeDetailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full space-y-6">
      {/* Header Card */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{TRADE_ICONS[challenge.trade] || "📋"}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {challenge.title}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    DIFFICULTY_COLORS[challenge.difficulty] || DIFFICULTY_COLORS.Medium
                  }`}>
                    {challenge.difficulty}
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {challenge.trade}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
              {challenge.summary}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
            <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">XP Reward</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              +{xpReward}
            </div>
          </div>
          {estimatedTime && (
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Est. Time</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {estimatedTime}
              </div>
            </div>
          )}
          <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
            <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Status</div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {isCompleted ? "✅ Complete" : progress > 0 ? "🔄 In Progress" : "📝 Not Started"}
            </div>
          </div>
          {progress > 0 && (
            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <div className="text-sm font-medium text-green-700 dark:text-green-300">Progress</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {progress}%
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {progress > 0 && !isCompleted && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Completion</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{progress}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          {!isCompleted && (
            <>
              {progress === 0 && onStart && (
                <button
                  onClick={onStart}
                  className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                >
                  Start Challenge
                </button>
              )}
              {progress > 0 && onComplete && (
                <button
                  onClick={onComplete}
                  className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white transition-all hover:from-green-700 hover:to-green-800 hover:shadow-lg"
                >
                  Complete Challenge
                </button>
              )}
            </>
          )}
          {isCompleted && (
            <div className="flex-1 rounded-lg bg-green-100 px-6 py-3 text-center dark:bg-green-900/30">
              <span className="font-semibold text-green-700 dark:text-green-300">
                ✅ Challenge Completed!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Requirements Card */}
      {requirements.length > 0 && (
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-between"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Requirements
            </h2>
            <svg
              className={`h-5 w-5 text-gray-500 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isExpanded && (
            <ul className="mt-4 space-y-2">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 text-green-600">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{req}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

