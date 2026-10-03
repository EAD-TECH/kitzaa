import { mongoose } from "../configs/dbConnection.js";
import type {
  ConversationModel,
  IConversation,
} from "../types/conversation.types.js";

const conversationSchema = new mongoose.Schema<
  IConversation,
  ConversationModel
>(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "active", "closed"],
      default: "pending",
    },
    roomtype: {
      type: String,
      enum: ["direct", "support"],
      default: "direct",
    },

    isAgentActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IConversation, ConversationModel>(
  "Conversation",
  conversationSchema,
);
