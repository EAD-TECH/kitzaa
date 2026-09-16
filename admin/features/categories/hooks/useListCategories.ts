'use client'
import { useQuery } from "@tanstack/react-query";
import { listAdminCategories } from "../api/getCategories";

/* api kuryemı cagırdm */

export const useListCategories = () => {
  return useQuery({
    queryKey: ["categories"] /* kargo etiketi */,
    queryFn: listAdminCategories /* kurye fonksiyonu */,
  });
};
