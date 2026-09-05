"use client";

import { listOrganizerApplications } from "@/features/admin/api";
import { useInfiniteQuery } from "@tanstack/react-query";

interface useOrganizerApplicationsParams {
  secilenKategori: string | undefined;
  limit?: number;
}

export const useOrganizerApplications = ({
  secilenKategori,
  limit = 6,
}: useOrganizerApplicationsParams) => {
  return useInfiniteQuery({
    queryKey: ["organizer-applications", secilenKategori, limit],

    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      listOrganizerApplications({ secilenKategori, page: pageParam, limit }),

    getNextPageParam: (lastPage, allPages) => {
      const applications = lastPage.applications || [];

      if (applications.length < limit) {
        return undefined; 
      }

      return allPages.length + 1;  
    },
  });
};
