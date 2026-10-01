import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "../api/getCategories";

export const useGetCategoryById = (id: string | null) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategoryById(id!),
    enabled: Boolean(id) /* id vvrasa calısck */,
  });
};
