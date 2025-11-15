"use client";

import { useState } from "react";

export type Submission = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  challengeId: string;
  challengeName: string;
  submittedAt: string;
  status: "pending" | "graded" | "returned";
  grade?: number;
  maxPoints?: number;
  files?: Array<{ url: string; name: string; type: string }>;
  textResponse?: string;
  rubricScores?: Record<string, number>;
  feedback?: string;
  comments?: Array<{ author: string; message: string; timestamp: string; isInstructor: boolean }>;
};

type SubmissionReviewProps = {
  submission: Submission;
  rubric?: Array<{ id: string; name: string; maxPoints: number }>;
  onGrade: (submissionId: string, grade: number, feedback: string, rubricScores?: Record<string, number>) => void;
  onReturn: (submissionId: string, feedback: string) => void;
  onAddComment: (submissionId: string, message: string) => void;
};

export function SubmissionReview({
  submission,
  rubric,
  onGrade,
  onReturn,
  onAddComment,
}: SubmissionReviewProps) {
  const [grade, setGrade] = useState(submission.grade || 0);
  const [feedback, setFeedback] = useState(submission.feedback || "");
  const [rubricScores, setRubricScores] = useState<Record<string, number>>(
    submission.rubricScores || {}
  );
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState<"submission" | "grading" | "comments">("submission");

  const maxPoints = submission.maxPoints || 100;
  const percentage = maxPoints > 0 ? Math.round((grade / maxPoints) * 100) : 0;

  const handleGrade = () => {
    onGrade(submission.id, grade, feedback, rubric && Object.keys(rubricScores).length > 0 ? rubricScores : undefined);
  };

  const handleReturn = () => {
    onReturn(submission.id, feedback);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(submission.id, newComment);
      setNewComment("");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {submission.challengeName}
            </h2>
            <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium">Student:</span> {submission.studentName} ({submission.studentEmail})
              </p>
              <p>
                <span className="font-medium">Submitted:</span>{" "}
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    submission.status === "graded"
                      ? "text-green-600"
                      : submission.status === "returned"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                >
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </span>
              </p>
            </div>
          </div>
          {submission.status === "graded" && submission.grade !== undefined && (
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {submission.grade} / {maxPoints}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{percentage}%</div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: "submission", label: "Submission" },
          { id: "grading", label: "Grading" },
          { id: "comments", label: "Comments" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Submission Tab */}
      {activeTab === "submission" && (
        <div className="space-y-4">
          {submission.textResponse && (
            <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Text Response
              </h3>
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {submission.textResponse}
              </p>
            </div>
          )}

          {submission.files && submission.files.length > 0 && (
            <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Submitted Files
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {submission.files.map((file, index) => (
                  <div key={index} className="space-y-2">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700">
                        <span className="text-4xl">📄</span>
                      </div>
                    )}
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {file.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grading Tab */}
      {activeTab === "grading" && (
        <div className="space-y-4">
          {rubric && rubric.length > 0 && (
            <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Rubric</h3>
              <div className="space-y-3">
                {rubric.map((criterion) => (
                  <div key={criterion.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {criterion.name}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {rubricScores[criterion.id] || 0} / {criterion.maxPoints} points
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={criterion.maxPoints}
                      value={rubricScores[criterion.id] || 0}
                      onChange={(e) =>
                        setRubricScores({
                          ...rubricScores,
                          [criterion.id]: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                ))}
                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-900 dark:text-gray-100">Total Rubric Score:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {Object.values(rubricScores).reduce((sum, score) => sum + score, 0)} /{" "}
                      {rubric.reduce((sum, c) => sum + c.maxPoints, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Overall Grade
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Points (out of {maxPoints})
                </label>
                <input
                  type="number"
                  value={grade}
                  onChange={(e) => setGrade(parseInt(e.target.value) || 0)}
                  min={0}
                  max={maxPoints}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
                <div className="mt-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full transition-all ${
                        percentage >= 90
                          ? "bg-green-500"
                          : percentage >= 70
                          ? "bg-blue-500"
                          : percentage >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Provide detailed feedback for the student..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleGrade}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
                >
                  Submit Grade
                </button>
                <button
                  onClick={handleReturn}
                  className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 font-medium text-yellow-700 transition-colors hover:bg-yellow-100 dark:border-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300"
                >
                  Return for Revision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === "comments" && (
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Comments</h3>
            <div className="space-y-4">
              {submission.comments && submission.comments.length > 0 ? (
                submission.comments.map((comment, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border p-4 ${
                      comment.isInstructor
                        ? "border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {comment.author}
                        </span>
                        {comment.isInstructor && (
                          <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            Instructor
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-400">No comments yet</p>
              )}

              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  placeholder="Add a comment..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="mt-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors disabled:opacity-50 hover:bg-blue-700"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

