"use client";

import { useMutation } from "@tanstack/react-query";
import { setupAccount } from "../AuthApi";
import { SetupAccountPayload } from "../validations/setup-account.schema";

export const useSetupAccount = () => {
  return useMutation({
    mutationFn: ({
      token,
      payload,
    }: {
      token: string;
      payload: SetupAccountPayload;
    }) => setupAccount(token, payload),
  });
};
