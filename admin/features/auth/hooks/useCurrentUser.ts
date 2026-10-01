import { useQuery } from "@tanstack/react-query";
import type { AuthUser } from "../types/authTypes";

export const useCurrentUser = () => {
  return useQuery<AuthUser | null>({
    queryKey: ["currentUser"],
    queryFn: () => null,
    enabled: false,
    staleTime: Infinity,
    initialData: null,
  });
};
