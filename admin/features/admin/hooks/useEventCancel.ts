import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelAdminEvent, rejectOrganizerApplication } from "../api";
import { CancelEventBody, RejectEventBody } from "../types";

export const useEventCancel = () => {
  /* santıye sefımın telsı */
  const queryClient = useQueryClient();
  /* kamyon hem ID hem de ret sebebi (body) taşıyor bu kısımda */
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CancelEventBody }) =>
      cancelAdminEvent(id, body),
    onSuccess: () => {
      // Telsizle anons et: Tahtayı yenile!
      queryClient.invalidateQueries({ queryKey: ["event-applications"] });
    },
  });
};
