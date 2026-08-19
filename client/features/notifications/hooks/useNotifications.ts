import { useAuthStore } from "@/features/auth/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { listNotifications } from "../api";

export const useNotifications = () => {
  const isReady = useAuthStore((state) => state.isReady);
  const accessToken = useAuthStore((state) => state.accessToken);

  /* console.log("hazırmı",isReady)
  console.log("token varmı",accessToken) */

  return useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => listNotifications(),
    enabled: isReady && !!accessToken,
  });
};
