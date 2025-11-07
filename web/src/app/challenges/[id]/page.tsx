'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CHALLENGES } from '@/data/challenges'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
        <span className="rounded-md border border-[var(--brand-border)] px-2 py-1 text-xs text-foreground/80">
          {item.trade} • {item.difficulty} {typeof item.week !== 'undefined' ? <>• Week {item.week}</> : null} {item.type ? <>• {item.type}</> : null} {item.xp ? <>• {item.xp} XP</> : null}
        </span>
      </div>
      <p className="mt-3 text-foreground/80">{item.summary}</p>

      {/* Type‑specific renderer */}
      <div className="mt-6 space-y-6">
        {item.type === 'quiz' && <QuizBlock id={item.id} />}
        {item.type === 'checklist' && <ChecklistBlock id={item.id} />}
        {item.type === 'upload' && <UploadBlock id={item.id} />}
        {item.type === 'game' && <ExpenseMatchStub />}
        {!item.type && (
          <section className="space-y-2">
            <h2 className="text-lg font-medium">Overview</h2>
            <p className="text-sm text-foreground/70">Details coming soon.</p>
          </section>
        )}
      </div>

      <div className="mt-8">
        <Link href="/challenges" className="rounded-md px-3 py-2 text-sm font-medium text-black brand-gradient">Browse more challenges</Link>
      </div>
    </main>
  )
}

function QuizBlock({ id }: { id: number }) {
  const challenge = useMemo(() => CHALLENGES.find((c) => c.id === id), [id])
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({})
  const [score, setScore] = useState<number | null>(null)
  if (!challenge?.quiz) return null
  const submit = () => {
    const s = challenge.quiz!.questions.reduce((acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc), 0)
    setScore(s)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenge.quiz.questions.map((q) => (
          <div key={q.id} className="space-y-2">
            <p className="font-medium">{q.prompt}</p>
            <div className="space-y-1">
              {q.options.map((opt, idx) => (
                <label key={idx} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === idx}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3">
          <Button onClick={submit}>Submit</Button>
          {score !== null && (
            <span className="text-sm text-foreground/80">
              Score: {score}/{challenge.quiz.questions.length}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ChecklistBlock({ id }: { id: number }) {
  const challenge = useMemo(() => CHALLENGES.find((c) => c.id === id), [id])
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [nameIdea, setNameIdea] = useState('')
  if (!challenge?.checklist) return null
  const allDone = challenge.checklist.items.every((it) => done[it.id])
  const domainHint = nameIdea.trim()
    ? `${nameIdea.replace(/\s+/g, '').toLowerCase()}.com`
    : ''
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Week 1 helper: name check */}
        {challenge.id === 101 && (
          <div className="rounded-md border border-[var(--brand-border)] p-3">
            <label className="text-sm text-foreground/80">Name check helper</label>
            <input
              value={nameIdea}
              onChange={(e) => setNameIdea(e.target.value)}
              placeholder="Enter a name idea"
              className="mt-2 w-full rounded-md border border-[var(--brand-border)] bg-transparent px-2 py-1 text-sm"
            />
            {domainHint && (
              <p className="mt-2 text-xs text-foreground/70">Suggested domain: {domainHint} (availability not yet checked)</p>
            )}
          </div>
        )}
        <ul className="space-y-2">
          {challenge.checklist.items.map((it) => (
            <li key={it.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!done[it.id]}
                onChange={(e) => setDone((d) => ({ ...d, [it.id]: e.target.checked }))}
              />
              <span>{it.label}</span>
            </li>
          ))}
        </ul>
        <Button disabled={!allDone}>Mark complete</Button>
      </CardContent>
    </Card>
  )
}

function UploadBlock({ id }: { id: number }) {
  const challenge = useMemo(() => CHALLENGES.find((c) => c.id === id), [id])
  const [files, setFiles] = useState<Record<string, File | null>>({})
  if (!challenge?.uploads) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proof uploads</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenge.uploads.note ? (
          <p className="text-xs text-foreground/70">{challenge.uploads.note}</p>
        ) : null}
        {challenge.uploads.files.map((f) => (
          <div key={f.id} className="space-y-1">
            <label className="text-sm">{f.label}</label>
            <input
              type="file"
              accept={f.accept}
              onChange={(e) => setFiles((s) => ({ ...s, [f.id]: e.target.files?.[0] ?? null }))}
              className="block w-full text-sm"
            />
            {files[f.id] && <p className="text-xs text-foreground/70">Selected: {files[f.id]?.name}</p>}
          </div>
        ))}
        <Button disabled>Upload (coming soon)</Button>
      </CardContent>
    </Card>
  )
}

function ExpenseMatchStub() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Category Match (stub)</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80">Drag‑and‑drop mini‑game coming soon. For now, review examples of expense vs. asset vs. COGS.</p>
        <div className="mt-3 flex gap-2 text-xs">
          <span className="rounded-md border border-[var(--brand-border)] px-2 py-1">Fuel → Expense</span>
          <span className="rounded-md border border-[var(--brand-border)] px-2 py-1">Tool purchase → Asset</span>
          <span className="rounded-md border border-[var(--brand-border)] px-2 py-1">Materials → COGS</span>
        </div>
      </CardContent>
    </Card>
  )
}
