import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { uploadPostImage } from "../api/postImageApi"

export const useUploadPostImage = () => {
  return useMutation({
    mutationFn: uploadPostImage,
    onError: () => {
      toast.error("Bild konnte nicht hochgeladen werden. Bitte versuche es erneut.")
    },
  })
}
