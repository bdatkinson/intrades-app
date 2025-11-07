"use client";

import StudentWidgets from '@/components/student-widgets'

export default function DashboardPage(){
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <StudentWidgets />
    </main>
  )
}
