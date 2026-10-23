"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { useEventsStore } from "@/features/events/store/EventStore";
import { completeProfile } from "../AuthApi";
import { useAuthStore } from "../store/authStore";
import type { CompleteProfileValues } from "../validations/completeProfile.schema";

export function useCompleteProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setSavedEventIds = useEventsStore((state) => state.setSavedEventIds);

  return useMutation({
    mutationFn: (values: CompleteProfileValues) => completeProfile(values),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(["currentUser"], data.user);
      setSavedEventIds(data.user.savedEvents);
      router.push("/");
    },
  });
}
