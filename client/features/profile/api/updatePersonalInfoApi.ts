import { apiFetch } from "@/lib/api/client";
import { UpdatePersonalInfoPayload, UpdatePersonalInfoResponse } from "../types/updatePersonalInfo.types";

export async function updatePersonalInfo(userId: string,payload: UpdatePersonalInfoPayload): Promise<UpdatePersonalInfoResponse> {
  return apiFetch<UpdatePersonalInfoResponse>( `/api/v1/users/${userId}`, {
    method: "PUT",
    body: payload,
  });
}

