"use client";

import { useState } from "react";

export type Student = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  xp: number;
  level: number;
  tier: string;
  challengesCompleted: number;
  challengesTotal: number;
  badgesEarned: number;
  streakDays: number;
  lastActivity?: string;
  cohort?: string;
};

type StudentRosterProps = {
  students: Student[];
  onStudentClick?: (student: Student) => void;
  showFilters?: boolean;
  showSearch?: boolean;
};

export function StudentRoster({
  students,
  onStudentClick,
  showFilters = true,
  showSearch = true,
}: StudentRosterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "xp" | "progress" | "activity">("xp");
  const [filterTier, setFilterTier] = useState<string>("all");

  const filteredStudents = students
    .filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = filterTier === "all" || student.tier === filterTier;
      return matchesSearch && matchesTier;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "xp":
          return b.xp - a.xp;
        case "progress":
          const aProgress = a.challengesTotal > 0 ? a.challengesCompleted / a.challengesTotal : 0;
          const bProgress = b.challengesTotal > 0 ? b.challengesCompleted / b.challengesTotal : 0;
          return bProgress - aProgress;
        case "activity":
          const aDate = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
          const bDate = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
          return bDate - aDate;
        default:
          return 0;
      }
    });

  const tiers = Array.from(new Set(students.map((s) => s.tier)));

  return (
    <div className="w-full space-y-4">
      {/* Filters and Search */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {showSearch && (
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          )}
          {showFilters && (
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="xp">Sort by XP</option>
                <option value="name">Sort by Name</option>
                <option value="progress">Sort by Progress</option>
                <option value="activity">Sort by Activity</option>
              </select>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="all">All Tiers</option>
                {tiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Student Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredStudents.length} of {students.length} students
      </div>

      {/* Student List */}
      <div className="space-y-2">
        {filteredStudents.map((student) => {
          const progress =
            student.challengesTotal > 0
              ? Math.round((student.challengesCompleted / student.challengesTotal) * 100)
              : 0;

          return (
            <div
              key={student.id}
              onClick={() => onStudentClick?.(student)}
              className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                onStudentClick
                  ? "cursor-pointer border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-lg font-bold text-white">
                  {student.avatar ? (
                    <img src={student.avatar} alt={student.name} className="h-full w-full object-cover" />
                  ) : (
                    <span>{student.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>

              {/* Student Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{student.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                  </div>
                  {student.cohort && (
                    <span className="ml-4 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {student.cohort}
                    </span>
                  )}
                </div>

                {/* Stats Row */}
                <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">XP: </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {student.xp.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tier: </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{student.tier}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress: </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{progress}%</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Streak: </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {student.streakDays} 🔥
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>
                      {student.challengesCompleted} / {student.challengesTotal} challenges
                    </span>
                    <span>{student.badgesEarned} badges</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="rounded-xl border-2 border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">No students found</p>
        </div>
      )}
    </div>
  );
}

