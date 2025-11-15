"use client";

import { useState } from "react";

export type NotificationType = "submission" | "grading" | "system" | "student" | "cohort";

export type InstructorNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
};

type NotificationCenterProps = {
  notifications: InstructorNotification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDelete?: (id: string) => void;
  onAction?: (notification: InstructorNotification) => void;
};

const TYPE_ICONS: Record<NotificationType, string> = {
  submission: "📝",
  grading: "✅",
  system: "🔔",
  student: "👤",
  cohort: "👥",
};

const TYPE_COLORS: Record<NotificationType, string> = {
  submission: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  grading: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  system: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  student: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  cohort: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

export function NotificationCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onAction,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter(
    (n) => filter === "all" || n.type === filter
  );

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadCount > 0 && onMarkAllRead && (
          <button
            onClick={onMarkAllRead}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() => setFilter("all")}
          className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          All
        </button>
        {Object.keys(TYPE_ICONS).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as NotificationType)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {TYPE_ICONS[type as NotificationType]} {type}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-xl border-2 p-4 transition-all ${
              notification.read
                ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                : "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${TYPE_COLORS[notification.type]}`}
                >
                  {TYPE_ICONS[notification.type]}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4
                      className={`font-semibold ${
                        notification.read
                          ? "text-gray-700 dark:text-gray-300"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {notification.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(new Date(notification.timestamp))}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="ml-2 h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  {notification.actionUrl && onAction && (
                    <button
                      onClick={() => onAction(notification)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      View
                    </button>
                  )}
                  {!notification.read && onMarkRead && (
                    <button
                      onClick={() => onMarkRead(notification.id)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                      Mark Read
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(notification.id)}
                      className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="rounded-xl border-2 border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">No notifications</p>
        </div>
      )}
    </div>
  );
}

