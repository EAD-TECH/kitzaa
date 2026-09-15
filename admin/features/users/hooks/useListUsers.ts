import { useQuery } from "@tanstack/react-query";

/* api kuryemı cagırdm */
import { listAdminUsers } from "../api/getUsers";

export const useListUsers = () => {
  return useQuery({
    queryKey: ["users"] /* kargo etiketi */,
    queryFn: listAdminUsers /* kurye fonksiyonu */,
  });
};
