"use client"

import { useMemo } from 'react'
import type React from 'react'
import { useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toPercent, markupFromMargin, marginFromMarkup } from '@/lib/calculators'

const Schema = z.object({
  margin: z.coerce.number().min(0).optional(),
  markup: z.coerce.number().min(0).optional(),
})

type FormVals = z.infer<typeof Schema>

export default function MarkupMarginPage() {
  const { register, watch, setValue } = useForm<FormVals>({
    resolver: zodResolver(Schema) as Resolver<FormVals, unknown>,
    defaultValues: { margin: 30, markup: undefined },
  })

  const vals = watch()
  const computed = useMemo(() => {
    if (vals.margin !== undefined && vals.margin !== null && vals.margin !== 0) {
      const m = toPercent(vals.margin)
      return { mode: 'from-margin' as const, markup: markupFromMargin(m) * 100, margin: vals.margin }
    }
    if (vals.markup !== undefined && vals.markup !== null) {
      const u = toPercent(vals.markup)
      return { mode: 'from-markup' as const, margin: marginFromMarkup(u) * 100, markup: vals.markup }
    }
    return { mode: 'none' as const }
  }, [vals])

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Markup ↔ Margin Converter</h1>
      <p className="mt-2 text-sm text-foreground/70">Enter one value and we’ll compute the other. Inputs accept 30 for 30%.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Margin %" inputProps={{ step: 0.01, ...register('margin', { onChange: () => setValue('markup', undefined, { shouldDirty: false }) }) }} />
        <Field label="Markup %" inputProps={{ step: 0.01, ...register('markup', { onChange: () => setValue('margin', undefined, { shouldDirty: false }) }) }} />
      </div>

      {computed.mode !== 'none' && (
        <div className="mt-6 rounded-md border border-[var(--brand-border)] p-4">
          <h2 className="text-lg font-medium">Result</h2>
          <ul className="mt-2 text-sm text-foreground/90">
            {computed.mode === 'from-margin' && <li>Markup: {computed.markup.toFixed(2)}%</li>}
            {computed.mode === 'from-markup' && <li>Margin: {computed.margin.toFixed(2)}%</li>}
          </ul>
        </div>
      )}
    </main>
  )
}

function Field({ label, inputProps }: { label: string; inputProps: React.InputHTMLAttributes<HTMLInputElement> }) {
  return (
    <label className="text-sm text-foreground/80">
      {label}
      <input type="number" className="mt-1 w-full rounded-md border border-[var(--brand-border)] bg-transparent px-2 py-1" {...inputProps} />
    </label>
  )
}
