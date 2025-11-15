"use client";

import { useState } from "react";
import type { Submission } from "./submission-review";

type GradingWorkflowProps = {
  submissions: Submission[];
  onGrade: (submissionId: string, grade: number, feedback: string) => void;
  onBulkGrade?: (submissionIds: string[], grade: number, feedback: string) => void;
};

export function GradingWorkflow({
  submissions,
  onGrade,
  onBulkGrade,
}: GradingWorkflowProps) {
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "pending" | "graded" | "returned">("pending");
  const [sortBy, setSortBy] = useState<"date" | "student" | "challenge">("date");

  const filteredSubmissions = submissions
    .filter((s) => filter === "all" || s.status === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case "student":
          return a.studentName.localeCompare(b.studentName);
        case "challenge":
          return a.challengeName.localeCompare(b.challengeName);
        default:
          return 0;
      }
    });

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedSubmissions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSubmissions(newSelected);
  };

  const toggleAll = () => {
    if (selectedSubmissions.size === filteredSubmissions.length) {
      setSelectedSubmissions(new Set());
    } else {
      setSelectedSubmissions(new Set(filteredSubmissions.map((s) => s.id)));
    }
  };

  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Grading Queue</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {pendingCount} submission{pendingCount !== 1 ? "s" : ""} pending review
          </p>
        </div>
        {selectedSubmissions.size > 0 && onBulkGrade && (
          <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700">
            Bulk Grade ({selectedSubmissions.size})
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "pending", "graded", "returned"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="ml-auto rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="date">Sort by Date</option>
          <option value="student">Sort by Student</option>
          <option value="challenge">Sort by Challenge</option>
        </select>
      </div>

      {/* Submissions List */}
      <div className="space-y-2">
        {filteredSubmissions.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
            <input
              type="checkbox"
              checked={selectedSubmissions.size === filteredSubmissions.length}
              onChange={toggleAll}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select All
            </span>
          </div>
        )}
        {filteredSubmissions.map((submission) => (
          <div
            key={submission.id}
            className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all ${
              selectedSubmissions.has(submission.id)
                ? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedSubmissions.has(submission.id)}
              onChange={() => toggleSelection(submission.id)}
              className="h-4 w-4 text-blue-600"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {submission.challengeName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {submission.studentName} • {new Date(submission.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    submission.status === "graded"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : submission.status === "returned"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  {submission.status}
                </span>
              </div>
              {submission.grade !== undefined && (
                <div className="mt-2 text-sm">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {submission.grade} / {submission.maxPoints || 100}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                // Navigate to review page
                window.location.href = `/instructor/submissions/${submission.id}`;
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Review
            </button>
          </div>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="rounded-xl border-2 border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">No submissions found</p>
        </div>
      )}
    </div>
  );
}

