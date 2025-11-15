import Link from 'next/link'
import { CHALLENGES, type Challenge } from '@/data/challenges'
import Uploader from '@/components/uploader'
import React, { Suspense } from 'react'

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
        <span className="rounded-md border border-[var(--brand-border)] px-2 py-1 text-xs text-foreground/80">{item.trade} • {item.difficulty}</span>
      </div>
      <p className="mt-3 text-foreground/80">{item.summary}</p>

      <section className="mt-8 space-y-2">
        <h2 className="text-lg font-medium">Overview</h2>
        <p className="text-sm text-foreground/70">This is a placeholder detail page. In Sprint 3/4 we can add steps, tools, safety notes, and media.</p>
      </section>

      {item.submission?.type === 'upload' && (
        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-medium">Submission</h2>
          <p className="text-sm text-foreground/70">Upload a photo or video of your work.</p>
          <Suspense>
            <UploadSection challenge={item} />
          </Suspense>
        </section>
      )}

      <div className="mt-8">
        <Link href="/challenges" className="rounded-md px-3 py-2 text-sm font-medium text-black brand-gradient">Browse more challenges</Link>
      </div>
    </main>
  )
}

// Client component for uploader and persistence
function UploadSection({ challenge }: { challenge: Challenge }){
  'use client'
  const accept = challenge.submission?.type === 'upload' ? challenge.submission.accept : undefined

  function signedGetUrl(key: string){
    const cf = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN
    const bucket = process.env.NEXT_PUBLIC_S3_BUCKET
    return cf ? `https://${cf}/${key}` : bucket ? `https://${bucket}.s3.amazonaws.com/${key}` : '#'
  }

  const [existing, setExisting] = React.useState<null | { key: string; url: string }>(null)

  React.useEffect(() => {
    try {
      const storeKey = 'challenge-submissions'
      const raw = localStorage.getItem(storeKey)
      if (!raw) return
      const data = JSON.parse(raw) as Record<string, { key: string }>
      const rec = data[String(challenge.id)]
      if (!rec?.key) return
      const url = signedGetUrl(rec.key)
      setExisting({ key: rec.key, url })
    } catch {}
  }, [challenge.id])

  function handleUploaded({ key, url }: { key: string; url: string }){
    try {
      const storeKey = 'challenge-submissions'
      const raw = localStorage.getItem(storeKey)
      const data = raw ? (JSON.parse(raw) as Record<string, { key: string }>) : {}
      data[String(challenge.id)] = { key }
      localStorage.setItem(storeKey, JSON.stringify(data))
    } catch {}
    setExisting({ key, url })
  }

  return (
    <div className="space-y-4">
      {existing && (
        <div className="rounded-lg border border-[var(--brand-border)] p-4">
          <div className="text-sm font-medium">Your previous submission</div>
          <div className="mt-2 text-xs text-foreground/60 break-all">Key: {existing.key}</div>
          <div className="mt-3">
            {/^image\//.test(existing.url) ? (
              <img src={existing.url} alt="Previous submission" className="max-h-64 rounded" />
            ) : (
              <a href={existing.url} target="_blank" rel="noreferrer" className="text-sm text-[var(--electric-cyan)] underline">View submission</a>
            )}
          </div>
        </div>
      )}
      <Uploader accept={accept} challengeId={challenge.id} uploadMode="presigned" onUploaded={handleUploaded} />
    </div>
  )
}
