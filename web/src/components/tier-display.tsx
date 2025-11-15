"use client";

import type { ProgressTier, UserProgression } from "@/lib/api";

type TierDisplayProps = {
  progression: UserProgression;
  showAllTiers?: boolean;
};

const TIER_THRESHOLDS: Record<ProgressTier, number> = {
  Apprentice: 0,
  Journeyman: 150,
  Master: 400,
  Contractor: 700,
  Boss: 1200,
};

const TIER_COLORS: Record<ProgressTier, string> = {
  Apprentice: "from-gray-400 to-gray-500",
  Journeyman: "from-blue-500 to-blue-600",
  Master: "from-purple-600 to-purple-700",
  Contractor: "from-orange-500 to-orange-600",
  Boss: "from-yellow-500 to-yellow-600",
};

const TIER_BORDER_COLORS: Record<ProgressTier, string> = {
  Apprentice: "border-gray-500",
  Journeyman: "border-blue-500",
  Master: "border-purple-500",
  Contractor: "border-orange-500",
  Boss: "border-yellow-500",
};

const TIER_ICONS: Record<ProgressTier, string> = {
  Apprentice: "🌱",
  Journeyman: "📚",
  Master: "🎓",
  Contractor: "💼",
  Boss: "👑",
};

const TIER_DESCRIPTIONS: Record<ProgressTier, string> = {
  Apprentice: "Starting your journey",
  Journeyman: "Building competency",
  Master: "Advanced skills",
  Contractor: "Business ready",
  Boss: "Master entrepreneur",
};

const TIER_ORDER: ProgressTier[] = ["Apprentice", "Journeyman", "Master", "Contractor", "Boss"];

export function TierDisplay({ progression, showAllTiers = true }: TierDisplayProps) {
  const currentTierIndex = TIER_ORDER.indexOf(progression.tier);
  const nextTier = currentTierIndex < TIER_ORDER.length - 1 ? TIER_ORDER[currentTierIndex + 1] : null;
  const xpInCurrentTier = progression.xp - TIER_THRESHOLDS[progression.tier];
  const xpNeededForNextTier = nextTier 
    ? TIER_THRESHOLDS[nextTier] - TIER_THRESHOLDS[progression.tier]
    : 0;
  const progressPercent = nextTier 
    ? Math.min((xpInCurrentTier / xpNeededForNextTier) * 100, 100)
    : 100;

  return (
    <div className="w-full space-y-6">
      {/* Current Tier Card */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${TIER_COLORS[progression.tier]} p-6 text-white shadow-xl`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{TIER_ICONS[progression.tier]}</span>
              <div>
                <h3 className="text-2xl font-bold">{progression.tier}</h3>
                <p className="text-sm opacity-90">{TIER_DESCRIPTIONS[progression.tier]}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{progression.xp}</div>
              <div className="text-sm opacity-90">Total XP</div>
            </div>
          </div>

          {nextTier && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress to {nextTier}</span>
                <span>{Math.floor(progressPercent)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-white transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs opacity-90">
                <span>{xpInCurrentTier} XP in this tier</span>
                <span>{xpNeededForNextTier - xpInCurrentTier} XP to next tier</span>
              </div>
            </div>
          )}

          {!nextTier && (
            <div className="text-center py-2">
              <p className="text-lg font-semibold">🏆 Maximum Tier Achieved!</p>
            </div>
          )}
        </div>

        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:20px_20px]" />
        </div>
      </div>

      {/* All Tiers Progress */}
      {showAllTiers && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tier Progression</h4>
          <div className="space-y-2">
            {TIER_ORDER.map((tier, index) => {
              const isCurrentTier = tier === progression.tier;
              const isUnlocked = progression.xp >= TIER_THRESHOLDS[tier];
              const isNextTier = index === currentTierIndex + 1;
              const tierXP = TIER_THRESHOLDS[tier];
              const nextTierXP = index < TIER_ORDER.length - 1 
                ? TIER_THRESHOLDS[TIER_ORDER[index + 1]]
                : null;

              return (
                <div
                  key={tier}
                  className={`flex items-center gap-3 rounded-lg border-2 p-3 transition-all ${
                    isCurrentTier
                      ? `${TIER_BORDER_COLORS[tier]} bg-gradient-to-r ${TIER_COLORS[tier]} bg-opacity-10 shadow-md`
                      : isUnlocked
                      ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 opacity-60"
                  }`}
                >
                  <span className="text-2xl">{TIER_ICONS[tier]}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${isCurrentTier ? "text-white" : isUnlocked ? "text-green-700 dark:text-green-300" : "text-gray-500"}`}>
                        {tier}
                      </span>
                      <span className={`text-xs ${isCurrentTier ? "text-white/90" : isUnlocked ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                        {tierXP} {nextTierXP ? `- ${nextTierXP - 1}` : "+"} XP
                      </span>
                    </div>
                    {isCurrentTier && nextTierXP && (
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full bg-white transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {isCurrentTier && (
                    <span className="text-xs font-bold text-white">CURRENT</span>
                  )}
                  {isUnlocked && !isCurrentTier && (
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

