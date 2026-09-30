import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategoryDTO } from "../types/categories";
import { createAadminCategories } from "../api/getCategories";


export const useCreateCategory = () => {
  /* santıye sefımın telsı */
  const queryClient = useQueryClient();

  return useMutation({
    /* kamyonum id yı aldı sırtladı backende suruyor  */
    mutationFn: (payload: CreateCategoryDTO) => createAadminCategories(payload),

    /* yolda kaza yapmazsa */
    onSuccess: () => {
      /* tlsize anons gec lısteyı yenılemen lazım */
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
