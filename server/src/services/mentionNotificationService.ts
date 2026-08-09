import type { Types } from "mongoose";
import { createNotification } from "../helpers/createNotification.js";

interface mentionedPayload {
  mentionedUserIds?: Types.ObjectId[] | string[];
  senderId: Types.ObjectId;
  senderName?: string;
  relatedId: Types.ObjectId;
  relatedModel: "Post" | "PostComment";
  linkNotification: string;
}

export const triggerMentionNotifications = async (
  payload: mentionedPayload,
) => {
  const {
    mentionedUserIds,
    senderId,
    relatedId,
    relatedModel,
    linkNotification,
    senderName,
  } = payload;

  if (!mentionedUserIds || mentionedUserIds.length === 0) return;

  const uniqueIds = [
    ...new Set(mentionedUserIds.map((id) => id.toString())),
  ].filter((id) => id !== senderId.toString());

  uniqueIds.forEach((id) => {
    createNotification(id as unknown as Types.ObjectId, "post_mention", {
      title: "Seni etiketlediler",
      message: `${senderName || "Birisi"} bir yorumda senden bahsetti.`,
      senderId,
      relatedId,
      relatedModel,
      linkNotification,
    });
  });
};
