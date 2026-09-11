"use client";

import { listOrganizerApplications } from "@/features/admin/api";
import { useInfiniteQuery } from "@tanstack/react-query";

interface useOrganizerApplicationsParams {
  arananKelime: string | undefined;
  seciliStatus?: string[];
  siralama?:string
  limit?: number;
}

export const useOrganizerApplications = ({
  arananKelime,
  seciliStatus,
  siralama,
  limit = 6,
}: useOrganizerApplicationsParams) => {
  return useInfiniteQuery({
    queryKey: ["organizer-applications", seciliStatus, siralama, arananKelime, limit],

    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      listOrganizerApplications({
        arananKelime,
        seciliStatus,
        siralama,
        page: pageParam,
        limit,
      }),

    getNextPageParam: (lastPage, allPages) => {
      const applications = lastPage.applications || [];

      if (applications.length < limit) {
        return undefined;  /* Veri bitti, daha fazla yükleme yapma */
      }

      return allPages.length + 1;   /* Sıradaki sayfa numarası */
    },
  });
};
