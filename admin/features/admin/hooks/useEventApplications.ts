"use client";


import { useInfiniteQuery } from "@tanstack/react-query";
import { listAdminEvents } from "../api";

interface useEventsApplicationsParams {
  secilenKategori: string | undefined;
  arananKelime?: string;
  seciliStatus?:string[]
  limit?: number;
}

export const useEventApplications = ({
  secilenKategori,
  arananKelime,
  seciliStatus,
  limit = 6,
}: useEventsApplicationsParams) => {
  return useInfiniteQuery({
    queryKey: ["event-applications", secilenKategori, arananKelime, seciliStatus, limit],

    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      listAdminEvents({ secilenKategori, arananKelime, seciliStatus ,page: pageParam, limit }),

    getNextPageParam: (lastPage, allPages) => {
      const applications = lastPage.events || [];

      if (applications.length < limit) {
        return undefined;  /* Veri bitti, daha fazla yükleme yapma */
      }

      return allPages.length + 1;   /* Sıradaki sayfa numarası */
    },
  });
};
