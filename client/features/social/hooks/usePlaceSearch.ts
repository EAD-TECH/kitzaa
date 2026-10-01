"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export type PlaceSearchResult = {
  placeName: string;
  city: string | null;
  lat: number;
  lng: number;
};

type PlacesResponse = {
  places: PlaceSearchResult[];
};

export const usePlaceSearch = (query: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  const trimmedQuery = debouncedQuery.trim();

  return useQuery({
    queryKey: ["social-place-search", trimmedQuery],
    queryFn: async (): Promise<PlaceSearchResult[]> => {
      const response = await fetch(
        `/api/places?q=${encodeURIComponent(trimmedQuery)}`,
      );
      const data = (await response.json()) as PlacesResponse;

      if (!response.ok) {
        throw new Error("Place search failed");
      }

      return data.places ?? [];
    },
    enabled: trimmedQuery.length >= 2,
  });
};