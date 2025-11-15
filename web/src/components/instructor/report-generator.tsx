"use client";

import { useState } from "react";

export type ReportType = "student" | "cohort" | "challenge" | "overall";
export type ReportFormat = "pdf" | "csv" | "excel";

type ReportGeneratorProps = {
  onGenerate: (type: ReportType, format: ReportFormat, options: Record<string, any>) => void;
  cohorts?: Array<{ id: string; name: string }>;
  challenges?: Array<{ id: string; name: string }>;
};

export function ReportGenerator({ onGenerate, cohorts, challenges }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<ReportType>("student");
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [selectedCohort, setSelectedCohort] = useState<string>("");
  const [selectedChallenge, setSelectedChallenge] = useState<string>("");
  const [includeGrades, setIncludeGrades] = useState(true);
  const [includeXP, setIncludeXP] = useState(true);
  const [includeBadges, setIncludeBadges] = useState(true);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const handleGenerate = () => {
    const options: Record<string, any> = {
      includeGrades,
      includeXP,
      includeBadges,
    };

    if (reportType === "cohort" && selectedCohort) {
      options.cohortId = selectedCohort;
    }
    if (reportType === "challenge" && selectedChallenge) {
      options.challengeId = selectedChallenge;
    }
    if (dateRange.start) {
      options.startDate = dateRange.start;
    }
    if (dateRange.end) {
      options.endDate = dateRange.end;
    }

    onGenerate(reportType, format, options);
  };

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Generate Report</h2>

      <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Report Type *
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="student">Student Report</option>
              <option value="cohort">Cohort Report</option>
              <option value="challenge">Challenge Report</option>
              <option value="overall">Overall Report</option>
            </select>
          </div>

          {/* Cohort Selection */}
          {reportType === "cohort" && cohorts && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Cohort *
              </label>
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Select a cohort</option>
                {cohorts.map((cohort) => (
                  <option key={cohort.id} value={cohort.id}>
                    {cohort.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Challenge Selection */}
          {reportType === "challenge" && challenges && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Challenge *
              </label>
              <select
                value={selectedChallenge}
                onChange={(e) => setSelectedChallenge(e.target.value)}
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
          )}

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Export Format *
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as ReportFormat)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Include Data
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeGrades}
                  onChange={(e) => setIncludeGrades(e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Grades</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeXP}
                  onChange={(e) => setIncludeXP(e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">XP & Progression</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeBadges}
                  onChange={(e) => setIncludeBadges(e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Badges</span>
              </label>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={
              (reportType === "cohort" && !selectedCohort) ||
              (reportType === "challenge" && !selectedChallenge)
            }
            className="w-full rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white transition-all disabled:opacity-50 hover:from-green-700 hover:to-green-800 hover:shadow-lg"
          >
            Generate {format.toUpperCase()} Report
          </button>
        </div>
      </div>
    </div>
  );
}

