'use client'

import { useState } from 'react'

export default function SettingsPage(){
  const init = (() => {
    if (typeof window === 'undefined') return { name: '', email: '', notify: true }
    try {
      const raw = localStorage.getItem('settings')
      if (!raw) return { name: '', email: '', notify: true }
      const s = JSON.parse(raw)
      return { name: s.name ?? '', email: s.email ?? '', notify: typeof s.notify === 'boolean' ? s.notify : true }
    } catch { return { name: '', email: '', notify: true } }
  })()
  const [name, setName] = useState<string>(init.name)
  const [email, setEmail] = useState<string>(init.email)
  const [notify, setNotify] = useState<boolean>(init.notify)
  const [saved, setSaved] = useState<null | 'ok' | 'err'>(null)

  function onSubmit(e: React.FormEvent){
    e.preventDefault()
    try {
      localStorage.setItem('settings', JSON.stringify({ name, email, notify }))
      setSaved('ok')
      setTimeout(() => setSaved(null), 1500)
    } catch {
      setSaved('err')
      setTimeout(() => setSaved(null), 2000)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-foreground/70">Manage your profile and preferences.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="text-foreground/80">Display name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border border-[var(--brand-border)] bg-transparent px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-foreground/80">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border border-[var(--brand-border)] bg-transparent px-3 py-2" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
          <span className="text-foreground/80">Email me about new challenges</span>
        </label>
        <div>
          <button type="submit" className="inline-flex rounded-md px-3 py-1.5 text-sm font-medium text-black brand-gradient">Save changes</button>
          {saved === 'ok' && <span className="ml-3 text-sm text-foreground/70">Saved</span>}
          {saved === 'err' && <span className="ml-3 text-sm text-red-500">Could not save</span>}
        </div>
      </form>
    </main>
  )
}
