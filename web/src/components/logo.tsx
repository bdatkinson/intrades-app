'use client'

import Link from 'next/link'

export function LogoMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="100%" stopColor="var(--brand-neon)" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="none" stroke="url(#g)" strokeWidth="6" />
      <path d="M32 14l8 12h-6v14h-4V26h-6l8-12z" fill="url(#g)"/>
      <circle cx="32" cy="32" r="8" fill="none" stroke="var(--brand-accent)" strokeWidth="3" />
    </svg>
  )
}

export function LogoWordmark({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-8 w-8" />
      <span className="text-xl font-semibold tracking-tight">
        <span className="text-[var(--brand-primary)]">In</span>
        <span className="text-foreground">Trades</span>
      </span>
    </div>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--brand-border)] bg-[color:var(--brand-bg)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="group inline-flex items-center gap-2">
          <LogoMark className="h-7 w-7 transition-transform group-hover:rotate-6" />
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-[var(--brand-primary)]">In</span>
            <span className="text-foreground">Trades</span>
          </span>
        </Link>
        <div className="hidden items-center gap-4 sm:flex">
          <Link href="/map" className="text-sm text-foreground/80 hover:text-foreground">Map</Link>
          <Link href="/dashboard" className="text-sm text-foreground/80 hover:text-foreground">Dashboard</Link>
          <Link href="/settings" className="text-sm text-foreground/80 hover:text-foreground">Settings</Link>
          <a href="/api/auth/signin" className="rounded-full px-3 py-1.5 text-sm font-medium text-black brand-gradient">Log in</a>
        </div>
      </div>
    </header>
  )
}
