"use client";

import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const schema = z.object({
  materials: z.coerce.number().min(0, "Must be >= 0"),
  hours: z.coerce.number().min(0, "Must be >= 0"),
  rate: z.coerce.number().min(0, "Must be >= 0"),
  overheadPct: z.coerce
    .number()
    .min(0, "Must be >= 0")
    .max(100, "Max 100"),
  marginPct: z.coerce
    .number()
    .min(0, "Must be >= 0")
    .max(95, "Keep margin under 95%"),
});

type FormData = z.infer<typeof schema>;

function currency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(
    Number.isFinite(n) ? n : 0
  );
}

export default function PricingCalculatorPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { materials: 0, hours: 0, rate: 0, overheadPct: 10, marginPct: 30 },
    mode: "onChange",
  });

  const onSubmit = () => {};

  const materials = Number(watch("materials"));
  const hours = Number(watch("hours"));
  const rate = Number(watch("rate"));
  const overheadPct = Number(watch("overheadPct"));
  const marginPct = Number(watch("marginPct"));

  const labor = hours * rate;
  const baseCost = materials + labor;
  const overhead = baseCost * (overheadPct / 100);
  const totalCost = baseCost + overhead;
  const margin = marginPct / 100;
  const price = margin >= 1 ? Infinity : totalCost / (1 - margin);
  const profit = price - totalCost;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Pricing Calculator</h1>
      <p className="mt-2 text-foreground/80">
        Estimate a selling price from materials, labor, overhead, and target margin.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-6">
        <Card className="p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm text-foreground/80">Materials ($)</span>
              <input
                type="number"
                step="0.01"
                className="rounded-md border border-[var(--brand-border)] bg-transparent px-3 py-2"
                aria-invalid={!!errors.materials}
                {...register("materials")}
              />
              {errors.materials && (
                <span className="text-sm text-red-600">{errors.materials.message}</span>
              )}
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-foreground/80">Labor hours</span>
              <input
                type="number"
                step="0.1"
                className="rounded-md border border-[var(--brand-border)] bg-transparent px-3 py-2"
                aria-invalid={!!errors.hours}
                {...register("hours")}
              />
              {errors.hours && <span className="text-sm text-red-600">{errors.hours.message}</span>}
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-foreground/80">Labor rate ($/hr)</span>
              <input
                type="number"
                step="0.01"
                className="rounded-md border border-[var(--brand-border)] bg-transparent px-3 py-2"
                aria-invalid={!!errors.rate}
                {...register("rate")}
              />
              {errors.rate && <span className="text-sm text-red-600">{errors.rate.message}</span>}
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-foreground/80">Overhead (%)</span>
              <input
                type="number"
                step="1"
                className="rounded-md border border-[var(--brand-border)] bg-transparent px-3 py-2"
                aria-invalid={!!errors.overheadPct}
                {...register("overheadPct")}
              />
              {errors.overheadPct && (
                <span className="text-sm text-red-600">{errors.overheadPct.message}</span>
              )}
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-foreground/80">Target margin (%)</span>
              <input
                type="number"
                step="1"
                className="rounded-md border border-[var(--brand-border)] bg-transparent px-3 py-2"
                aria-invalid={!!errors.marginPct}
                {...register("marginPct")}
              />
              {errors.marginPct && (
                <span className="text-sm text-red-600">{errors.marginPct.message}</span>
              )}
            </label>
          </div>
          <div className="mt-4">
            <Button type="submit">Recalculate</Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold">Results</h2>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-foreground/70">Materials</dt>
              <dd className="font-medium">{currency(materials)}</dd>
            </div>
            <div>
              <dt className="text-sm text-foreground/70">Labor</dt>
              <dd className="font-medium">{currency(labor)}</dd>
            </div>
            <div>
              <dt className="text-sm text-foreground/70">Overhead</dt>
              <dd className="font-medium">{currency(overhead)}</dd>
            </div>
            <div>
              <dt className="text-sm text-foreground/70">Total cost</dt>
              <dd className="font-medium">{currency(totalCost)}</dd>
            </div>
            <div>
              <dt className="text-sm text-foreground/70">Target price</dt>
              <dd className="font-medium">{currency(price)}</dd>
            </div>
            <div>
              <dt className="text-sm text-foreground/70">Estimated profit</dt>
              <dd className="font-medium">{currency(profit)}</dd>
            </div>
          </dl>
        </Card>
      </form>
    </div>
  );
}
