import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { uploadProfileImage } from "../api/profileImageApi";
import type { AuthUser } from "@/features/auth/types/authTypes"

export const useUploadProfileImage = () => {
  const t = useTranslations("Profile");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfileImage,

    onSuccess: (url) => {
      queryClient.setQueryData<AuthUser | null>(["currentUser"], (oldUser) => {
        if (!oldUser) return oldUser;

        return {
          ...oldUser,
          avatar: url,
        };
      });

      toast.success(t("photoUpdated"));
    },

    onError: () => {
      toast.error(t("photoFailed"));
    },
  });
};
