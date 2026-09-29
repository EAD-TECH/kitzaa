import { uploadFiles } from "@/lib/uploadthing"
import { useAuthStore } from "@/features/auth/store/authStore"

export const uploadProfileImage = async (file: File) => {
  const uploaded = await uploadFiles("profileImage", {
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
