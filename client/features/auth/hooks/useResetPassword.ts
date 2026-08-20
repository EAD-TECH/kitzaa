import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
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

export function mapResetPasswordError(
  error: unknown,
  t: (key: string) => string,
): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return t("errors.invalidLink");
    }
    return t("errors.saveFailed");
  }
  return t("errors.network");
}
