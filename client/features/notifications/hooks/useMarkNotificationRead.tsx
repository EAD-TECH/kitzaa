import { useAuthStore } from "@/features/auth/store/authStore";
import {  QueryClient, useMutation} from "@tanstack/react-query";
import { markNotificationAsRead } from "../api";


const queryClient = new QueryClient()

export const useMarkNotificationRead = () => {
  const isReady = useAuthStore((state) => state.isReady);
  const accessToken = useAuthStore((state) => state.accessToken);

  /* console.log("hazırmı",isReady)
  console.log("token varmı",accessToken) */

  /* burda bir mutaion ıslemı oldugu ıcın get den farklı olarak burda datayı mutade edecegım ısın useMutade kullanıyorm */
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),

    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
