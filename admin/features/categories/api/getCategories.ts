import { apiFetch } from "@/lib/api/client";
import {
  CreateCategoryDTO,
  CreateCategoryResponse,
  ListCategoriesResponse,
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
