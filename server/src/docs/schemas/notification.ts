/**
 * @swagger
 * definitions:
 *   NotificationType:
 *     type: string
 *     enum:
 *       - post_like
 *       - post_comment
 *       - new_event
 *       - event_reminder
 *       - event_cancelled
 *       - post_reply
 *       - nearby_event
 *       - organizer_approved
 *       - organizer_application
 *       - event_review
 *       - organizer_prep_summary
 *       - system
 *     example: "post_comment"
 *
 *   NotificationSender:
 *     type: object
 *     nullable: true
 *     properties:
 *       username: { type: string }
 *       email: { type: string }
 *       avatarUrl: { type: string }
 *
 *   NotificationEventSummary:
 *     type: object
 *     nullable: true
 *     properties:
 *       name: { type: string }
 *       category: { type: string }
 *       date: { type: string, format: date-time }
 *
 *   Notification:
 *     type: object
 *     description: User-facing notification DTO (toNotificationDTO)
 *     properties:
 *       _id: { type: string }
 *       type: { $ref: '#/definitions/NotificationType' }
 *       title: { type: string }
 *       message: { type: string }
 *       isRead: { type: boolean, example: false }
 *       relatedId: { type: string, nullable: true }
 *       linkNotification: { type: string, nullable: true }
 *       createdAt: { type: string, format: date-time }
 *       updatedAt: { type: string, format: date-time }
 *       sender: { $ref: '#/definitions/NotificationSender' }
 *       eventSummary: { $ref: '#/definitions/NotificationEventSummary' }
 *
 *   AdminNotification:
 *     type: object
 *     description: Admin queue DTO (toAdminNotificationDTO)
 *     properties:
 *       _id: { type: string }
 *       type: { $ref: '#/definitions/NotificationType' }
 *       title: { type: string }
 *       message: { type: string }
 *       isRead: { type: boolean, example: false }
 *       relatedId: { type: string, nullable: true }
 *       linkNotification: { type: string, nullable: true }
 *       recipientId: { type: string }
 *       createdAt: { type: string, format: date-time }
 *       updatedAt: { type: string, format: date-time }
 *       sender: { $ref: '#/definitions/NotificationSender' }
 *       eventSummary: { $ref: '#/definitions/NotificationEventSummary' }
 *
 */
export {};
