import { apiFetch } from "@/lib/api/client";
import { ListCategoriesResponse } from "../types/categories";

const BASE = "/api/v1/admin/categories";

export async function listAdminCategories(): Promise<ListCategoriesResponse> {
  return apiFetch<ListCategoriesResponse>(BASE, { method: "GET" });
}
