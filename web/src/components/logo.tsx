"use client"

import Link from 'next/link'
import { useAuth } from '@/contexts/auth'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'

export function LogoMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="100%" stopColor="var(--brand-neon)" />
        </linearGradient>
      </defs>

      {/* Outer gear */}
      <g transform="translate(32 32)">
        <circle r="22" fill="none" stroke="url(#g)" strokeWidth="6" />
        {/* Teeth */}
        {
          Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={i}
              x="-2.5"
              y="-30"
              width="5"
              height="8"
              rx="1"
              fill="url(#g)"
              transform={`rotate(${i * 45})`}
            />
          ))
        }
      </g>

      {/* Upward arrow inside */}
      <path d="M32 18l9 12h-6v16h-6V30h-6l9-12z" fill="url(#g)" />

      {/* Stylized handshake */}
      <g>
        {/* left arm */}
        <path d="M18 36 l8 -6 a4 4 0 0 1 5 0 l5 4 a4 4 0 0 1 1.5 3.1V42h-3.5l-5.5-4.2a3.5 3.5 0 0 0 -4.2 0L20 42h-4v-2.4a4 4 0 0 1 2 -3.6z" fill="#0deac9" opacity="0.85" />
        {/* right arm */}
        <path d="M46 36 l-8 -6 a4 4 0 0 0 -5 0 l-5 4 a4 4 0 0 0 -1.5 3.1V42h3.5l5.5-4.2a3.5 3.5 0 0 1 4.2 0L44 42h4v-2.4a4 4 0 0 0 -2 -3.6z" fill="#ff8a33" opacity="0.9" />
        {/* knuckle accents */}
        <g stroke="var(--brand-border)" strokeWidth="1.2" strokeLinecap="round">
          <line x1="28" y1="38" x2="30" y2="38" />
          <line x1="31" y1="39" x2="33" y2="39" />
          <line x1="34" y1="38" x2="36" y2="38" />
        </g>
      </g>
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
  const { user, logout } = useAuth();
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

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-4 sm:flex">
          <Link href="/dashboard" className="text-sm text-foreground/80 hover:text-foreground">Dashboard</Link>
          <Link href="/map" className="text-sm text-foreground/80 hover:text-foreground">Map</Link>
          <Link href="/challenges" className="text-sm font-semibold text-foreground px-2 py-1 rounded border border-[var(--brand-border)] hover:text-foreground hover:border-[var(--brand-accent)]">Challenges</Link>
          <Link href="/settings" className="text-sm text-foreground/80 hover:text-foreground">Settings</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground/70">Hi, {user.name?.split(' ')[0] || 'you'}</span>
              <Link href="/settings" className="text-sm text-foreground/90 hover:text-foreground">Profile</Link>
              <button onClick={logout} className="rounded-full px-3 py-1.5 text-sm font-medium text-black brand-gradient">Log out</button>
            </div>
          ) : (
            <Link href="/auth/login" className="rounded-full px-3 py-1.5 text-sm font-medium text-black brand-gradient">Log in</Link>
          )}
        </nav>

        {/* Mobile sheet via Sheet */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetClose asChild>
                  <Button variant="outline" size="icon" aria-label="Close menu">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <nav className="grid gap-2" aria-label="Mobile">
                <Link href="/dashboard" className="rounded px-2 py-2 text-foreground/90 hover:bg-white/5">Dashboard</Link>
                <Link href="/map" className="rounded px-2 py-2 text-foreground/90 hover:bg-white/5">Map</Link>
                <Link href="/challenges" className="rounded px-2 py-2 font-semibold text-foreground hover:bg-white/5 border border-[var(--brand-border)]">Challenges</Link>
                <Link href="/settings" className="rounded px-2 py-2 text-foreground/90 hover:bg-white/5">Settings</Link>
                {user ? (
                  <button onClick={logout} className="mt-2 inline-flex rounded-md px-3 py-2 text-sm font-medium text-black brand-gradient">Log out</button>
                ) : (
                  <Link href="/auth/login" className="mt-2 inline-flex rounded-md px-3 py-2 text-sm font-medium text-black brand-gradient">Log in</Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

