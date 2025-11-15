"use client";

import { useState } from "react";

export type BusinessMilestone = {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  completed: boolean;
  completedAt?: string;
  note?: string;
  xpReward?: number;
};

type MilestoneTrackerProps = {
  milestones: BusinessMilestone[];
  onMilestoneComplete?: (milestoneId: string, note?: string) => void;
  showProgress?: boolean;
};

const CATEGORY_COLORS: Record<string, string> = {
  legal: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  finance: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  marketing: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  operations: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  insurance: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export function MilestoneTracker({ 
  milestones, 
  onMilestoneComplete, 
  showProgress = true 
}: MilestoneTrackerProps) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  const completedCount = milestones.filter(m => m.completed).length;
  const totalCount = milestones.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggleExpand = (milestoneId: string) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId);
  };

  const handleNoteChange = (milestoneId: string, note: string) => {
    setNoteInputs(prev => ({ ...prev, [milestoneId]: note }));
  };

  const handleComplete = (milestoneId: string) => {
    const note = noteInputs[milestoneId];
    onMilestoneComplete?.(milestoneId, note);
    setNoteInputs(prev => {
      const newInputs = { ...prev };
      delete newInputs[milestoneId];
      return newInputs;
    });
    setExpandedMilestone(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Progress Header */}
      {showProgress && (
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Business Milestones
            </h3>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {completedCount} / {totalCount} completed
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>
          
          <div className="mt-2 text-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {progressPercent}%
            </span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">complete</span>
          </div>
        </div>
      )}

      {/* Milestones List */}
      <div className="space-y-3">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`rounded-xl border-2 p-4 transition-all ${
              milestone.completed
                ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox/Icon */}
              <div className="flex-shrink-0">
                {milestone.completed ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-100 text-2xl dark:border-gray-600 dark:bg-gray-700">
                    {milestone.icon}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold ${
                        milestone.completed 
                          ? "text-green-700 dark:text-green-300" 
                          : "text-gray-900 dark:text-gray-100"
                      }`}>
                        {milestone.name}
                      </h4>
                      {milestone.category && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          CATEGORY_COLORS[milestone.category] || CATEGORY_COLORS.operations
                        }`}>
                          {milestone.category}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {milestone.description}
                    </p>
                    
                    {milestone.completed && milestone.completedAt && (
                      <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                        Completed: {new Date(milestone.completedAt).toLocaleDateString()}
                      </p>
                    )}

                    {milestone.completed && milestone.note && (
                      <p className="mt-2 rounded-lg bg-white/50 p-2 text-xs text-gray-700 dark:text-gray-300">
                        {milestone.note}
                      </p>
                    )}

                    {/* Expandable Note Input */}
                    {!milestone.completed && expandedMilestone === milestone.id && (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={noteInputs[milestone.id] || ""}
                          onChange={(e) => handleNoteChange(milestone.id, e.target.value)}
                          placeholder="Add a note about completing this milestone..."
                          className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleComplete(milestone.id)}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                          >
                            Mark Complete
                          </button>
                          <button
                            onClick={() => setExpandedMilestone(null)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {!milestone.completed && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleToggleExpand(milestone.id)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        {expandedMilestone === milestone.id ? "Cancel" : "Complete"}
                      </button>
                    </div>
                  )}

                  {milestone.completed && milestone.xpReward && (
                    <div className="flex-shrink-0">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        +{milestone.xpReward} XP
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="rounded-xl border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center dark:border-green-600 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="text-5xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-green-700 dark:text-green-300">
            All Milestones Complete!
          </h3>
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            Congratulations on completing all business milestones!
          </p>
        </div>
      )}
    </div>
  );
}

