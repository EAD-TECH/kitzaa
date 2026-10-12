import { apiFetch } from "@/lib/api/client";
import { GetDashboardSummaryResponse } from "../dashboard";


const BASE = "/api/v1/admin/dashboard";

export async function getDashboardSummary() {
  return apiFetch<GetDashboardSummaryResponse>(BASE, { method: "GET" });
}
