"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ApiError } from "@/lib/api/client";
import { getDashboardSummary } from "../api/dashboard";

export function useDashboardSummary() {
  const isReady = useAuthStore((state) => state.isReady);
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
    enabled: isReady && !!accessToken,
    retry: (failureCount, error) => {
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
