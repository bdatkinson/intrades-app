"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof Schema>;

function LoginInner() {
  const { login } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(Schema) });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      await login(data);
      const next = sp.get('next');
      router.push(next || '/dashboard');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed';
      setError(msg);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input id="email" type="email" className="w-full rounded border px-3 py-2" {...register('email')} />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">Password</label>
          <input id="password" type="password" className="w-full rounded border px-3 py-2" {...register('password')} />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={isSubmitting} className="rounded px-4 py-2 text-sm font-semibold text-black brand-gradient disabled:opacity-70">
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <div className="mt-4 text-sm">
        <Link href="/auth/reset/request" className="text-[var(--brand-primary)] hover:underline">Forgot password?</Link>
      </div>

      <p className="mt-6 text-sm">
        New here?{' '}
        <Link href="/auth/register" className="text-[var(--brand-primary)] hover:underline">Create an account</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
