import type { Types, Model, HydratedDocument } from "mongoose";

// Kurumun yasam durumu: aktif ya da askiya alinmis
export const INSTITUTION_STATUSES = ["active", "suspended"] as const;
export type InstitutionStatus = (typeof INSTITUTION_STATUSES)[number];

export interface IInstitution {
  _id?: Types.ObjectId;
  ownerId: Types.ObjectId;        // ref User — kurumun sahibi (basvuran)
  applicationId: Types.ObjectId;  // ref OrganizerApplication — hangi basvurudan olustu
  name: string;
  slug: string;                   // public URL icin: "kizilay-istanbul"
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  category?: string | null;
  logoUrl?: string | null;
  status: InstitutionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type InstitutionModel = Model<IInstitution>;
export type InstitutionDocument = HydratedDocument<IInstitution>;
