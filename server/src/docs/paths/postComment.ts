/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Lists post comments (excludes soft-deleted, flat list)
 *     description: |
 *       Returns a flat list. Use `parentCommentId` on the client to build a 2-level thread.
 *
 *       `filter[]`, `search[]`, `sort[]`, `page` and `limit` query parameters are supported.
 *
 *       **Examples:**
 *       - `?filter[postId]=64f1c2b8e1a2c3d4e5f6a7b8`
 *       - `?sort[createdAt]=1`
 *       - `?page=1&limit=20`
 *     tags: [Comments]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: filter
 *         type: string
 *       - in: query
 *         name: search
 *         type: string
 *       - in: query
 *         name: sort
 *         type: string
 *       - in: query
 *         name: page
 *         type: integer
 *       - in: query
 *         name: limit
 *         type: integer
 *     responses:
 *       200:
 *         description: Comment list
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             details: { type: object }
 *             comments:
 *               type: array
 *               items: { $ref: '#/definitions/PostComment' }
 *   post:
 *     summary: Creates a top-level comment or a reply (2-level thread)
 *     description: |
 *       - Omit `parentCommentId` (or send null) for a top-level comment.
 *       - Set `parentCommentId` to a **top-level** comment id to reply.
 *       - Replying to a reply returns 400 (`Cannot reply to a reply`).
 *       - Parent must belong to the same `postId`.
 *     tags: [Comments]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema: { $ref: '#/definitions/CreatePostCommentInput' }
 *     responses:
 *       201:
 *         description: Created comment
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             comment: { $ref: '#/definitions/PostComment' }
 *       400:
 *         description: Parent does not belong to this post, or reply-to-reply attempted
 *       404:
 *         description: Post or parent comment not found
 *
 * /comments/{id}:
 *   put:
 *     summary: Updates a comment (owner or admin only)
 *     tags: [Comments]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         required: true
 *         schema: { $ref: '#/definitions/UpdatePostCommentInput' }
 *     responses:
 *       200:
 *         description: Updated comment
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             comment: { $ref: '#/definitions/PostComment' }
 *       403:
 *         description: Not the owner and not an admin
 *       404:
 *         description: Comment not found (or soft-deleted)
 *   delete:
 *     summary: Soft-deletes a comment (owner or admin only)
 *     description: Decrements the parent post's `commentsCount` by 1 when successful.
 *     tags: [Comments]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Comment soft-deleted
 *       403:
 *         description: Not the owner and not an admin
 *       404:
 *         description: Comment not found (or already soft-deleted)
 *
 * /comments/{id}/like:
 *   post:
 *     summary: Likes the comment / removes the like (toggle)
 *     tags: [Comments]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Updated like status
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             liked: { type: boolean }
 *             comment: { $ref: '#/definitions/PostComment' }
 *       404:
 *         description: Comment not found (or soft-deleted)
 */
export {};
