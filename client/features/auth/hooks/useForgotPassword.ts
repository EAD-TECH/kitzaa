import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/client";
import { forgotPassword } from "../api";
import type { ForgotPasswordValues } from "../validations/forgotpassword.schema";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (values: ForgotPasswordValues) => forgotPassword(values),
  });
}

export function mapForgotPasswordError(
  error: unknown,
  t: (key: string) => string,
): string {
  if (error instanceof ApiError) {
    return t("errors.sendFailed");
  }
  return t("errors.network");
}
