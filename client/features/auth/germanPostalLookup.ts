"use client";

import { useEffect, useRef } from "react";

export type GermanPostalPlace = {
  city: string;
  state: string;
};

export async function lookupGermanPostalCode(
  zipCode: string,
  signal: AbortSignal,
): Promise<GermanPostalPlace | null> {
  const res = await fetch(`https://api.zippopotam.us/de/${zipCode}`, { signal });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    places?: Array<{ "place name"?: string; state?: string }>;
  };
  const place = data.places?.[0];
  if (!place?.["place name"] || !place.state) return null;

  return { city: place["place name"], state: place.state };
}

type ZipLookupHandlers = {
  onIncomplete: () => void;
  onStart: () => void;
  onPlace: (place: GermanPostalPlace) => void;
  onInvalid: () => void;
  onDone: () => void;
};

export function useGermanZipLookup(zipCode: string, handlers: ZipLookupHandlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!/^\d{5}$/.test(zipCode)) {
      handlersRef.current.onIncomplete();
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      handlersRef.current.onStart();
      try {
        const place = await lookupGermanPostalCode(zipCode, controller.signal);
        if (!place) {
          handlersRef.current.onInvalid();
          return;
        }
        handlersRef.current.onPlace(place);
      } catch {
        // Request was aborted because the postal code changed.
      } finally {
        handlersRef.current.onDone();
      }
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [zipCode]);
}
