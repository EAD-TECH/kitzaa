import { uploadFiles } from "@/lib/uploadthing"
import { useAuthStore } from "@/features/auth/store/authStore"

// uploadRouter.socialImage (server/src/configs/uploadthing.ts) getUserFromRequest ile
// Authorization header'ından kullanıcıyı çözüyor — apiFetch'teki gibi Bearer token'ı
// burada da elle eklememiz gerekiyor, çünkü bu istek apiFetch üzerinden gitmiyor.
export const uploadPostImage = async (file: File) => {
  const uploaded = await uploadFiles("socialImage", {
    files: [file],
    input: {},
    headers: (): Record<string, string> => {
      const accessToken = useAuthStore.getState().accessToken
      return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    },
  })

  const url = uploaded[0]?.ufsUrl
  if (!url) {
    throw new Error("Upload did not return a file URL.")
  }

  return url
}
