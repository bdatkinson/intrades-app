"use client";

import { useCallback, useEffect, useState } from "react";
import type { Badge } from "@/lib/api";

export type AchievementType = "badge" | "tier" | "streak" | "xp" | "milestone";

export type AchievementNotification = {
  id: string;
  type: AchievementType;
  title: string;
  message: string;
  icon?: string;
  badge?: Badge;
  xpGained?: number;
  duration?: number;
};

type AchievementNotificationProps = {
  notification: AchievementNotification;
  onDismiss: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center";
};

const TYPE_ICONS: Record<AchievementType, string> = {
  badge: "🏆",
  tier: "⭐",
  streak: "🔥",
  xp: "💎",
  milestone: "🎯",
};

const TYPE_COLORS: Record<AchievementType, string> = {
  badge: "from-yellow-400 to-orange-500",
  tier: "from-purple-400 to-pink-500",
  streak: "from-orange-400 to-red-500",
  xp: "from-blue-400 to-cyan-500",
  milestone: "from-green-400 to-emerald-500",
};

export function AchievementNotification({
  notification,
  onDismiss,
  position = "top-right",
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300);
  }, [notification.id, onDismiss]);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Auto-dismiss after duration
    const duration = notification.duration || 5000;
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [notification.duration, handleDismiss]);

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
  };

  const icon = notification.icon || notification.badge?.icon || TYPE_ICONS[notification.type];

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 w-full max-w-sm transition-all duration-300 ${
        isVisible && !isExiting ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-xl border-2 border-white/20 bg-gradient-to-br ${TYPE_COLORS[notification.type]} p-4 shadow-2xl`}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-full bg-white/20 p-1 text-white transition-colors hover:bg-white/30"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-3xl">
              {icon}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1">
            <h4 className="font-bold text-white">{notification.title}</h4>
            <p className="text-sm text-white/90">{notification.message}</p>
            
            {notification.xpGained && notification.xpGained > 0 && (
              <div className="flex items-center gap-1 pt-1">
                <span className="text-xs font-semibold text-white">+{notification.xpGained} XP</span>
              </div>
            )}

            {notification.badge && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-medium text-white/90">
                  {notification.badge.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar for auto-dismiss */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-white/50 transition-all"
            style={{
              width: isExiting ? "0%" : "100%",
              transitionDuration: `${notification.duration || 5000}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Notification Manager Component
type NotificationManagerProps = {
  notifications: AchievementNotification[];
  onDismiss: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center";
  maxNotifications?: number;
};

export function NotificationManager({
  notifications,
  onDismiss,
  position = "top-right",
  maxNotifications = 5,
}: NotificationManagerProps) {
  const displayNotifications = notifications.slice(0, maxNotifications);

  return (
    <>
      {displayNotifications.map((notification, index) => {
        // Stack notifications vertically
        const offset = index * 80;
        const style = position.includes("top")
          ? { top: `${16 + offset}px` }
          : { bottom: `${16 + offset}px` };

        return (
          <div key={notification.id} style={style} className="fixed left-0 right-0 z-50">
            <div className="mx-auto w-full max-w-sm px-4">
              <AchievementNotification
                notification={notification}
                onDismiss={onDismiss}
                position={position}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

// Hook for managing achievement notifications
export function useAchievementNotifications() {
  const [notifications, setNotifications] = useState<AchievementNotification[]>([]);

  const addNotification = (notification: Omit<AchievementNotification, "id">) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification: AchievementNotification = {
      ...notification,
      id,
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const showBadgeEarned = (badge: Badge, xpGained?: number) => {
    addNotification({
      type: "badge",
      title: "Badge Earned!",
      message: `You've unlocked the ${badge.name} badge!`,
      badge,
      xpGained,
      icon: badge.icon,
    });
  };

  const showTierUp = (tier: string, xpGained?: number) => {
    addNotification({
      type: "tier",
      title: "Tier Up!",
      message: `Congratulations! You've reached ${tier} tier!`,
      xpGained,
    });
  };

  const showStreakMilestone = (days: number) => {
    addNotification({
      type: "streak",
      title: "Streak Milestone!",
      message: `Amazing! You've maintained a ${days}-day streak!`,
    });
  };

  const showXPGain = (xp: number) => {
    addNotification({
      type: "xp",
      title: "XP Gained!",
      message: `You've earned ${xp} experience points!`,
      xpGained: xp,
      duration: 3000,
    });
  };

  const showMilestone = (message: string, xpGained?: number) => {
    addNotification({
      type: "milestone",
      title: "Milestone Reached!",
      message,
      xpGained,
    });
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
    showBadgeEarned,
    showTierUp,
    showStreakMilestone,
    showXPGain,
    showMilestone,
  };
}

