"use client"

import React, { useCallback, useRef, useState } from 'react'

type Props = {
  destKeyBuilder: (file: File) => string
  accept?: string
  onUploaded?: (args: { key: string; url: string }) => void
}

export function Uploader({ destKeyBuilder, accept, onUploaded }: Props) {
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const onFile = useCallback(async (file: File) => {
    setError(null)
    setProgress(0)

    // 1) request presigned PUT
    const key = destKeyBuilder(file)
    const signResp = await fetch('/api/uploads/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'PUT', key, contentType: file.type || 'application/octet-stream' }),
    })
    if (!signResp.ok) {
      setError('Failed to get upload URL')
      setProgress(null)
      return
    }
    const { url } = (await signResp.json()) as { url: string }

    // 2) upload via XHR to get progress events
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      abortRef.current = new AbortController()
      xhr.open('PUT', url)
      if (file.type) xhr.setRequestHeader('Content-Type', file.type)
      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return
        setProgress(Math.round((e.loaded / e.total) * 100))
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve()
        else reject(new Error(`Upload failed (${xhr.status})`))
      }
      xhr.onerror = () => reject(new Error('Network error during upload'))
      xhr.onabort = () => reject(new Error('Upload aborted'))
      xhr.send(file)
    }).catch((e) => {
      setError(e instanceof Error ? e.message : 'Upload failed')
      setProgress(null)
      throw e
    })

    // 3) optional: return GET url for immediate preview
    const getResp = await fetch('/api/uploads/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'GET', key }),
    })
    const data = getResp.ok ? ((await getResp.json()) as { url: string }) : { url: '' }
    setProgress(100)
    onUploaded?.({ key, url: data.url })
  }, [destKeyBuilder, onUploaded])

  const onChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    try {
      await onFile(f)
    } catch {}
  }

  return (
    <div className="grid gap-2">
      <input type="file" accept={accept} onChange={onChange} />
      {progress !== null && (
        <div className="h-2 w-full rounded bg-white/10">
          <div className="h-2 rounded bg-[var(--brand-accent)]" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
