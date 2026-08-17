import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { resetPassword } from "../api";
import type { ResetPasswordValues } from "../validations/resetpassword.schema";

export function useResetPassword(token: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: (values: ResetPasswordValues) => resetPassword(token, values),
    onSuccess: () => {
      router.push("/login");
    },
  });
}

export function mapResetPasswordError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return "Der Link ist ungültig oder abgelaufen.";
    }
    if (error.status === 0 || error.status >= 500) {
      return "Das Passwort konnte nicht gespeichert werden. Bitte versuche es später erneut.";
    }
    return "Das Passwort konnte nicht gespeichert werden. Bitte versuche es später erneut.";
  }
  return "Der Server konnte nicht erreicht werden. Bitte überprüfe deine Verbindung.";
}
