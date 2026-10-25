"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useEventsStore } from "@/features/events/store/EventStore";
import { googleSignIn } from "../AuthApi";
import { useAuthStore } from "../store/authStore";

export function useGoogleSignIn() {
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setSavedEventIds = useEventsStore((state) => state.setSavedEventIds);

  return useMutation({
    mutationFn: (credential: string) =>
      googleSignIn({
        credential,
        locale: locale === "en" ? "en" : "de",
      }),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(["currentUser"], data.user);
      setSavedEventIds(data.user.savedEvents);

      if (data.user.profileCompleted === false) {
        router.push("/complete-profile");
        return;
      }

      if (data.user.role === "admin") {
        window.location.assign(process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001");
        return;
      }

      router.push("/");
    },
  });
}
