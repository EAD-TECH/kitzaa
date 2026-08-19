import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/client";
import { verifyEmail } from "../api";

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  });
}

export function mapVerifyEmailError(
  error: unknown,
  t: (key: string) => string,
): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return t("errors.expired");
    }
    return t("errors.failed");
  }
  return t("errors.network");
}
