import { useAuthStore } from "@/features/auth/store/authStore";
import { flattenPages, getNextPageParam } from "@/lib/api/pagination";
import { useInfiniteQuery } from "@tanstack/react-query";
import { listNotifications } from "../api";

export const useNotifications = () => {
  const isReady = useAuthStore((state) => state.isReady);
  const accessToken = useAuthStore((state) => state.accessToken);

  const query = useInfiniteQuery({
    queryKey: ["notifications", "list"],
    queryFn: ({ pageParam }) => listNotifications({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: isReady && !!accessToken,
  });

  return {
    ...query,
    notifications: flattenPages(query.data?.pages, (page) => page.result),
  };
};
