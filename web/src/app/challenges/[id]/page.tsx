"use client";

import Link from 'next/link'
import { CHALLENGES } from '@/data/challenges'
import StudentSubmit from '@/components/student-submit'

export default function ChallengeDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const item = CHALLENGES.find((c) => c.id === id)

  if (!item) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Challenge not found</h1>
        <p className="mt-2 text-foreground/70">The challenge you were looking for does not exist.</p>
        <Link href="/challenges" className="mt-4 inline-flex rounded-md px-3 py-2 text-sm font-medium text-black brand-gradient">Back to challenges</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
        <span className="rounded-md border border-[var(--brand-border)] px-2 py-1 text-xs text-foreground/80">{item.trade} • {item.difficulty}</span>
      </div>
      <p className="mt-3 text-foreground/80">{item.summary}</p>

      <section className="mt-8 space-y-2">
        <h2 className="text-lg font-medium">Overview</h2>
        <p className="text-sm text-foreground/70">This is a placeholder detail page. In Sprint 3/4 we can add steps, tools, safety notes, and media.</p>
      </section>

      <StudentSubmit challengeId={id} />

      <div className="mt-8">
        <Link href="/challenges" className="rounded-md px-3 py-2 text-sm font-medium text-black brand-gradient">Browse more challenges</Link>
      </div>
    </main>
  )
}
