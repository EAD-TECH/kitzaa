import type {
  InstitutionDocument,
  InstitutionDTO,
} from "../types/institution.types.js";

export function toInstitutionDTO(institution: InstitutionDocument): InstitutionDTO;
export function toInstitutionDTO(institution: InstitutionDocument[]): InstitutionDTO[];
export function toInstitutionDTO(
  institution: InstitutionDocument | InstitutionDocument[] | null,
): InstitutionDTO | InstitutionDTO[] | null;

export function toInstitutionDTO(
  institution: InstitutionDocument | InstitutionDocument[] | null,
): InstitutionDTO | InstitutionDTO[] | null {
  if (!institution) return null;

  if (Array.isArray(institution)) {
    return institution.map((item) => toInstitutionDTO(item));
  }

  return {
    _id: institution._id.toString(),
    ownerId: institution.ownerId.toString(),
    applicationId: institution.applicationId.toString(),
    name: institution.name,
    slug: institution.slug,
    description: institution.description ?? null,
    address: institution.address ?? null,
    phone: institution.phone ?? null,
    website: institution.website ?? null,
    category: institution.category ?? null,
    logoUrl: institution.logoUrl ?? null,
    status: institution.status,
    createdAt: institution.createdAt!,
    updatedAt: institution.updatedAt!,
  };
}
