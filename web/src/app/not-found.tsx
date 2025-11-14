import Link from "next/link";

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-sm font-medium tracking-wide text-[var(--brand-primary)]">Error 404</p>
      <h1 id="not-found-title" className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-base text-foreground/70">
        The page you’re looking for doesn’t exist or may have moved.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-black brand-gradient"
        >
          Go home
        </Link>
        <Link
          href="/challenges"
          className="inline-flex items-center justify-center rounded-md border border-[var(--brand-border)] px-4 py-2 text-sm font-medium text-foreground hover:border-[var(--brand-accent)]"
        >
          Browse challenges
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Quick links">
        <Link href="/dashboard" className="rounded-md border border-[var(--brand-border)] p-4 text-left hover:border-[var(--brand-accent)]">
          <span className="block text-sm font-semibold">Dashboard</span>
          <span className="mt-1 block text-xs text-foreground/70">Check your progress</span>
        </Link>
        <Link href="/map" className="rounded-md border border-[var(--brand-border)] p-4 text-left hover:border-[var(--brand-accent)]">
          <span className="block text-sm font-semibold">Map</span>
          <span className="mt-1 block text-xs text-foreground/70">Explore the journey</span>
        </Link>
        <Link href="/settings" className="rounded-md border border-[var(--brand-border)] p-4 text-left hover:border-[var(--brand-accent)]">
          <span className="block text-sm font-semibold">Settings</span>
          <span className="mt-1 block text-xs text-foreground/70">Update your preferences</span>
        </Link>
      </div>
    </section>
  );
}
