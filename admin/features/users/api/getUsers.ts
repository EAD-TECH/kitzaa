import { apiFetch } from "@/lib/api/client";
import {
  CreateUserDTO,
  CreateUsersResponse,
  ListAdminUsersResponse,
  UpdateUserDTO,
  UpdateUserResponse,
} from "../types/users.types";

const BASE = "/api/v1/admin/users";

export async function listAdminUsers(): Promise<ListAdminUsersResponse> {
  return apiFetch<ListAdminUsersResponse>(`${BASE}?sort[createdAt]=-1`, {
    method: "GET",
  });
}

export async function createAdminUser(
  payload: CreateUserDTO,
): Promise<CreateUsersResponse> {
  return apiFetch<CreateUsersResponse>(BASE, {
    method: "POST",
    body: payload,
  });
}
export async function updateAdminUser(
  payload: UpdateUserDTO,
): Promise<UpdateUserResponse> {
  const { _id, ...body } = payload;

  return apiFetch<UpdateUserResponse>(`${BASE}/${_id}`, {
    method: "PUT",
    body,
  });
}
export async function getUserById(id: string): Promise<UpdateUserResponse> {
  return apiFetch<UpdateUserResponse>(`${BASE}/${id}`, {
    method: "GET",
  });
}
export async function deleteAdminUser(id: string): Promise<void> {
  return apiFetch(`${BASE}/${id}`, {
    method: "DELETE",
  });
}
