import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveAdminEvent} from "../api";


export const useApproveEvent = () => {
  /* santıye sefımın telsı */
  const queryClient = useQueryClient();

  return useMutation({
    /* kamyonum id yı aldı sırtladı backende suruyor  */
    mutationFn: (id: string) => approveAdminEvent(id),

    /* yolda kaza yapmazsa */
    onSuccess: (_,id) => {
      /* tlsize anons gec lısteyı yenılemen lazım */
      queryClient.invalidateQueries({ queryKey: ["event-applications"] });
      queryClient.invalidateQueries({queryKey:["admin-event",id]})
    },
  });
};
