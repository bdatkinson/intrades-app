"use client"

import { useMemo } from 'react'
import type React from 'react'
import { useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { calcLaborBurden, toPercent } from '@/lib/calculators'

const Schema = z.object({
  baseWage: z.coerce.number().min(0),
  fica: z.coerce.number().min(0),
  futa: z.coerce.number().min(0),
  suta: z.coerce.number().min(0),
  workersComp: z.coerce.number().min(0),
  benefits: z.coerce.number().min(0),
  overhead: z.coerce.number().min(0),
})

type FormVals = z.infer<typeof Schema>

export default function LaborBurdenPage() {
  const { register, handleSubmit, watch } = useForm<FormVals>({
    // Cast to satisfy resolver generic expectations across versions
    resolver: zodResolver(Schema) as Resolver<FormVals, unknown>,
    defaultValues: {
      baseWage: 25,
      fica: 7.65,
      futa: 0.6,
      suta: 1.5,
      workersComp: 3,
      benefits: 10,
      overhead: 15,
    },
  })

  const vals = watch()
  const res = useMemo(() =>
    calcLaborBurden({
      baseWage: vals.baseWage || 0,
      fica: toPercent(vals.fica || 0),
      futa: toPercent(vals.futa || 0),
      suta: toPercent(vals.suta || 0),
      workersComp: toPercent(vals.workersComp || 0),
      benefits: toPercent(vals.benefits || 0),
      overhead: toPercent(vals.overhead || 0),
    }),
  [vals])

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Labor Burden Calculator</h1>
      <p className="mt-2 text-sm text-foreground/70">Enter hourly wage and percentage loads. Percent fields accept values like 7.65 for 7.65%.</p>

      <form onSubmit={handleSubmit(() => {})} className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Base wage ($/hr)" inputProps={{ step: 0.01, ...register('baseWage') }} />
        <Field label="FICA %" inputProps={{ step: 0.01, ...register('fica') }} />
        <Field label="FUTA %" inputProps={{ step: 0.01, ...register('futa') }} />
        <Field label="SUTA %" inputProps={{ step: 0.01, ...register('suta') }} />
        <Field label="Workers Comp %" inputProps={{ step: 0.01, ...register('workersComp') }} />
        <Field label="Benefits %" inputProps={{ step: 0.01, ...register('benefits') }} />
        <Field label="Overhead %" inputProps={{ step: 0.01, ...register('overhead') }} />
      </form>

      <div className="mt-6 rounded-md border border-[var(--brand-border)] p-4">
        <h2 className="text-lg font-medium">Results</h2>
        <ul className="mt-2 text-sm text-foreground/90">
          <li>Load %: {(res.loadPct * 100).toFixed(2)}%</li>
          <li>Burden $/hr: ${res.burdenPerHour.toFixed(2)}</li>
          <li>Total $/hr: ${res.total.toFixed(2)}</li>
        </ul>
      </div>
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
