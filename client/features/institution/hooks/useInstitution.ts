"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/client";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

import { getMyInstitution, updateMyInstitution } from "../api/institutionApi";

import type { UpdateInstitutionPayload } from "../types/institution.types";

const INSTITUTION_QUERY_KEY = ["my-institution"];

export function useMyInstitution() {
  const { data: currentUser } = useCurrentUser();

  return useQuery({
    queryKey: INSTITUTION_QUERY_KEY,
    queryFn: getMyInstitution,
    enabled: currentUser?.role === "organizer",
  });
}

export function useUpdateMyInstitution() {
  const t = useTranslations("Institution");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateInstitutionPayload) => updateMyInstitution(payload),

    onSuccess: () => {
      toast.success(t("saved"));
      queryClient.invalidateQueries({
        queryKey: INSTITUTION_QUERY_KEY,
      });
    },

    onError: () => {
       toast.error(t("saveFailed"));
    },
  });
}
