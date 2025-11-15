"use client";

import { useState } from "react";

export type ScheduleRule = {
  id: string;
  challengeId: string;
  challengeName: string;
  startDate: string;
  endDate?: string;
  cohorts?: string[];
  students?: string[];
  isRecurring?: boolean;
  recurrencePattern?: "daily" | "weekly" | "monthly";
  recurrenceEnd?: string;
};

type ChallengeSchedulerProps = {
  challenges: Array<{ id: string; name: string }>;
  cohorts: Array<{ id: string; name: string }>;
  schedules: ScheduleRule[];
  onScheduleAdd: (schedule: Omit<ScheduleRule, "id">) => void;
  onScheduleUpdate: (id: string, updates: Partial<ScheduleRule>) => void;
  onScheduleDelete: (id: string) => void;
};

export function ChallengeScheduler({
  challenges,
  cohorts,
  schedules,
  onScheduleAdd,
  onScheduleUpdate,
  onScheduleDelete,
}: ChallengeSchedulerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<ScheduleRule, "id">>({
    challengeId: "",
    challengeName: "",
    startDate: "",
    endDate: "",
    cohorts: [],
    students: [],
    isRecurring: false,
    recurrencePattern: "weekly",
    recurrenceEnd: "",
  });

  const handleCreate = () => {
    if (!formData.challengeId || !formData.startDate) return;
    const challenge = challenges.find((c) => c.id === formData.challengeId);
    onScheduleAdd({
      ...formData,
      challengeName: challenge?.name || "",
    });
    setFormData({
      challengeId: "",
      challengeName: "",
      startDate: "",
      endDate: "",
      cohorts: [],
      students: [],
      isRecurring: false,
      recurrencePattern: "weekly",
      recurrenceEnd: "",
    });
    setIsCreating(false);
  };

  const toggleCohort = (cohortId: string) => {
    setFormData({
      ...formData,
      cohorts: formData.cohorts?.includes(cohortId)
        ? formData.cohorts.filter((id) => id !== cohortId)
        : [...(formData.cohorts || []), cohortId],
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Challenge Scheduler
        </h2>
        <button
          onClick={() => setIsCreating(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          + Schedule Challenge
        </button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Schedule New Challenge
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Challenge *
              </label>
              <select
                value={formData.challengeId}
                onChange={(e) => {
                  const challenge = challenges.find((c) => c.id === e.target.value);
                  setFormData({
                    ...formData,
                    challengeId: e.target.value,
                    challengeName: challenge?.name || "",
                  });
                }}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select a challenge</option>
                {challenges.map((challenge) => (
                  <option key={challenge.id} value={challenge.id}>
                    {challenge.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Assign to Cohorts
              </label>
              <div className="mt-2 space-y-2">
                {cohorts.map((cohort) => (
                  <label key={cohort.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.cohorts?.includes(cohort.id)}
                      onChange={() => toggleCohort(cohort.id)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{cohort.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="h-4 w-4 text-blue-600"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Recurring Schedule
              </label>
            </div>

            {formData.isRecurring && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recurrence Pattern
                  </label>
                  <select
                    value={formData.recurrencePattern}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recurrencePattern: e.target.value as any,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recurrence End
                  </label>
                  <input
                    type="date"
                    value={formData.recurrenceEnd}
                    onChange={(e) => setFormData({ ...formData, recurrenceEnd: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={!formData.challengeId || !formData.startDate}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors disabled:opacity-50 hover:bg-green-700"
              >
                Create Schedule
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setFormData({
                    challengeId: "",
                    challengeName: "",
                    startDate: "",
                    endDate: "",
                    cohorts: [],
                    students: [],
                    isRecurring: false,
                    recurrencePattern: "weekly",
                    recurrenceEnd: "",
                  });
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedules List */}
      <div className="space-y-3">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="flex items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                {schedule.challengeName}
              </h4>
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Starts: {new Date(schedule.startDate).toLocaleString()}</span>
                {schedule.endDate && (
                  <span>Ends: {new Date(schedule.endDate).toLocaleString()}</span>
                )}
                {schedule.isRecurring && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {schedule.recurrencePattern}
                  </span>
                )}
              </div>
              {schedule.cohorts && schedule.cohorts.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {schedule.cohorts.map((cohortId) => {
                    const cohort = cohorts.find((c) => c.id === cohortId);
                    return cohort ? (
                      <span
                        key={cohortId}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {cohort.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            <button
              onClick={() => onScheduleDelete(schedule.id)}
              className="ml-4 rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {schedules.length === 0 && (
        <div className="rounded-xl border-2 border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">No scheduled challenges</p>
        </div>
      )}
    </div>
  );
}

