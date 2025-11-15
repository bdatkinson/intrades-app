"use client";

import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const schema = z.object({
  fixedCosts: z.coerce.number().min(0, "Must be >= 0"),
  variablePerUnit: z.coerce.number().min(0, "Must be >= 0"),
  unitPrice: z.coerce.number().min(0, "Must be >= 0"),
});

type FormData = z.infer<typeof schema>;

export default function BreakEvenPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { fixedCosts: 0, variablePerUnit: 0, unitPrice: 0 },
    mode: "onChange",
  });

  const onSubmit = () => {};

  const fixed = Number(watch("fixedCosts"));
  const variable = Number(watch("variablePerUnit"));
  const price = Number(watch("unitPrice"));

  const contribution = Math.max(price - variable, 0);
  const units = contribution > 0 ? Math.ceil(fixed / contribution) : Infinity;
  const revenue = Number.isFinite(units) ? units * price : Infinity;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Break-even Calculator</h1>
      <p className="mt-2 text-foreground/80">
        Compute units and revenue needed to break even from fixed and variable costs.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-6">
        <Card className="p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm text-foreground/80">Fixed costs ($)</span>
              <input
                type="number"
                step="0.01"
                className="rounded-md border border-[var(--brand-border)] bg-transparent px-3 py-2"
                aria-invalid={!!errors.fixedCosts}
                {...register("fixedCosts")}
              />
              {errors.fixedCosts && (
                <span className="text-sm text-red-600">{errors.fixedCosts.message}</span>
              )}
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-foreground/80">Variable cost per unit ($)</span>
              <input
                type="number"
                step="0.01"
                className="rounded-md border border-[var(--brand-border)] bg-transparent px-3 py-2"
                aria-invalid={!!errors.variablePerUnit}
                {...register("variablePerUnit")}
              />
              {errors.variablePerUnit && (
                <span className="text-sm text-red-600">{errors.variablePerUnit.message}</span>
              )}
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-foreground/80">Unit price ($)</span>
              <input
                type="number"
                step="0.01"
                className="rounded-md border border-[var(--brand-border)] bg-transparent px-3 py-2"
                aria-invalid={!!errors.unitPrice}
                {...register("unitPrice")}
              />
              {errors.unitPrice && (
                <span className="text-sm text-red-600">{errors.unitPrice.message}</span>
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
              <dt className="text-sm text-foreground/70">Contribution per unit</dt>
              <dd className="font-medium">${" "}{contribution.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-sm text-foreground/70">Break-even units</dt>
              <dd className="font-medium">{Number.isFinite(units) ? units : "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-foreground/70">Break-even revenue</dt>
              <dd className="font-medium">${" "}{Number.isFinite(revenue) ? revenue.toFixed(2) : "—"}</dd>
            </div>
          </dl>
        </Card>
      </form>
    </div>
  );
}
