import { useMutation, useQueryClient  } from "@tanstack/react-query";
import { rejectOrganizerApplication } from "../api";
import { RejectApplicationBody } from "../types";

export const useRejectApplication=()=>{
   /* santıye sefımın telsı */
  const queryClient = useQueryClient();
   /* kamyon hem ID hem de ret sebebi (body) taşıyor bu kısımda */
  return useMutation({
      mutationFn: ({ id, body }: { id: string; body: RejectApplicationBody }) => 
      rejectOrganizerApplication(id, body),
    onSuccess: () => {
      // Telsizle anons et: Tahtayı yenile!
      queryClient.invalidateQueries({ queryKey: ["organizer-applications"] });
    },
  })

}