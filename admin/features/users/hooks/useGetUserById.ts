import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/getUsers";

export const useGetUserById = (id: string | null) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id!),
    enabled: Boolean(id), /* id vvrasa calısck */
  });
};