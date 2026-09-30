import type { AuthUser } from "@/features/auth/types/authTypes";
import type { UpdatePersonalInfoValues } from "../validations/updatePersonalInfo.schema";

export type UpdatePersonalInfoPayload = UpdatePersonalInfoValues;

export interface UpdatePersonalInfoResponse {
  error: false;
  user: AuthUser;
}
