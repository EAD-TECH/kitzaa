import { useQuery } from "@tanstack/react-query";
import { getOrganizerApplication } from "../api";

export const useOrganızarApplicationById = (id: string | null) => {
  return useQuery({
    queryKey: ["organizer-applications", id],
    queryFn: () => getOrganizerApplication(id as string),
    enabled: Boolean(id),
  });
};
