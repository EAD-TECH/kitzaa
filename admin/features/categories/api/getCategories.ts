import { apiFetch } from "@/lib/api/client";
import {
  CreateCategoryDTO,
  CreateCategoryResponse,
  ListCategoriesResponse,
  UpdateCategoryDTO,
  UpdateCategoryResponse,
} from "../types/categories";

const BASE = "/api/v1/admin/categories";

export async function listAdminCategories(): Promise<ListCategoriesResponse> {
  return apiFetch<ListCategoriesResponse>(`${BASE}?sort[createdAt]=-1`, {
    method: "GET",
  });
}

export async function createAadminCategories(
  payload: CreateCategoryDTO,
): Promise<CreateCategoryResponse> {
  return apiFetch<CreateCategoryResponse>(BASE, {
    method: "POST",
    body: payload,
  });
}

export async function deleteAdminCategory(id: string): Promise<void> {
  return apiFetch(`${BASE}/${id}`, {
    method: "DELETE",
  });
}

export async function updateAdminCategory(
  payload: UpdateCategoryDTO,
): Promise<UpdateCategoryResponse> {
  const { _id, ...body } = payload;

  return apiFetch<UpdateCategoryResponse>(`${BASE}/${_id}`, {
    method: "PUT",
    body,
  });
}

export async function getCategoryById(id: string): Promise<UpdateCategoryResponse> {
  return apiFetch<UpdateCategoryResponse>(`${BASE}/${id}`, {
    method: "GET",
  });
}
