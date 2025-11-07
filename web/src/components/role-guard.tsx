"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";

export type Role = "student" | "instructor" | "admin";

export function hasRole(userRole: string | undefined, allowed: Role[]): boolean {
  if (!userRole) return false;
  return allowed.includes(userRole as Role);
}

export default function RoleGuard({ allowed, children }: { allowed: Role[]; children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    if (!hasRole(user.role, allowed)) {
      router.replace("/dashboard");
    }
  }, [user, allowed, router]);

  if (!user) return null;
  if (!hasRole(user.role, allowed)) return null;
  return <>{children}</>;
}
