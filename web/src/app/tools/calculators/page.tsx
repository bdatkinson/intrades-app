import Link from "next/link";

export default function CalculatorsIndex() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Calculators</h1>
      <p className="mt-2 text-foreground/80">Helpful tools for pricing and planning.</p>
      <ul className="mt-6 space-y-2">
        <li>
          <Link className="text-[var(--brand-primary)] hover:underline" href="/tools/calculators/pricing">
            Pricing Calculator
          </Link>
        </li>
        <li>
          <Link className="text-[var(--brand-primary)] hover:underline" href="/tools/calculators/break-even">
            Break-even Calculator
          </Link>
        </li>
      </ul>
    </div>
  );
}
