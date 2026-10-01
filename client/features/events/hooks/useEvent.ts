import { useQuery } from "@tanstack/react-query"
import { getEventForEdit } from "../api/eventApi"

export const useEvent = (id?: string) => {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => getEventForEdit(id as string),
    enabled: !!id,
  })
}
