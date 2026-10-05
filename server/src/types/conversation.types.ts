import type { Types, Model, HydratedDocument } from "mongoose";

export const CONVERSATION_STATUSES = ["pending", "active", "closed"] as const;
export const CONVERSATION_TYPES = ["direct", "support"] as const;
export type ConversationStatus = (typeof CONVERSATION_STATUSES)[number];
export type ConversationRoomTypes = (typeof CONVERSATION_TYPES)[number];

export interface IConversation {
  _id?: Types.ObjectId;
  participants: Types.ObjectId[];
  status: ConversationStatus;
  roomtype: ConversationRoomTypes;
  isAgentActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ConversationModel = Model<IConversation>;
export type ConversationDocument = HydratedDocument<IConversation>;

export interface ConversationDTO {
  _id: string;
  participants: string[];
  status: ConversationStatus;
  roomtype: ConversationRoomTypes;
  createdAt: Date;
  updatedAt: Date;
}
