import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-foreground/70">At-a-glance view of your progress and actions.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-foreground/70">Challenges completed</div>
            <div className="mt-2 h-2 rounded bg-white/10">
              <div className="h-2 rounded bg-[var(--brand-primary)]" style={{ width: '40%' }} />
            </div>
            <div className="mt-2 text-sm text-foreground/80">4 / 10</div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle>Recent challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm leading-7 text-foreground/90">
              <li className="flex items-center justify-between">
                <span>Wire a 3-way switch</span>
                <Link className="text-[var(--brand-accent)] hover:underline" href="/challenges/1">View</Link>
              </li>
              <li className="flex items-center justify-between">
                <span>Solder a copper tee</span>
                <Link className="text-[var(--brand-accent)] hover:underline" href="/challenges/2">View</Link>
              </li>
              <li className="flex items-center justify-between">
                <span>Frame a rough opening</span>
                <Link className="text-[var(--brand-accent)] hover:underline" href="/challenges/3">View</Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Link href="/challenges" className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-black brand-gradient">Explore challenges</Link>
              <Link href="/settings" className="inline-flex items-center rounded-md border border-[var(--brand-border)] px-3 py-1.5 text-sm">Settings</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
