"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  useEffect(() => {
    if (!user) {
      const qs = sp.toString();
      const next = qs ? `${pathname}?${qs}` : pathname;
      router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
    }
  }, [user, router, pathname, sp]);

  if (!user) return null;
  return <>{children}</>;
}
