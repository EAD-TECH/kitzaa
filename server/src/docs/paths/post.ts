/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lists social posts (excludes soft-deleted)
 *     description: |
 *       `filter[]`, `search[]`, `sort[]`, `page` and `limit` query parameters are supported.
 *
 *       **Examples:**
 *       - `?filter[authorId]=64f1c2b8e1a2c3d4e5f6a7b8`
 *       - `?filter[city]=Berlin`
 *       - `?search[text]=park`
 *       - `?sort[createdAt]=-1`
 *       - `?page=2&limit=10`
 *     tags: [Posts]
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
 *         description: Post list
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             details: { type: object }
 *             posts:
 *               type: array
 *               items: { $ref: '#/definitions/Post' }
 *   post:
 *     summary: Creates a new social post
 *     tags: [Posts]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema: { $ref: '#/definitions/CreatePostInput' }
 *     responses:
 *       201:
 *         description: Created post
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             post: { $ref: '#/definitions/Post' }
 *       404:
 *         description: eventId was provided but the event was not found
 *
 * /posts/{id}:
 *   get:
 *     summary: Returns a single post (increments viewCount by 1)
 *     tags: [Posts]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Post detail
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             post: { $ref: '#/definitions/Post' }
 *       404:
 *         description: Post not found (or soft-deleted)
 *   put:
 *     summary: Updates a post (owner or admin only)
 *     description: Same fields as CreatePostInput, all optional (partial update).
 *     tags: [Posts]
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
 *         schema: { $ref: '#/definitions/UpdatePostInput' }
 *     responses:
 *       200:
 *         description: Updated post
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             post: { $ref: '#/definitions/Post' }
 *       403:
 *         description: Not the owner and not an admin
 *       404:
 *         description: Post not found (or soft-deleted)
 *   delete:
 *     summary: Soft-deletes a post (owner or admin only)
 *     tags: [Posts]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Post soft-deleted
 *       403:
 *         description: Not the owner and not an admin
 *       404:
 *         description: Post not found (or already soft-deleted)
 *
 * /posts/{id}/like:
 *   post:
 *     summary: Likes the post / removes the like (toggle)
 *     tags: [Posts]
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
 *             post: { $ref: '#/definitions/Post' }
 *       404:
 *         description: Post not found (or soft-deleted)
 */
export {};
