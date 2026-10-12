import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { uploadEventImages } from "../api/eventImageApi"

export const useUploadEventImages = () => {
  const t = useTranslations("Events")

  return useMutation({
    mutationFn: uploadEventImages,
    onError: () => {
      toast.error(t("imagesUploadFailed"))
    },
  })
}
