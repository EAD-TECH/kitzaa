"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { AuthUser } from "@/features/auth/types/authTypes";
import { updatePersonalInfo } from "../api/updatePersonalInfoApi";
import type { UpdatePersonalInfoPayload } from "../types/updatePersonalInfo.types";

export function useUpdatePersonalInfo(userId: string | undefined) {
  const t = useTranslations("Profile");
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
      toast.success(t("infoSaved"));
    },

    onError: () => {
      toast.error(
        t("infoSaveFailed"),
      );
    },
  });
}
