'use client'

import Link from 'next/link'
import { useMemo, Suspense } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CHALLENGES, type Trade, type Difficulty, type Week } from '@/data/challenges'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type TradeFilter = Trade | 'All'
const TRADES: Trade[] = ['Electrical', 'Plumbing', 'Carpentry', 'HVAC', 'Welding']

type DifficultyFilter = Difficulty | 'All'
const DIFFICULTY: Difficulty[] = ['Easy', 'Medium', 'Hard']
type WeekFilter = Week | 'All'
const WEEKS: Week[] = [1, 2, 3, 4, 5, 6, 7, 8]

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

  const trade: TradeFilter = (search.get('trade') as Trade | null) || 'All'
  const diff: DifficultyFilter = (search.get('difficulty') as Difficulty | null) || 'All'
  const wkParam = search.get('week')
  const wk: WeekFilter = wkParam ? (Number(wkParam) as Week) : 'All'

  const items = useMemo(() => {
    const weekValue: number | null = wk === 'All' ? null : wk
    return CHALLENGES
      .filter((c) => (trade !== 'All' ? c.trade === trade : true))
      .filter((c) => (diff !== 'All' ? c.difficulty === diff : true))
      .filter((c) => (weekValue !== null ? c.week === weekValue : true))
  }, [trade, diff, wk])

  function setParam(key: string, value: string) {
    const sp = new URLSearchParams(search.toString())
    if (value === 'All' || value === '') sp.delete(key)
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
            value={trade === 'All' ? '' : trade}
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
            value={diff === 'All' ? '' : diff}
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
        <label className="text-sm text-foreground/80">
          Week
          <select
            value={wk === 'All' ? '' : String(wk)}
            onChange={(e) => setParam('week', e.target.value)}
            className="ml-2 rounded-md border border-[var(--brand-border)] bg-transparent px-2 py-1 text-sm text-foreground"
          >
            <option value="" className="text-black">All</option>
            {WEEKS.map((w) => (
              <option key={w} value={w} className="text-black">
                Week {w}
              </option>
            ))}
          </select>
        </label>
        <Button variant="ghost" onClick={() => router.push(pathname)} className="sm:ml-2">
          Reset
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.title}</CardTitle>
              <span className="rounded-md border border-[var(--brand-border)] px-2 py-0.5 text-xs text-foreground/80">
                {c.trade} • {c.difficulty} {typeof c.week !== 'undefined' ? <>• Week {c.week}</> : null} {c.type ? <>• {c.type}</> : null} {c.xp ? <>• {c.xp} XP</> : null}
              </span>
            </CardHeader>
            <CardContent>
              <p>{c.summary}</p>
              <Link href={`/challenges/${c.id}`} className="mt-3 inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-black brand-gradient">View</Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
