"use client";

import { listOrganizerApplications } from "@/features/admin/api";
import { useInfiniteQuery } from "@tanstack/react-query";

interface useOrganizerApplicationsParams {
  arananKelime: string | undefined;
  seciliStatus?: string[];
  kolonStatus?: string;
  siralama?: string;
  limit?: number;
}

export const useOrganizerApplications = ({
  arananKelime,
  seciliStatus,
  kolonStatus,
  siralama,
  limit = 6,
}: useOrganizerApplicationsParams) => {
  
 /* salter mantıgı */
  const kolonAcik =
    !seciliStatus ||
    seciliStatus.length === 0 ||
    (kolonStatus ? seciliStatus.includes(kolonStatus) : false);

  return useInfiniteQuery({
    /* kolon bazlı api ye ıstek atıyorm */
    enabled: kolonAcik,
    
    /* secili status deıl kolon status e gore */
    queryKey: ["organizer-applications", kolonStatus, siralama, arananKelime, limit],

    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      listOrganizerApplications({
        arananKelime,
        siralama,
        page: pageParam,
        kolonStatus, 
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