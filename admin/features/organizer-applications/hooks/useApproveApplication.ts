import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveOrganizerApplication } from "../api";

export const useApproveApplication = () => {
  /* santıye sefımın telsı */
  const queryClient = useQueryClient();

  return useMutation({
    /* kamyonum id yı aldı sırtladı backende suruyor  */
    mutationFn: (id: string) => approveOrganizerApplication(id),

    /* yolda kaza yapmazsa */
    onSuccess: () => {
      /* tlsize anons gec lısteyı yenılemen lazım */
      queryClient.invalidateQueries({ queryKey: ["organizer-applications"] });
    },
  });
};
