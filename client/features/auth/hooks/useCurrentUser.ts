import { useQuery } from "@tanstack/react-query"
import type { AuthUser } from "../types/authTypes"

export const useCurrentUser = () => {

    return useQuery<AuthUser | null>({
        queryKey: ["currentUser"],
        queryFn: () => null, // hiç çağrılmamalı — veri login/register/refresh'in onSuccess'inde setQueryData ile yazılıyor
        enabled: false,
        staleTime: Infinity,
        initialData: null,
    })

}
