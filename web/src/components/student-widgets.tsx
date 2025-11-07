"use client";

import { useAuth } from "@/contexts/auth";

export default function StudentWidgets() {
  const { user } = useAuth();
  if (!user || user.role !== "student") return null;
  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border border-[var(--brand-border)] p-4">
        <h3 className="text-sm font-medium">XP Progress</h3>
        <p className="mt-2 text-sm text-foreground/70">Placeholder progress bar</p>
      </div>
      <div className="rounded-lg border border-[var(--brand-border)] p-4">
        <h3 className="text-sm font-medium">Badges</h3>
        <p className="mt-2 text-sm text-foreground/70">Earned + next up</p>
      </div>
      <div className="rounded-lg border border-[var(--brand-border)] p-4">
        <h3 className="text-sm font-medium">Streak</h3>
        <p className="mt-2 text-sm text-foreground/70">Your current streak</p>
      </div>
    </section>
  );
}
