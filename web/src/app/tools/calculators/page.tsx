"use client"

import Link from 'next/link'

export default function CalculatorsIndex() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Calculators</h1>
      <p className="mt-2 text-foreground/70">Week 3 tools for estimating and pricing.</p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-foreground/90">
        <li>
          <Link href="/tools/calculators/labor-burden" className="underline">
            Labor Burden Calculator
          </Link>
        </li>
        <li>
          <Link href="/tools/calculators/markup-margin" className="underline">
            Markup ↔ Margin Converter
          </Link>
        </li>
      </ul>
    </main>
  )
}
