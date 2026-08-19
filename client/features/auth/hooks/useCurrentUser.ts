import { useQuery } from "@tanstack/react-query"
import type { AuthUser } from "../types/authTypes"

export const useCurrentUser = () => {

    return useQuery<AuthUser | null>({
        queryKey: ["currentUser"],
        queryFn: () => null, // hiç çağrılmamalı — veri login/register/refresh'in onSuccess'inde setQueryData ile yazılıyor
        enabled: false, //  Yani component mount olduğunda normalde React Query kendiliğinden queryFn'i çağırıp veri çeker; burada bu davranış tamamen kapatılmış.
        staleTime: Infinity, // Veri asla "bayat" (stale) sayılmasın, yani React Query arka planda otomatik refetch tetiklemesin (pencereye focus olunca, yeniden mount olunca vs.).
        initialData: null, // Cache'de henüz veri yokken dönecek başlangıç değeri.
    })

}
