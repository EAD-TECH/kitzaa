import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminUser, deleteAdminUser, updateAdminUser } from "../api/getUsers";
import { CreateUserDTO, UpdateUserDTO } from "../types/users.types";

export const useDeleteUser = () => {
  /* santıye sefımın telsı */
  const queryClient = useQueryClient();

  return useMutation({
    /* kamyonum id yı aldı sırtladı backende suruyor  */
    mutationFn: (id:string) => deleteAdminUser(id),

    /* yolda kaza yapmazsa */
    onSuccess: () => {
      /* tlsize anons gec lısteyı yenılemen lazım */
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
