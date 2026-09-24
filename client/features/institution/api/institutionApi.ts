import { apiFetch } from "@/lib/api/client";
import type {
  UpdateInstitutionPayload,
  GetMyInstitutionResponse,
  UpdateInstitutionResponse,
} from "../types/institution.types";
import type { InstitutionFormValues } from "../validations/institution.schema";

export async function getMyInstitution() {
  return apiFetch<GetMyInstitutionResponse>("/api/v1/institutions/me");
}

export async function updateMyInstitution(payload: UpdateInstitutionPayload) {
  return apiFetch<UpdateInstitutionResponse>("/api/v1/institutions/me", {
    method: "PUT",
    body: payload,
  });
}
