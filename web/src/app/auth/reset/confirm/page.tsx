"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

const Schema = z.object({ password: z.string().min(6) });
type FormValues = z.infer<typeof Schema>;

function ResetConfirmInner() {
  const sp = useSearchParams();
  const token = sp.get("token") || "";
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(Schema) });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      await api.resetConfirm({ token, password: data.password });
      setDone(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Reset failed';
      setError(msg);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Choose a new password</h1>
      {done ? (
        <p className="text-sm">Password updated. You may now log in.</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <label htmlFor="password" className="block text-sm mb-1">New password</label>
            <input id="password" type="password" className="w-full rounded border px-3 py-2" {...register('password')} />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={isSubmitting} className="rounded px-4 py-2 text-sm font-semibold text-black brand-gradient disabled:opacity-70">
            {isSubmitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ResetConfirmInner />
    </Suspense>
  );
}
