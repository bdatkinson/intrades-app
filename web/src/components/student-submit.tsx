"use client";

import { useAuth } from "@/contexts/auth";

export default function StudentSubmit({ challengeId }: { challengeId: number }) {
  const { user } = useAuth();
  if (!user || user.role !== "student") return null;
  return (
    <section className="mt-8 rounded-lg border border-[var(--brand-border)] p-4">
      <h2 className="text-lg font-medium">Submit your attempt</h2>
      <p className="mt-2 text-sm text-foreground/70">Submission UI coming soon. You have access because your role is student.</p>
      <button className="mt-4 rounded px-3 py-2 text-sm font-semibold text-black brand-gradient" disabled>
        Submit (placeholder)
      </button>
    </section>
  );
}
