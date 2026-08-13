import { api } from "@/lib/api/client";
import type { LoginPayload, LoginResponse } from "./types/authTypes";

export async function login(payload: LoginPayload): Promise<LoginResponse>{
    const { data } = await api.post<LoginResponse>("/api/v1/auth/login", payload);
    return data;
}
