import { useAuthStore } from "@/features/auth/store/authStore";
import { ApiError } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import { getUnreadNotificationCount } from "../api";

export const useUnreadCount = () => {
  const isReady = useAuthStore((state) => state.isReady);
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
    enabled: isReady && !!accessToken,

    // Socket events update the badge immediately; polling repairs missed events.
    refetchInterval: 30000,

    retry: (failureCount, error) => {
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      ) {
        return false; /* deneme  */
      }
      return failureCount < 3; /* bu satıra geldıysen 3 kereye kadar dene */
    },
  });
};
