"use client";

import { Toaster } from "@/components/ui/sonner";
import { refresh } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ApiError } from "@/lib/api/client";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error) => {
            /*   Gelen hata bizim kuryenin ApiError danmı */
            if (error instanceof ApiError) {
              /* ccevap evet ise error.status'a ualsıyorm */

              if (error.status === 403) {
                toast.error(
                  "Keine Berechtigung: Du darfst diese Aktion nicht ausführen.",
                );
              } else if (error.status === 400) {
                /*ya zod dakı mesajı ya da backend mesajını basmam lazım kızlara sor
                 */
                toast.error(
                  error.message || "Deine Angaben sind unvollständig oder fehlerhaft.",
                );
              } else {
                // 403 veya 400 değilse, ApiError içindeki Almanca/İngilizce mesajı bas
                toast.error(error.message);
              }
            } else {
              /* farklı bır hata olması durumu statusten farklı */
              toast.error("Ein unerwarteter Systemfehler ist aufgetreten.");
            }
          },
        }),
      }),
  );

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
      <Toaster />
    </QueryClientProvider>
  );
}
