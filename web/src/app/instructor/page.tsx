"use client";

import dynamic from "next/dynamic";
import { LoadingFallback } from "@/lib/lazy-loading";

// Lazy load heavy instructor components
const StudentRoster = dynamic(() => import("@/components/instructor/student-roster").then(m => ({ default: m.StudentRoster })), {
  loading: () => <LoadingFallback message="Loading student roster..." />,
  ssr: false,
});

const CohortManagement = dynamic(() => import("@/components/instructor/cohort-management").then(m => ({ default: m.CohortManagement })), {
  loading: () => <LoadingFallback message="Loading cohorts..." />,
  ssr: false,
});

const ProgressOverviewCharts = dynamic(() => import("@/components/instructor/progress-overview-charts").then(m => ({ default: m.ProgressOverviewCharts })), {
  loading: () => <LoadingFallback message="Loading charts..." />,
  ssr: false,
});

const NotificationCenter = dynamic(() => import("@/components/instructor/notification-center").then(m => ({ default: m.NotificationCenter })), {
  loading: () => <LoadingFallback message="Loading notifications..." />,
  ssr: false,
});

const QuickActionsMenu = dynamic(() => import("@/components/instructor/quick-actions-menu").then(m => ({ default: m.QuickActionsMenu })), {
  loading: () => <LoadingFallback message="Loading actions..." />,
  ssr: false,
});

import { useState } from "react";
import { useStudents, useCohorts, useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useCreateCohort, useUpdateCohort, useDeleteCohort } from "@/lib/api-hooks";
import type { QuickAction } from "@/components/instructor/quick-actions-menu";

export default function InstructorDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "cohorts" | "notifications">(
    "overview"
  );
  // Filters can be added later; currently unused to avoid lint warnings

  // API calls
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: cohorts = [], isLoading: cohortsLoading } = useCohorts();
  const { data: notifications = [], isLoading: notificationsLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const createCohort = useCreateCohort();
  const updateCohort = useUpdateCohort();
  const deleteCohort = useDeleteCohort();

  const quickActions: QuickAction[] = [
    {
      id: "create-challenge",
      label: "Create Challenge",
      icon: "➕",
      description: "Add a new challenge for students",
      color: "blue",
      onClick: () => console.log("Create challenge"),
    },
    {
      id: "grade-submissions",
      label: "Grade Submissions",
      icon: "✅",
      description: "Review and grade student work",
      color: "green",
      badge: 5,
      onClick: () => console.log("Grade submissions"),
    },
    {
      id: "view-analytics",
      label: "View Analytics",
      icon: "📊",
      description: "See detailed progress reports",
      color: "purple",
      onClick: () => console.log("View analytics"),
    },
    {
      id: "manage-cohorts",
      label: "Manage Cohorts",
      icon: "👥",
      description: "Create and manage student cohorts",
      color: "orange",
      onClick: () => setActiveTab("cohorts"),
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Instructor Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage students, cohorts, and track progress
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActionsMenu actions={quickActions} columns={4} />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {(
          [
            { id: "overview", label: "Overview" },
            { id: "students", label: "Students" },
            { id: "cohorts", label: "Cohorts" },
            { id: "notifications", label: "Notifications" },
          ] as Array<{ id: "overview" | "students" | "cohorts" | "notifications"; label: string }>
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <ProgressOverviewCharts
            cohortProgress={[
              { label: "Spring 2024", value: 75, color: "#3b82f6" },
              { label: "Fall 2023", value: 90, color: "#10b981" },
            ]}
            tierDistribution={[
              { label: "Boss", value: 2, color: "#fbbf24" },
              { label: "Contractor", value: 5, color: "#f97316" },
              { label: "Master", value: 8, color: "#a855f7" },
              { label: "Journeyman", value: 10, color: "#3b82f6" },
            ]}
            challengeCompletion={[
              { label: "Easy", value: 95, color: "#10b981" },
              { label: "Medium", value: 78, color: "#3b82f6" },
              { label: "Hard", value: 45, color: "#f97316" },
            ]}
          />
        )}

        {activeTab === "students" && (
          <>
            {studentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              </div>
            ) : (
              <StudentRoster
                students={students}
                onStudentClick={(student) => {
                  // Navigate to student detail page
                  window.location.href = `/instructor/students/${student.id}`;
                }}
                showFilters={true}
                showSearch={true}
              />
            )}
          </>
        )}

        {activeTab === "cohorts" && (
          <>
            {cohortsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              </div>
            ) : (
              <CohortManagement
                cohorts={cohorts}
                onCreateCohort={(data) => createCohort.mutate(data)}
                onEditCohort={(id, data) => updateCohort.mutate({ id, data })}
                onDeleteCohort={(id) => deleteCohort.mutate(id)}
              />
            )}
          </>
        )}

        {activeTab === "notifications" && (
          <>
            {notificationsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              </div>
            ) : (
              <NotificationCenter
                notifications={notifications}
                onMarkRead={(id) => markRead.mutate(id)}
                onMarkAllRead={() => markAllRead.mutate()}
                onDelete={(id) => {
                  // TODO: Add delete notification API endpoint
                  console.log("Delete:", id);
                }}
                onAction={(notification) => {
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                  }
                }}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
