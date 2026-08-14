"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import type { AuthUser } from "../types/authTypes";

type RequireAuthProps = {
  children: ReactNode;
  roles: AuthUser["role"];
};

export default function RequireAuth({ children, roles }: RequireAuthProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== roles) {
      router.replace("/");
    }
  }, [hasHydrated, user, roles, router]);

  if (!hasHydrated || !user || user.role !== roles) {
    return null;
  }

  return <>{children}</>;
}
