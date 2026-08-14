import type { LoginFormValues } from "../validations/login.schema";

export interface AuthUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  role: "user" | "organizer" | "admin";
  language: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  error: false;
  accessToken: string;
  user: AuthUser;
}

// backend'e ne gönderiyoruz: zod'dan gelen tip, tekrar yazmıyoruz
export type LoginPayload = LoginFormValues;

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  setSession: (session: { accessToken: string; user: AuthUser }) => void;
  clearSession: () => void;
}