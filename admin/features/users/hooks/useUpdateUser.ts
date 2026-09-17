import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminUser } from "../api/getUsers";
import {  UpdateUserDTO } from "../types/users.types";

export const useUpdateUser = () => {
  /* santıye sefımın telsı */
  const queryClient = useQueryClient();

  return useMutation({
    /* kamyonum id yı aldı sırtladı backende suruyor  */
    mutationFn: (payload:UpdateUserDTO) => updateAdminUser(payload),

    /* yolda kaza yapmazsa */
    onSuccess: () => {
      /* tlsize anons gec lısteyı yenılemen lazım */
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
