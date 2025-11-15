"use client";

import { useEffect, useState } from "react";

type StreakCounterProps = {
  streakDays: number;
  lastActivityDate?: string;
  animated?: boolean;
};

export function StreakCounter({ streakDays, lastActivityDate, animated = true }: StreakCounterProps) {
  const [displayStreak, setDisplayStreak] = useState(animated ? 0 : streakDays);
  const [isFlameVisible, setIsFlameVisible] = useState(false);

  useEffect(() => {
    if (!animated) {
      setDisplayStreak(streakDays);
      return;
    }

    const duration = 1000;
    const startTime = Date.now();
    const startStreak = 0;
    const targetStreak = streakDays;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const newStreak = Math.floor(startStreak + (targetStreak - startStreak) * easeProgress);
      
      setDisplayStreak(newStreak);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Trigger flame animation when animation completes
        setIsFlameVisible(true);
        setTimeout(() => setIsFlameVisible(false), 2000);
      }
    };

    requestAnimationFrame(animate);
  }, [streakDays, animated]);

  const isActive = streakDays > 0;
  const isLongStreak = streakDays >= 7;
  const isVeryLongStreak = streakDays >= 30;

  // Calculate days since last activity
  const daysSinceLastActivity = lastActivityDate
    ? Math.floor((Date.now() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="flex items-center gap-3 rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-4 dark:border-orange-800 dark:from-orange-900/20 dark:to-red-900/20">
      {/* Flame Icon */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className={`text-5xl transition-all duration-500 ${isFlameVisible ? "animate-bounce scale-110" : ""}`}>
          {isActive ? "🔥" : "❄️"}
        </div>
        {isFlameVisible && (
          <div className="absolute inset-0 animate-ping">
            <span className="text-5xl opacity-75">🔥</span>
          </div>
        )}
      </div>

      {/* Streak Info */}
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {displayStreak}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            day{displayStreak !== 1 ? "s" : ""} streak
          </span>
        </div>
        
        {isActive ? (
          <div className="mt-1">
            {isVeryLongStreak && (
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                🏆 Legendary Streak!
              </p>
            )}
            {isLongStreak && !isVeryLongStreak && (
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                🔥 Keep it going!
              </p>
            )}
            {!isLongStreak && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Keep learning daily!
              </p>
            )}
          </div>
        ) : (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Start your streak today!
          </p>
        )}

        {lastActivityDate && daysSinceLastActivity !== null && daysSinceLastActivity > 0 && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Last active: {daysSinceLastActivity} day{daysSinceLastActivity !== 1 ? "s" : ""} ago
          </p>
        )}
      </div>

      {/* Streak Milestones */}
      {isActive && (
        <div className="flex flex-col items-end gap-1">
          {streakDays >= 7 && (
            <span className="rounded-full bg-orange-200 px-2 py-0.5 text-xs font-semibold text-orange-800 dark:bg-orange-800 dark:text-orange-200">
              7+ 🔥
            </span>
          )}
          {streakDays >= 30 && (
            <span className="rounded-full bg-purple-200 px-2 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-800 dark:text-purple-200">
              30+ 🏆
            </span>
          )}
          {streakDays >= 100 && (
            <span className="rounded-full bg-yellow-200 px-2 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
              100+ ⭐
            </span>
          )}
        </div>
      )}
    </div>
  );
}

