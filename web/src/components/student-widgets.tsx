'use client'

export default function StudentWidgets(){
  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border border-[var(--brand-border)] p-4">
        <div className="text-sm text-foreground/70">Completed Challenges</div>
        <div className="mt-2 text-2xl font-semibold">0</div>
      </div>
      <div className="rounded-lg border border-[var(--brand-border)] p-4">
        <div className="text-sm text-foreground/70">In Progress</div>
        <div className="mt-2 text-2xl font-semibold">0</div>
      </div>
      <div className="rounded-lg border border-[var(--brand-border)] p-4">
        <div className="text-sm text-foreground/70">Streak</div>
        <div className="mt-2 text-2xl font-semibold">0 days</div>
      </div>
    </section>
  )
}
