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
  savedEvents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  error: false;
  accessToken: string;
  user: AuthUser;
}

export type LoginPayload = LoginFormValues;

export interface AuthTokenState {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  isReady: boolean;
  setIsReady: (value: boolean) => void;
}

export interface RegisterResponse {
  error: false;
  message: string;
}

export interface ForgotPasswordResponse{
  message: string;
}

export interface ResetPasswordResponse{
  message: string;
}



