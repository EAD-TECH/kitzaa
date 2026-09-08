import { uploadFiles } from "@/lib/uploadthing"
import { useAuthStore } from "@/features/auth/store/authStore"

// uploadRouter.eventImage (server/src/configs/uploadthing.ts) getUserFromRequest ile
// Authorization header'ından kullanıcıyı çözüyor — apiFetch'teki gibi Bearer token'ı
// burada da elle eklememiz gerekiyor, çünkü bu istek apiFetch üzerinden gitmiyor.
export const uploadEventImages = async (files: File[]) => {
  const uploaded = await uploadFiles("eventImage", {
    files,
    input: {},
    headers: (): Record<string, string> => {
      const accessToken = useAuthStore.getState().accessToken
      return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    },
  })

  return uploaded.map((file) => file.ufsUrl)
}
