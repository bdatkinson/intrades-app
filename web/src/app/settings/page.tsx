'use client'

import { useState } from 'react'

export default function SettingsPage(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notify, setNotify] = useState(true)

  function onSubmit(e: React.FormEvent){
    e.preventDefault()
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
        </div>
      </form>
    </main>
  )
}
