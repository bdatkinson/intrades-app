"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";

const Schema = z.object({ email: z.string().email() });
type FormValues = z.infer<typeof Schema>;

export default function ResetRequestPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(Schema) });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      await api.resetRequest({ email: data.email });
      setSent(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Request failed';
      setError(msg);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Reset password</h1>
      {sent ? (
        <p className="text-sm">Check your email for a reset link.</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input id="email" type="email" className="w-full rounded border px-3 py-2" {...register('email')} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={isSubmitting} className="rounded px-4 py-2 text-sm font-semibold text-black brand-gradient disabled:opacity-70">
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </div>
  );
}
