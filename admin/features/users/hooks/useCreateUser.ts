import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminUser } from "../api/getUsers";
import { CreateUserDTO } from "../types/users.types";

export const useCreateUser = () => {
  /* santıye sefımın telsı */
  const queryClient = useQueryClient();

  return useMutation({
    /* kamyonum id yı aldı sırtladı backende suruyor  */
    mutationFn: (payload: CreateUserDTO) => createAdminUser(payload),

    /* yolda kaza yapmazsa */
    onSuccess: () => {
      /* tlsize anons gec lısteyı yenılemen lazım */
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
