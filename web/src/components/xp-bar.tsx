"use client";

import { useEffect, useState } from "react";
import type { ProgressTier } from "@/lib/api";

type XPBarProps = {
  currentXP: number;
  nextTierXP: number;
  tier: ProgressTier;
  level: number;
  animated?: boolean;
};

const TIER_THRESHOLDS: Record<ProgressTier, number> = {
  Apprentice: 0,
  Journeyman: 150,
  Master: 400,
  Contractor: 700,
  Boss: 1200,
};

const TIER_COLORS: Record<ProgressTier, string> = {
  Apprentice: "bg-gray-400",
  Journeyman: "bg-blue-500",
  Master: "bg-purple-600",
  Contractor: "bg-orange-500",
  Boss: "bg-yellow-500",
};

const TIER_GLOWS: Record<ProgressTier, string> = {
  Apprentice: "shadow-gray-400/50",
  Journeyman: "shadow-blue-500/50",
  Master: "shadow-purple-600/50",
  Contractor: "shadow-orange-500/50",
  Boss: "shadow-yellow-500/50",
};

export function XPBar({ currentXP, nextTierXP, tier, level, animated = true }: XPBarProps) {
  const [displayXP, setDisplayXP] = useState(animated ? TIER_THRESHOLDS[tier] : currentXP);
  const currentTierStart = TIER_THRESHOLDS[tier];
  const xpInCurrentTier = currentXP - currentTierStart;
  const xpNeededForNextTier = nextTierXP - currentTierStart;
  const progressPercent = Math.min((xpInCurrentTier / xpNeededForNextTier) * 100, 100);

  useEffect(() => {
    if (!animated) return;
    const duration = 1500;
    const startTime = Date.now();
    const startXP = displayXP;
    const targetXP = currentXP;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const newXP = startXP + (targetXP - startXP) * easeProgress;
      
      setDisplayXP(Math.floor(newXP));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [currentXP, animated, displayXP]);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            Level {level}
          </span>
          <span className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow-lg">
            {tier}
          </span>
        </div>
        <span className="font-mono text-gray-600 dark:text-gray-400">
          {Math.floor(displayXP)} / {nextTierXP} XP
        </span>
      </div>

      <div className="relative h-8 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full transition-all duration-700 ease-out ${TIER_COLORS[tier]} ${TIER_GLOWS[tier]} shadow-lg`}
          style={{ width: `${progressPercent}%` }}
        >
          <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
        
        {/* Milestone markers */}
        <div className="absolute inset-0 flex items-center">
          {[25, 50, 75].map((milestone) => (
            <div
              key={milestone}
              className="absolute h-full w-0.5 bg-white/40"
              style={{ left: `${milestone}%` }}
            />
          ))}
        </div>
      </div>

      {progressPercent >= 90 && progressPercent < 100 && (
        <p className="text-center text-xs font-medium text-yellow-600 dark:text-yellow-400 animate-pulse">
          🔥 Almost to the next tier!
        </p>
      )}
    </div>
  );
}