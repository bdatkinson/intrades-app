"use client";

import { useState } from "react";

export type QuickAction = {
  id: string;
  label: string;
  icon: string;
  description?: string;
  color?: string;
  onClick: () => void;
  badge?: number;
};

type QuickActionsMenuProps = {
  actions: QuickAction[];
  columns?: 2 | 3 | 4;
};

export function QuickActionsMenu({ actions, columns = 3 }: QuickActionsMenuProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className="w-full">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Quick Actions</h2>
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`group relative overflow-hidden rounded-xl border-2 p-6 text-left transition-all ${
              action.color
                ? `border-${action.color}-300 bg-${action.color}-50 hover:border-${action.color}-400 hover:shadow-lg dark:border-${action.color}-700 dark:bg-${action.color}-900/20`
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
            }`}
          >
            {action.badge && action.badge > 0 && (
              <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {action.badge > 99 ? "99+" : action.badge}
              </div>
            )}
            <div className="text-4xl mb-3">{action.icon}</div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{action.label}</h3>
            {action.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
            )}
            <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 dark:text-blue-400">
              <span>Go to</span>
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

