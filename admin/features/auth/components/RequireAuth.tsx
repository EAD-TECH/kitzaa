"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../store/authStore";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { AuthUser } from "../types/authTypes";
import { redirectExternal } from "@/features/auth/utils/navigation";

type RequireAuthProps = {
  children: ReactNode;
  roles: AuthUser["role"];
};

export default function RequireAuth({ children, roles }: RequireAuthProps) {
  const isReady = useAuthStore((state) => state.isReady);
  const { data: user } = useCurrentUser();
  const CLIENT_URL =
    process.env.NEXT_PUBLIC_CLIENT_URL ?? "http://localhost:3000";

  useEffect(() => {
    if (!isReady) return;

    if (!user) {
      redirectExternal(`${CLIENT_URL}/login`);
      return;
    }

    if (user.role !== roles) {
      redirectExternal(CLIENT_URL);
    }
  }, [isReady, user, roles]);

  if (!isReady || !user || user.role !== roles) {
    return null;
  }

  return <>{children}</>;
}
