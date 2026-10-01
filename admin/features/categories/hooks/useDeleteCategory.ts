import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminCategory } from "../api/getCategories";

export const useDeleteCategory = () => {
  /* santıye sefımın telsı */
  const queryClient = useQueryClient();

  return useMutation({
    /* kamyonum id yı aldı sırtladı backende suruyor  */
    mutationFn: (id:string) => deleteAdminCategory(id),

    /* yolda kaza yapmazsa */
    onSuccess: () => {
      /* tlsize anons gec lısteyı yenılemen lazım */
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
