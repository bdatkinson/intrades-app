'use client'

import { Suspense } from 'react'

export default function MapPage(){
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Map</h1>
      <p className="mt-2 text-foreground/70">Find opportunities and challenges near you.</p>
      <Suspense fallback={<div className="mt-6 h-72 rounded border border-[var(--brand-border)]" />}> 
        <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded border border-[var(--brand-border)] bg-gradient-to-br from-[var(--brand-muted)]/50 to-transparent">
          <div className="p-4 text-sm text-foreground/70">
            Map integration coming soon. Set <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable.
          </div>
        </div>
      </Suspense>
    </main>
  )
}
