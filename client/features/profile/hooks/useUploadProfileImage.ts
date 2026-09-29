import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadProfileImage } from "../api/profileImageApi";
import type { AuthUser } from "@/features/auth/types/authTypes"

export const useUploadProfileImage = () => {
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

      toast.success("Profilbild wurde aktualisiert.");
    },

    onError: () => {
      toast.error("Profilbild konnte nicht hochgeladen werden. Bitte versuche es erneut.");
    },
  });
};
