import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCategoryDTO } from "../types/categories";
import { updateAdminCategory } from "../api/getCategories";


export const useUpdateCategory = () => {
  /* santıye sefımın telsı */
  const queryClient = useQueryClient();

  return useMutation({
    /* kamyonum id yı aldı sırtladı backende suruyor  */
    mutationFn: (payload:UpdateCategoryDTO) => updateAdminCategory(payload),

    /* yolda kaza yapmazsa */
    onSuccess: () => {
      /* tlsize anons gec lısteyı yenılemen lazım */
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
