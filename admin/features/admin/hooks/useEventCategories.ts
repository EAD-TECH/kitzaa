import { useQuery } from "@tanstack/react-query";
import { getEventCategories } from "../api/events";

interface useOEventCategoriesParams {
  secilenKategori: string | undefined;
  limit?: number;
}

export const useEventCategories = () => {
  return useQuery({
    queryKey: ["event-categories"],
    queryFn: () => getEventCategories(),
  });
};
