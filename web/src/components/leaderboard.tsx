"use client";

import { useEffect, useState } from "react";
import { api, type LeaderboardResponse, type LeaderboardEntry, type ProgressTier } from "@/lib/api";
import { storage } from "@/lib/api";

type LeaderboardProps = {
  initialPeriod?: "weekly" | "allTime";
  showUserRank?: boolean;
  limit?: number;
};

const TIER_COLORS: Record<ProgressTier, string> = {
  Apprentice: "bg-gray-400",
  Journeyman: "bg-blue-500",
  Master: "bg-purple-600",
  Contractor: "bg-orange-500",
  Boss: "bg-yellow-500",
};

const TIER_ICONS: Record<ProgressTier, string> = {
  Apprentice: "🌱",
  Journeyman: "📚",
  Master: "🎓",
  Contractor: "💼",
  Boss: "👑",
};

const RANK_EMOJIS: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

function LeaderboardEntryCard({ entry, isCurrentUser = false }: { entry: LeaderboardEntry; isCurrentUser?: boolean }) {
  const rankEmoji = RANK_EMOJIS[entry.rank];
  const tierColor = TIER_COLORS[entry.tier];
  const tierIcon = TIER_ICONS[entry.tier];

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all ${
        isCurrentUser
          ? "border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-lg"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 hover:shadow-md"
      }`}
    >
      {/* Rank */}
      <div className="flex w-12 items-center justify-center">
        {rankEmoji ? (
          <span className="text-3xl">{rankEmoji}</span>
        ) : (
          <span className={`text-lg font-bold ${isCurrentUser ? "text-yellow-600 dark:text-yellow-400" : "text-gray-500"}`}>
            #{entry.rank}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xl font-bold text-white">
        {entry.avatar ? (
          <img src={entry.avatar} alt={entry.name} className="h-full w-full object-cover" />
        ) : (
          <span>{entry.name.charAt(0).toUpperCase()}</span>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className={`font-semibold ${isCurrentUser ? "text-yellow-700 dark:text-yellow-300" : "text-gray-900 dark:text-gray-100"}`}>
            {entry.name}
            {isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
          </h4>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${tierColor} text-white`}>
            <span>{tierIcon}</span>
            <span>{entry.tier}</span>
          </span>
          {entry.trend && (
            <span className={`text-xs ${
              entry.trend === "up" ? "text-green-600" : entry.trend === "down" ? "text-red-600" : "text-gray-500"
            }`}>
              {entry.trend === "up" ? "↑" : entry.trend === "down" ? "↓" : "→"}
            </span>
          )}
        </div>
      </div>

      {/* XP */}
      <div className="text-right">
        <div className={`text-xl font-bold ${isCurrentUser ? "text-yellow-600 dark:text-yellow-400" : "text-gray-900 dark:text-gray-100"}`}>
          {entry.xp.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">XP</div>
      </div>
    </div>
  );
}

export function Leaderboard({ initialPeriod = "weekly", showUserRank = true, limit }: LeaderboardProps) {
  const [period, setPeriod] = useState<"weekly" | "allTime">(initialPeriod);
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      setError(null);
      try {
        const tokens = storage.tokens;
        const response = await api.getLeaderboard(period, tokens?.accessToken);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load leaderboard");
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [period]);

  const displayEntries = limit && data ? data.entries.slice(0, limit) : (data?.entries || []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-700 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!data || data.entries.length === 0) {
    return (
      <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">No leaderboard entries yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Leaderboard</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("weekly")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              period === "weekly"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod("allTime")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              period === "allTime"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* User Rank (if available and not in top entries) */}
      {showUserRank && data.userRank !== undefined && data.userRank > (limit || 10) && (
        <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-3 dark:border-yellow-600 dark:bg-yellow-900/20">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Your rank: #{data.userRank}
          </p>
        </div>
      )}

      {/* Leaderboard Entries */}
      <div className="space-y-2">
        {displayEntries.map((entry) => {
          // Check if this is the current user (you'd need to get current user ID from context/auth)
          const isCurrentUser = false; // TODO: Get from auth context
          return (
            <LeaderboardEntryCard
              key={entry.userId}
              entry={entry}
              isCurrentUser={isCurrentUser}
            />
          );
        })}
      </div>

      {/* Show more indicator */}
      {limit && data.entries.length > limit && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Showing top {limit} of {data.entries.length} entries
        </div>
      )}
    </div>
  );
}

