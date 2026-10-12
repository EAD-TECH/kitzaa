import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/changePasswordApi";
import type { ChangePasswordPayload } from "../types/changePassword.types";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";

const CHANGE_PASSWORD_ERROR_KEYS: Record<string, "currentPasswordWrong" | "userNotFound" | "invalidUserId"> = {
  "Current password is incorrect": "currentPasswordWrong",
  "User not found": "userNotFound",
  "Invalid id.": "invalidUserId",
};

export function useChangePassword(userId: string | undefined) {
  const t = useTranslations("Profile");
  return useMutation({
    mutationFn: (values: ChangePasswordPayload) => {
      if (!userId) {
        throw new Error("User id is missing");
      }
      return changePassword(userId, values);
    },
    onSuccess: () => {
        toast.success(t("passwordChanged"));
    },
    onError: (error) => {
      const errorKey = error instanceof ApiError ? CHANGE_PASSWORD_ERROR_KEYS[error.message] : undefined;
      const message = errorKey ? t(errorKey) : t("passwordChangeFailed");
      toast.error(message);
    },
  });
}
