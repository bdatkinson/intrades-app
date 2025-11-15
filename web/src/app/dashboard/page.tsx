"use client";

import { useEffect, useState } from "react";
import { XPBar } from "@/components/xp-bar";
import { BadgeGrid } from "@/components/badge-card";
import { TierDisplay } from "@/components/tier-display";
import { StreakCounter } from "@/components/streak-counter";
import { Leaderboard } from "@/components/leaderboard";
import { NotificationManager, useAchievementNotifications } from "@/components/achievement-notification";
import { useXPGainAnimation } from "@/components/xp-gain-animation";
import { ActivityFeed } from "@/components/activity-feed";
import { useProfile, useUserProgression, useBadges, useUserBadges, useActivityFeed } from "@/lib/api-hooks";
import type { Badge } from "@/lib/api";

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const { notifications, dismissNotification, showBadgeEarned, showTierUp, showXPGain } = useAchievementNotifications();
  const { animations, triggerAnimation, XPGainAnimations } = useXPGainAnimation();

  // Get user profile to get userId
  const { data: profile } = useProfile();

  useEffect(() => {
    if (profile?.id) {
      setUserId(profile.id);
    }
  }, [profile]);

  // Get user progression
  const { data: progression, isLoading: progressionLoading } = useUserProgression(userId);

  // Get all badges
  const { data: allBadges, isLoading: badgesLoading } = useBadges();

  // Get user badges
  const { data: userBadges, isLoading: userBadgesLoading } = useUserBadges(userId);

  // Get activity feed
  const { data: activities = [], isLoading: activitiesLoading } = useActivityFeed(userId, 5);

  // Monitor for achievements and trigger notifications
  useEffect(() => {
    if (!progression || !userBadges) return;

    // Check for new badges (compare with previous state)
    // This would ideally use WebSockets or polling in production
    const previousBadges = JSON.parse(sessionStorage.getItem("previousBadges") || "[]");
    const newBadges = userBadges.filter(
      (badge) => !previousBadges.some((prev: Badge) => prev.id === badge.id)
    );

    newBadges.forEach((badge) => {
      showBadgeEarned(badge, badge.xpRequired);
      triggerAnimation(badge.xpRequired);
    });

    if (newBadges.length > 0) {
      sessionStorage.setItem("previousBadges", JSON.stringify(userBadges));
    }
  }, [userBadges, progression, showBadgeEarned, triggerAnimation]);

  if (progressionLoading || !progression) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      {/* Notifications */}
      <NotificationManager
        notifications={notifications}
        onDismiss={dismissNotification}
        position="top-right"
      />
      <XPGainAnimations />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {profile?.name || "Student"}! Keep up the great work.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* XP Card */}
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total XP</p>
              <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {progression.xp.toLocaleString()}
              </p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>

        {/* Level Card */}
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Level</p>
              <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {progression.level}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        {/* Badges Card */}
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Badges Earned</p>
              <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {userBadges?.length || 0}
              </p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Streak</p>
              <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {progression.streakDays}
              </p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Progression */}
        <div className="lg:col-span-2 space-y-6">
          {/* XP Progress Bar */}
          <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Your Progress
            </h2>
            <XPBar
              currentXP={progression.xp}
              nextTierXP={progression.nextTierXP}
              tier={progression.tier}
              level={progression.level}
            />
          </div>

          {/* Tier Display */}
          <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Tier Progression
            </h2>
            <TierDisplay progression={progression} showAllTiers={true} />
          </div>

          {/* Badge Grid */}
          <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Your Badges
            </h2>
            {badgesLoading || userBadgesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              </div>
            ) : allBadges && userBadges ? (
              <BadgeGrid badges={allBadges} userBadges={userBadges} />
            ) : (
              <p className="py-8 text-center text-gray-500">No badges available</p>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Streak Counter */}
          <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Daily Streak
            </h2>
            <StreakCounter
              streakDays={progression.streakDays}
              lastActivityDate={progression.lastActivityDate}
            />
          </div>

          {/* Leaderboard */}
          <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Leaderboard initialPeriod="weekly" showUserRank={true} limit={5} />
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Activity
            </h2>
            {activitiesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              </div>
            ) : (
              <ActivityFeed activities={activities} maxItems={5} showTimestamps={true} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
