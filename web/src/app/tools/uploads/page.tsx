"use client"

import { Uploader } from '@/components/uploader'
import { useState } from 'react'

export default function UploadsDemoPage() {
  const [last, setLast] = useState<{ key: string; url: string } | null>(null)

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Upload Demo</h1>
      <p className="mt-2 text-sm text-foreground/70">Test S3 uploads using presigned URLs.</p>

      <div className="mt-6">
        <Uploader
          accept="image/*,application/pdf"
          destKeyBuilder={(file) => `users/demo/challenges/demo/${Date.now()}-${file.name}`}
          onUploaded={(r) => setLast(r)}
        />
      </div>

      {last && (
        <div className="mt-6 rounded-md border border-[var(--brand-border)] p-4 text-sm">
          <div>Key: {last.key}</div>
          {last.url ? (
            <div className="mt-2">
              <a href={last.url} target="_blank" rel="noreferrer" className="underline">
                Open presigned GET
              </a>
            </div>
          ) : null}
        </div>
      )}
    </main>
  )
}
