export default function ChallengesPage() {
  const items = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    title: `Challenge ${i + 1}`,
    summary: 'A short description of this hands-on challenge for skilled trades pros.',
  }))
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Challenges</h1>
      <p className="mt-2 text-foreground/70">Sharpen your skills. Earn cred. Level up.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <article key={c.id} className="rounded-lg border border-[var(--brand-border)] bg-[color:var(--brand-muted)]/40 p-4">
            <h2 className="text-lg font-medium">{c.title}</h2>
            <p className="mt-1 text-sm text-foreground/70">{c.summary}</p>
            <a href="#" className="mt-3 inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-black brand-gradient">View</a>
          </article>
        ))}
      </div>
    </main>
  )
}
