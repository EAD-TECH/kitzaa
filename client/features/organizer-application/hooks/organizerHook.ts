"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

const ORGANIZER_QUERY_KEY = ["organizer-application"] as const;

const ORGANIZER_CREATE_ERROR_MESSAGES: Record<string, string> = {
  "You are already an organizer or admin.": "Du bist bereits Organisator oder Admin.",
  "Please verify your email before applying.":
    "Bitte bestätige zuerst deine E-Mail-Adresse, bevor du dich bewirbst.",
  "You already have an application in progress.": "Du hast bereits einen Antrag in Prüfung.",
};

export const useMyOrganizerApplications = (enabled = true) => {
  return useQuery({
    queryKey: ORGANIZER_QUERY_KEY,
    queryFn: getMyOrganizerApplications,
    enabled,
  });
};

export const useCreateOrganizerApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizerApplicationData: ApplyOrganizerInput) =>
      createOrganizerApplication(organizerApplicationData),
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? (ORGANIZER_CREATE_ERROR_MESSAGES[error.message] ??
            "Antrag konnte nicht gesendet werden. Bitte versuche es erneut.")
          : "Antrag konnte nicht gesendet werden. Bitte versuche es erneut.";
      toast.error(message);
    },
    onSuccess: (response: ApplyOrganizerResponse) => {
      toast.success("Dein Antrag wurde eingereicht.");
      queryClient.setQueryData<GetMyOrganizerApplicationsResponse>(ORGANIZER_QUERY_KEY, (current) => ({
        error: false,
        applications: [response.application, ...(current?.applications ?? [])],
      }));
      queryClient.invalidateQueries({ queryKey: ORGANIZER_QUERY_KEY });
    },
  });
};
