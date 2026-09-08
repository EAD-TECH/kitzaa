import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { uploadEventImages } from "../api/eventImageApi"

export const useUploadEventImages = () => {
  return useMutation({
    mutationFn: uploadEventImages,
    onError: () => {
      toast.error("Bilder konnten nicht hochgeladen werden. Bitte versuche es erneut.")
    },
  })
}
