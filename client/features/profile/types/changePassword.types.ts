import type { ChangePasswordValues } from "../validations/changePassword.schema";

export type ChangePasswordPayload = ChangePasswordValues;

export interface ChangePasswordResponse {
  error: false;
  message: string;
}
