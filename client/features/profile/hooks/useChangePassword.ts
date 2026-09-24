import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/changePasswordApi";
import type { ChangePasswordPayload } from "../types/changePassword.types";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";

const CHANGE_PASSWORD_ERROR_MESSAGES: Record<string, string> = {
  "Current password is incorrect": "Das aktuelle Passwort ist falsch.",
  "User not found": "Benutzer wurde nicht gefunden.",
  "Invalid id.": "Ungültige Benutzer-ID.",
};

export function useChangePassword(userId: string | undefined) {
  return useMutation({
    mutationFn: (values: ChangePasswordPayload) => {
      if (!userId) {
        throw new Error("User id is missing");
      }
      return changePassword(userId, values);
    },
    onSuccess: () => {
        toast.success("Dein Passwort wurde geändert.");
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? (CHANGE_PASSWORD_ERROR_MESSAGES[error.message] ??
            "Passwort konnte nicht geändert werden. Bitte versuche es erneut.")
          : "Passwort konnte nicht geändert werden. Bitte versuche es erneut.";
      toast.error(message);
    },
  });
}
