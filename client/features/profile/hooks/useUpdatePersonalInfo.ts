"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { AuthUser } from "@/features/auth/types/authTypes";
import { updatePersonalInfo } from "../api/updatePersonalInfoApi";
import type { UpdatePersonalInfoPayload } from "../types/updatePersonalInfo.types";

export function useUpdatePersonalInfo(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePersonalInfoPayload) => {
      if (!userId) {
        throw new Error("User id is missing");
      }

      return updatePersonalInfo(userId, payload);
    },

    onSuccess: (data) => {
      queryClient.setQueryData<AuthUser | null>(["currentUser"], data.user);
      toast.success("Deine persönlichen Informationen wurden gespeichert.");
    },

    onError: () => {
      toast.error(
        "Persönliche Informationen konnten nicht gespeichert werden. Bitte versuche es erneut.",
      );
    },
  });
}
