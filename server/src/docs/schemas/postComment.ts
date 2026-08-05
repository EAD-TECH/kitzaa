/**
 * @swagger
 * definitions:
 *   PostComment:
 *     type: object
 *     description: |
 *       Flat list item. Frontend builds the thread tree using `parentCommentId`.
 *       `parentCommentId === null` means top-level; otherwise it is a reply to that comment.
 *     properties:
 *       _id: { type: string }
 *       postId: { type: string }
 *       author: { $ref: '#/definitions/PostAuthorSummary' }
 *       text: { type: string }
 *       likesCount: { type: integer, example: 0 }
 *       isLikedByMe: { type: boolean, example: false }
 *       parentCommentId: { type: string, nullable: true }
 *       createdAt: { type: string, format: date-time }
 *       updatedAt: { type: string, format: date-time }
 *
 *   CreatePostCommentInput:
 *     type: object
 *     required: [postId, text]
 *     properties:
 *       postId: { type: string, description: "Target post ObjectId" }
 *       text: { type: string, maxLength: 1000, example: "Great post, thanks for sharing!" }
 *       parentCommentId:
 *         type: string
 *         nullable: true
 *         description: |
 *           Omit or null for a top-level comment.
 *           Set to a top-level comment id to reply (2-level thread only; reply-to-reply is rejected).
 *
 *   UpdatePostCommentInput:
 *     type: object
 *     properties:
 *       text: { type: string, maxLength: 1000, example: "Edited: Great post!" }
 */
export {};
