import { apiFetch } from "@/lib/api/client";
import {
  CreateUserDTO,
  CreateUsersResponse,
  ListAdminUsersResponse,
  UpdateUserDTO,
  UpdateUserResponse,
} from "../types/users.types";

const BASE = "/api/v1/admin/users";

export async function listAdminUsers(
  page = 1,
  limit = 6,
): Promise<ListAdminUsersResponse> {
  const params = new URLSearchParams();
  params.append("sort[updatedAt]", "-1");
  params.append("page", String(page));
  params.append("limit", String(limit));

  return apiFetch<ListAdminUsersResponse>(`${BASE}?${params.toString()}`, {
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
