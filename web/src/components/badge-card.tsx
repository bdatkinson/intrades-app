"use client";

import { useState } from "react";
import type { Badge } from "@/lib/api";

type BadgeCardProps = {
  badge: Badge;
  earned?: boolean;
  showDetails?: boolean;
};

const CATEGORY_ICONS: Record<string, string> = {
  foundation: "🎯",
  legal: "⚖️",
  finance: "💰",
  marketing: "📢",
  operations: "⚙️",
  hr: "👥",
  scaling: "📈",
  achievement: "🏆",
  social: "🤝",
};

export function BadgeCard({ badge, earned = false, showDetails = true }: BadgeCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group relative h-32 w-32 cursor-pointer perspective-1000"
      onClick={() => showDetails && setFlipped(!flipped)}
      onMouseEnter={() => showDetails && setFlipped(true)}
      onMouseLeave={() => showDetails && setFlipped(false)}
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden">
          <div
            className={`flex h-full w-full flex-col items-center justify-center rounded-xl border-2 p-3 shadow-lg transition-all ${
              earned
                ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                : "border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 grayscale opacity-60"
            }`}
          >
            <div className="text-4xl mb-2">
              {earned ? badge.icon : "🔒"}
            </div>
            <p className={`text-center text-xs font-semibold ${earned ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}`}>
              {badge.name}
            </p>
            {earned && badge.dateEarned && (
              <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                {new Date(badge.dateEarned).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Back of card */}
        {showDetails && (
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <div className="flex h-full w-full flex-col rounded-xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 p-3 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{CATEGORY_ICONS[badge.category] || "⭐"}</span>
                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                  {badge.xpRequired} XP
                </span>
              </div>
              <p className="text-[10px] leading-tight text-gray-700 dark:text-gray-300 overflow-hidden">
                {badge.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {earned && (
        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs text-white shadow-lg animate-bounce">
          ✓
        </div>
      )}
    </div>
  );
}

export function BadgeGrid({ badges, userBadges }: { badges: Badge[]; userBadges: Badge[] }) {
  const earnedIds = new Set(userBadges.map(b => b.id));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {badges.map((badge) => (
        <BadgeCard
          key={badge.id}
          badge={badge}
          earned={earnedIds.has(badge.id)}
        />
      ))}
    </div>
  );
}