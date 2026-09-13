import { useQuery } from "@tanstack/react-query";
import { getAdminEvent } from "../api";

import { AdminEventDTO } from "../types";

interface EventResponse {
  error: boolean;
  event: AdminEventDTO;
}

export const useEventById = (id: string | null) => {
  return useQuery<EventResponse>({
    queryKey: ["admin-event", id],
    queryFn: () => getAdminEvent(id as string) as Promise<EventResponse>,
    enabled: Boolean(id),
  });
};
