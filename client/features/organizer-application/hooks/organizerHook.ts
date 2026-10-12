"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/client";

import {
  createOrganizerApplication,
  getMyOrganizerApplications,
} from "../api/organizerApplicationApi";
import type {
  ApplyOrganizerResponse,
  GetMyOrganizerApplicationsResponse,
} from "../types/organizerApplication.types";
import type { ApplyOrganizerInput } from "../validations/organizerApplication.schema";
import { useTrackActions } from "@/features/socket/hooks/useTrackActions";

const ORGANIZER_QUERY_KEY = ["organizer-application"] as const;

const ORGANIZER_CREATE_ERROR_KEYS = {
  "You are already an organizer or admin.": "alreadyOrganizerOrAdmin",
  "Please verify your email before applying.": "verifyBeforeApply",
  "You already have an application in progress.": "applicationInProgress",
} as const;

export const useMyOrganizerApplications = (enabled = true) => {
  return useQuery({
    queryKey: ORGANIZER_QUERY_KEY,
    queryFn: getMyOrganizerApplications,
    enabled,
  });
};

export const useCreateOrganizerApplication = () => {
  const t = useTranslations("OrganizerApplication");
  const queryClient = useQueryClient();
  const {handleTrackActions}=useTrackActions()

  return useMutation({
    mutationFn: (organizerApplicationData: ApplyOrganizerInput) =>
      createOrganizerApplication(organizerApplicationData),
    onError: (error) => {
      const errorKey =
        error instanceof ApiError
          ? ORGANIZER_CREATE_ERROR_KEYS[error.message as keyof typeof ORGANIZER_CREATE_ERROR_KEYS]
          : undefined;
      const message = errorKey ? t(errorKey) : t("sendFailed");
      toast.error(message);
    },
    onSuccess: (response: ApplyOrganizerResponse) => {
      toast.success(t("submitted"));
      queryClient.setQueryData<GetMyOrganizerApplicationsResponse>(
        ORGANIZER_QUERY_KEY,
        (current) => ({
          error: false,
          applications: [
            response.application,
            ...(current?.applications ?? []),
          ],
        }),
      );
      queryClient.invalidateQueries({ queryKey: ORGANIZER_QUERY_KEY });

      const user = queryClient.getQueryData<{
        firstName?: string;
        lastName?: string;
      }>(["currentUser"]);
      const userName = user ? `${user.firstName} ${user.lastName}` : "Biri";

      handleTrackActions({
        type: "application",
        title: "Yeni organizatör başvurusu",
        description: `${userName} "${response.application.institutionData.name}" için organizatör başvurusu gönderdi.`,
        relatedId: response.application._id,
      });
    },
  });
};
