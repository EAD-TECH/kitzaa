import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { uploadPostImage } from "../api/postImageApi"

export const useUploadPostImage = () => {
  const t = useTranslations("Social")

  return useMutation({
    mutationFn: uploadPostImage,
    onError: () => {
      toast.error(t("imageUploadFailed"))
    },
  })
}
