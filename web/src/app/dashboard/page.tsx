"use client";

import Link from 'next/link'
import StudentWidgets from '@/components/student-widgets'
import { CHALLENGES } from '@/data/challenges'

export default function DashboardPage(){
  const recent = [...CHALLENGES].slice(-3).reverse()
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <StudentWidgets />

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Recent challenges</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map(c => (
            <li key={c.id} className="rounded-lg border border-[var(--brand-border)] p-4">
              <h3 className="font-medium">{c.title}</h3>
              <p className="mt-1 text-sm text-foreground/70">{c.summary}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-foreground/60">
                <span>{c.trade}</span>
                <span>{c.difficulty}</span>
              </div>
              <div className="mt-4">
                <Link href={`/challenges/${c.id}`} className="text-sm font-medium text-[var(--electric-cyan)] hover:underline">View</Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
