import { mongoose } from "../configs/dbConnection.js";
import type { IMessage, MessageModel } from "../types/messages.types.js";

const messageSchema = new mongoose.Schema<IMessage, MessageModel>(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderType: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IMessage, MessageModel>("Message", messageSchema);
