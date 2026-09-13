"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { AuthUser } from "../types/authTypes";

type RequireAuthProps = {
  children: ReactNode;
  roles: AuthUser["role"];
};

export default function RequireAuth({ children, roles }: RequireAuthProps) {
  const router = useRouter();
  const isReady = useAuthStore((state) => state.isReady);
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (!isReady) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== roles) {
      router.replace("/");
    }
  }, [isReady, user, roles, router]);

  if (!isReady || !user || user.role !== roles) {
    return null;
  }

  return <>{children}</>;
}
