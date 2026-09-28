import { apiFetch } from "@/lib/api/client";
import { ChangePasswordPayload, ChangePasswordResponse } from "../types/changePassword.types";

export async function changePassword(
  userId: string,
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResponse> {
  return apiFetch<ChangePasswordResponse>( `/api/v1/users/${userId}/password`, {
    method: "PUT",
    body: payload,
  });
}
