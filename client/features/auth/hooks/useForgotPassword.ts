import React from 'react'
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/client";
import { forgotPassword } from "../AuthApi";
import type { ForgotPasswordValues } from "../validations/forgotpassword.schema";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (values: ForgotPasswordValues) => forgotPassword(values),
  });
}


export function mapForgotPasswordError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0 || error.status >= 500) {
      return "Der Link konnte nicht gesendet werden. Bitte versuche es später erneut.";
    }
    return "Der Link konnte nicht gesendet werden. Bitte versuche es später erneut.";
  }
  return "Der Server konnte nicht erreicht werden. Bitte überprüfe deine Verbindung.";
}

