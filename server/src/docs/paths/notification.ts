/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Lists notifications for the logged-in user
 *     description: |
 *       Returns the current user's notifications (`recipientId = req.user`).
 *       Use `isRead=false` for unread only.
 *       Supports queryHandler: `page`, `limit`, `sort`, `filter`, `search`.
 *
 *       **Examples:**
 *       - `?isRead=false`
 *       - `?page=1&limit=10`
 *       - `?sort[createdAt]=-1`
 *     tags: [Notifications]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: isRead
 *         type: string
 *         description: Set to "false" for unread only
 *       - in: query
 *         name: page
 *         type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         type: integer
 *         example: 10
 *       - in: query
 *         name: sort
 *         type: string
 *         description: "Example: sort[createdAt]=-1"
 *       - in: query
 *         name: filter
 *         type: string
 *       - in: query
 *         name: search
 *         type: string
 *     responses:
 *       200:
 *         description: Notification list
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             details:  { type: object }
 *             result:
 *               type: array
 *               items: { $ref: '#/definitions/Notification' }
 *       401:
 *         description: Unauthorized
 *
 * /notifications/unread-count:
 *   get:
 *     summary: Returns unread notification count
 *     tags: [Notifications]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Unread count
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             data:
 *               type: object
 *               properties:
 *                 count: { type: integer, example: 3 }
 *       401:
 *         description: Unauthorized
 *
 * /notifications/mark-all-read:
 *   patch:
 *     summary: Marks all unread notifications as read
 *     tags: [Notifications]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: All unread notifications marked as read
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             message: { type: string, example: "All Notifications are read successfully" }
 *             data:
 *               type: integer
 *               example: 5
 *               description: "Number of documents modified (modifiedCount)"
 *       401:
 *         description: Unauthorized
 *
 * /notifications/{id}:
 *   patch:
 *     summary: Marks a single notification as read
 *     tags: [Notifications]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Notification ObjectId
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             message: { type: string, example: "Notification is read successfully" }
 *             result: { $ref: '#/definitions/Notification' }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found (or not owned by the user)
 *
 * /admin/notifications:
 *   get:
 *     summary: Admin notification queue
 *     description: |
 *       Admin-only queue filtered to types `organizer_application` and `event_review`.
 *       Supports `isRead=false` and queryHandler pagination/sort/filter/search.
 *     tags: [Admin - Notifications]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: isRead
 *         type: string
 *         description: Set to "false" for unread only
 *       - in: query
 *         name: page
 *         type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         type: integer
 *         example: 10
 *       - in: query
 *         name: sort
 *         type: string
 *       - in: query
 *         name: filter
 *         type: string
 *       - in: query
 *         name: search
 *         type: string
 *     responses:
 *       200:
 *         description: Admin notification queue
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             details: { type: object }
 *             notifications:
 *               type: array
 *               items: { $ref: '#/definitions/AdminNotification' }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
export {};
