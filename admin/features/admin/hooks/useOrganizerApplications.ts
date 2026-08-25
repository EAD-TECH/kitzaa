"use client";

import { listOrganizerApplications } from "@/features/admin/api";
import { useQuery } from "@tanstack/react-query";

export const useOrganizerApplications = () => {
  return useQuery({
    queryKey: ["organizer-applications"],
    queryFn: () => listOrganizerApplications(),
  });
};
