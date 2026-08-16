
"use client";

import { refresh } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ApiError } from "@/lib/api/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setIsReady = useAuthStore((s) => s.setIsReady);

  useEffect(() => {
    refresh()
      .then((data) => {
        setAccessToken(data.accessToken);
        queryClient.setQueryData(["currentUser"], data.user);
      })
      .catch((err) => {
        if (!(err instanceof ApiError)) throw err;
      })
      .finally(() => {
        setIsReady(true);
      });
  }, [setAccessToken, setIsReady, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}