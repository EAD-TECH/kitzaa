import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectAdminEvent } from "../api";
import { RejectEventBody } from "../types";

export const useEventReject = () => {
  /* santıye sefımın telsı */
  const queryClient = useQueryClient();
  /* kamyon hem ID hem de ret sebebi (body) taşıyor bu kısımda */
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: RejectEventBody }) =>
      rejectAdminEvent(id, body),
    onSuccess: (_, variables) => {
      // Telsizle anons et: Tahtayı yenile!
      queryClient.invalidateQueries({ queryKey: ["event-applications"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-event", variables.id],
      });
    },
  });
};
