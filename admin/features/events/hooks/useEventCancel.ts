import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelAdminEvent } from "../api";
import { CancelEventBody } from "../types";

export const useEventCancel = () => {
  /* santıye sefımın telsı */
  const queryClient = useQueryClient();
  /* kamyon hem ID hem de ret sebebi (body) taşıyor bu kısımda */
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CancelEventBody }) =>
      cancelAdminEvent(id, body),
    onSuccess: (_, variables) => {
      // Telsizle anons et: Tahtayı yenile!
      queryClient.invalidateQueries({ queryKey: ["event-applications"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-event", variables.id],
      });
    },
  });
};
