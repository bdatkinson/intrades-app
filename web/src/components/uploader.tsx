'use client'

import { useState } from 'react'

type Props = {
  accept?: string
  challengeId?: number
  uploadMode?: 'proxy' | 'presigned'
  onUploaded?: (p: { key: string; url: string }) => void
}

async function signPut(key: string, contentType: string) {
  const r = await fetch('/api/uploads/sign', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ method: 'PUT', key, contentType }),
  })
  if (!r.ok) throw new Error('Failed to sign PUT')
  const j = await r.json()
  return j.url as string
}

async function signGet(key: string) {
  const r = await fetch('/api/uploads/sign', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ method: 'GET', key }),
  })
  if (!r.ok) throw new Error('Failed to sign GET')
  const j = await r.json()
  return j.url as string
}

function makeKey(challengeId: number, file: File) {
  const ts = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  return `uploads/challenges/${challengeId}/${ts}-${safeName}`
}

export default function Uploader({ accept, challengeId = 0, uploadMode = 'proxy', onUploaded }: Props) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string>('')
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [key, setKey] = useState<string>('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setStatus('uploading')
    const k = makeKey(challengeId, file)
    try {
      if (uploadMode === 'presigned') {
        const putUrl = await signPut(k, file.type || 'application/octet-stream')
        const res = await fetch(putUrl, { method: 'PUT', body: file, headers: { 'content-type': file.type || 'application/octet-stream' } })
        if (!res.ok) throw new Error('Upload failed')
      } else {
        const qs = new URLSearchParams({ key: k, contentType: file.type || 'application/octet-stream' })
        const res = await fetch(`/api/uploads/put?${qs.toString()}`, { method: 'POST', body: file })
        if (!res.ok) throw new Error('Upload failed')
      }
      const getUrl = await signGet(k)
      setKey(k)
      setPreviewUrl(getUrl)
      setStatus('done')
      onUploaded?.({ key: k, url: getUrl })
    } catch (e: unknown) {
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <div className="rounded-lg border border-[var(--brand-border)] p-4">
      <div className="text-sm text-foreground/80">Submit your work</div>
      <input type="file" accept={accept} onChange={handleFile} className="mt-3 block text-sm" />
      {status === 'uploading' && <div className="mt-2 text-sm text-foreground/70">Uploading…</div>}
      {status === 'error' && <div className="mt-2 text-sm text-red-500">{error}</div>}
      {status === 'done' && previewUrl && (
        <div className="mt-3 space-y-2">
          <div className="text-xs text-foreground/60 break-all">Key: {key}</div>
          {/* If image, preview; else show link */}
          {/^image\//.test(previewUrl) ? (
            <img src={previewUrl} alt="Submission preview" className="max-h-64 rounded" />
          ) : (
            <a href={previewUrl} target="_blank" rel="noreferrer" className="text-sm text-[var(--electric-cyan)] underline">View submission</a>
          )}
        </div>
      )}
    </div>
  )
}
