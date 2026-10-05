import type { Types, Model, HydratedDocument } from "mongoose";

export const MESSAGE_SENDER_TYPES = ["user", "admin"] as const;
export type MessageSenderType = (typeof MESSAGE_SENDER_TYPES)[number];

export interface IMessage {
  _id?: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderType: MessageSenderType;
  senderId: Types.ObjectId;
  content: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 
export type MessageModel = Model<IMessage>;
export type MessageDocument = HydratedDocument<IMessage>;

export interface MessageDTO {
  _id: string;
  conversationId: string;
  senderType: MessageSenderType;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
