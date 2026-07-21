import type { Types, Model, HydratedDocument } from "mongoose";


// as const ile yazdigimizda TypeScript tipi: readonly ['pending', 'approved'] yani readOnly tuple olarak algiliyor
export const APPLICATION_STATUSES = ['pending','under_review','approved','rejected','needs_more_info'] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const REVIEWER_TYPES = ['admin','ai','system'] as const;
export type ReviewerType = (typeof REVIEWER_TYPES)[number];

//Basvuru sürecinde kurum bilgisini tutacagimiz datanin interface'ini olusturuyoruz
export interface IInstitutionData {
  name: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  category?: string | null;
}

export interface IStatusHistory {
  status: ApplicationStatus;
  changedBy?: Types.ObjectId | null;
  changedAt: Date;
  note?: string | null;
}

export interface IOrganizerApplication {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;              // ref User
  institutionData: IInstitutionData;
  message?: string | null;
  status: ApplicationStatus;
  reviewedBy?: Types.ObjectId | null;  // kararı veren admin
  reviewerType?: ReviewerType | null;  // AI-ready
  rejectedReason?: string | null;
  reviewedAt?: Date | null;
  statusHistory: IStatusHistory[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrganizerApplicationModel = Model<IOrganizerApplication>;
export type OrganizerApplicationDocument = HydratedDocument<IOrganizerApplication>;