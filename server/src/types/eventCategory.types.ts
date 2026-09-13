
import type { Types, Model, HydratedDocument } from 'mongoose';

export interface IEventCategory {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type EventCategoryModel = Model<IEventCategory>;

export type EventCategoryDocument = HydratedDocument<IEventCategory>;

export interface EventCategoryDTO {
  _id: string;
  name: string;
  slug: string;
  description: string | null;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}