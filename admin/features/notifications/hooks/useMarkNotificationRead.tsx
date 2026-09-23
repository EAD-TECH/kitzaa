import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "../api/notification";


export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
