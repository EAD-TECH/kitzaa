"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { listAdminEvents } from "../api";

interface useEventsApplicationsParams {
  secilenKategori: string | undefined;
  arananKelime?: string;
  seciliStatus?: string[];
  kolonStatus?: string;
  siralama?: string;
  limit?: number;
}

export const useEventApplications = ({
  secilenKategori,
  arananKelime,
  seciliStatus,
  kolonStatus,
  siralama,
  limit = 6,
}: useEventsApplicationsParams) => {
  const kolonAcik =
    !seciliStatus ||
    seciliStatus.length === 0 ||
    (kolonStatus ? seciliStatus.includes(kolonStatus) : false);
  return useInfiniteQuery({
    /* enabled kolon gızlıyse apiye gıtmesın */

    enabled: kolonAcik,

    queryKey: [
      "event-applications",
      secilenKategori,
      arananKelime,
      siralama,

      kolonStatus,
      limit,
    ],

    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      listAdminEvents({
        secilenKategori,
        arananKelime,
        siralama,
        page: pageParam,
        kolonStatus,
        limit,
      }),

    getNextPageParam: (lastPage, allPages) => {
      const applications = lastPage.events || [];

      if (applications.length < limit) {
        return undefined; /* Veri bitti, daha fazla yükleme yapma */
      }

      return allPages.length + 1; /* Sıradaki sayfa numarası */
    },
  });
};
