'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useChallenges } from '@/lib/api-hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const TRADES = ['Electrical', 'Plumbing', 'Carpentry', 'HVAC', 'Welding'] as const;
const DIFFICULTY = ['Easy', 'Medium', 'Hard'] as const;

export default function ChallengesPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-6xl px-4 py-10"><p className="text-foreground/70">Loading...</p></main>}>
      <ChallengesInner />
    </Suspense>
  )
}

function ChallengesInner() {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()

  const trade = search.get('trade') || undefined
  const difficulty = search.get('difficulty') || undefined

  const { data: challenges = [], isLoading } = useChallenges({
    trade: trade || undefined,
    difficulty: difficulty || undefined,
  })

  function setParam(key: string, value: string) {
    const sp = new URLSearchParams(search.toString())
    if (value === '' || value === 'All') sp.delete(key)
    else sp.set(key, value)
    router.push(`${pathname}?${sp.toString()}`)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Challenges</h1>
          <p className="mt-2 text-foreground/70">Sharpen your skills. Earn cred. Level up.</p>
        </div>
        <Link href="/challenges/new" className="hidden sm:inline-flex rounded-md px-3 py-2 text-sm font-medium text-black brand-gradient">Submit challenge</Link>
      </div>

      {/* Filters */}
      <div className="mt-6 grid gap-3 sm:flex sm:items-center">
        <label className="text-sm text-foreground/80">
          Trade
          <select
            value={trade || ''}
            onChange={(e) => setParam('trade', e.target.value)}
            className="ml-2 rounded-md border border-[var(--brand-border)] bg-transparent px-2 py-1 text-sm text-foreground"
          >
            <option value="" className="text-black">All</option>
            {TRADES.map((t) => (
              <option key={t} value={t} className="text-black">
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-foreground/80">
          Difficulty
          <select
            value={difficulty || ''}
            onChange={(e) => setParam('difficulty', e.target.value)}
            className="ml-2 rounded-md border border-[var(--brand-border)] bg-transparent px-2 py-1 text-sm text-foreground"
          >
            <option value="" className="text-black">All</option>
            {DIFFICULTY.map((d) => (
              <option key={d} value={d} className="text-black">
                {d}
              </option>
            ))}
          </select>
        </label>
        <Button variant="ghost" onClick={() => router.push(pathname)} className="sm:ml-2">
          Reset
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-6 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            <p className="text-foreground/70">Loading challenges...</p>
          </div>
        </div>
      ) : challenges.length === 0 ? (
        <div className="mt-6 rounded-lg border border-[var(--brand-border)] p-8 text-center">
          <p className="text-foreground/70">No challenges found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
                <span className="rounded-md border border-[var(--brand-border)] px-2 py-0.5 text-xs text-foreground/80">
                  {c.trade} • {c.difficulty} • +{c.xpReward} XP
                </span>
              </CardHeader>
              <CardContent>
                <p>{c.summary || c.description}</p>
                <Link href={`/challenges/${c.id}`} className="mt-3 inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-black brand-gradient">
                  View
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
