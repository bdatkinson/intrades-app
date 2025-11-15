"use client";

// Simple time ago formatter (replace with date-fns if available)
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

export type ActivityType = 
  | "challenge_completed"
  | "badge_earned"
  | "xp_gained"
  | "tier_up"
  | "milestone_completed"
  | "streak_milestone"
  | "quiz_completed";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  icon: string;
  timestamp: string;
  xpGained?: number;
  metadata?: Record<string, unknown>;
};

type ActivityFeedProps = {
  activities: ActivityItem[];
  maxItems?: number;
  showTimestamps?: boolean;
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  challenge_completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  badge_earned: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  xp_gained: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  tier_up: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  milestone_completed: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  streak_milestone: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  quiz_completed: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
};

export function ActivityFeed({ 
  activities, 
  maxItems = 10, 
  showTimestamps = true 
}: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  if (displayActivities.length === 0) {
    return (
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {displayActivities.map((activity) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          showTimestamp={showTimestamps}
        />
      ))}
    </div>
  );
}

function ActivityItem({ 
  activity, 
  showTimestamp 
}: { 
  activity: ActivityItem; 
  showTimestamp: boolean;
}) {
  const colorClass = ACTIVITY_COLORS[activity.type] || ACTIVITY_COLORS.xp_gained;
  const timeAgo = formatTimeAgo(new Date(activity.timestamp));

  return (
    <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
      {/* Icon */}
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${colorClass}`}>
        <span className="text-xl">{activity.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              {activity.title}
            </h4>
            {activity.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {activity.description}
              </p>
            )}
            {activity.xpGained && activity.xpGained > 0 && (
              <div className="mt-2 flex items-center gap-1">
                <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                  +{activity.xpGained} XP
                </span>
              </div>
            )}
          </div>
          {showTimestamp && (
            <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
              {timeAgo}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook for managing activity feed - now uses API hooks
// This is kept for backward compatibility, but components should use useActivityFeed from api-hooks
export function useActivityFeed() {
  // Deprecated - use useActivityFeed from @/lib/api-hooks instead
  return {
    activities: [] as ActivityItem[],
    isLoading: false,
    error: null,
  };
}

