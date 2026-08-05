/**
 * @swagger
 * /events:
 *   get:
 *     summary: Lists approved events
 *     description: |
 *       `filter[]`, `search[]`, `sort[]`, `page` and `limit` query parameters are supported.
 *
 *       **Examples:**
 *       - `?filter[categoryId]=64f1c2b8e1a2c3d4e5f6a7b8`
 *       - `?search[title]=kinderfest`
 *       - `?sort[createdAt]=-1`
 *       - `?page=2&limit=10`
 *     tags: [Events]
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
 *         description: Event list
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             details: { type: object }
 *             events:
 *               type: array
 *               items: { $ref: '#/definitions/Event' }
 *   post:
 *     summary: Creates a new event (starts with status 'pending', awaits admin approval)
 *     tags: [Events]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema: { $ref: '#/definitions/CreateEventInput' }
 *     responses:
 *       201:
 *         description: Created event
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             event: { $ref: '#/definitions/Event' }
 *       403:
 *         description: Organizer role required to create paid events
 *
 * /events/my-events:
 *   get:
 *     summary: Lists events created by the logged-in user
 *     description: |
 *       `filter[]`, `search[]`, `sort[]`, `page` and `limit` query parameters are supported.
 *
 *       **Examples:**
 *       - `?filter[status]=pending`
 *       - `?sort[createdAt]=-1`
 *       - `?page=2&limit=10`
 *     tags: [Events]
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
 *         description: Event list
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             details: { type: object }
 *             events:
 *               type: array
 *               items: { $ref: '#/definitions/Event' }
 *
 * /events/my-participations:
 *   get:
 *     summary: Lists events the logged-in user has joined
 *     description: |
 *       `filter[]`, `search[]`, `sort[]`, `page` and `limit` query parameters are supported.
 *
 *       **Examples:**
 *       - `?sort[createdAt]=-1`
 *       - `?page=2&limit=10`
 *     tags: [Events]
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
 *         description: Event list
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             details: { type: object }
 *             events:
 *               type: array
 *               items: { $ref: '#/definitions/Event' }
 *
 * /events/{slug}:
 *   get:
 *     summary: Returns a single event by slug (increments viewCount by 1)
 *     tags: [Events]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Event detail
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             event: { $ref: '#/definitions/Event' }
 *       404:
 *         description: Event not found
 *
 * /events/{id}:
 *   put:
 *     summary: Updates an event (owner or admin only)
 *     description: Same fields as CreateEventInput, all optional (partial update).
 *     tags: [Events]
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
 *         schema: { $ref: '#/definitions/UpdateEventInput' }
 *     responses:
 *       200:
 *         description: Updated event
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             event: { $ref: '#/definitions/Event' }
 *   delete:
 *     summary: Cancels an event (owner or admin only, status becomes 'cancelled')
 *     tags: [Events]
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
 *         schema: { $ref: '#/definitions/CancelEventInput' }
 *     responses:
 *       204:
 *         description: Event cancelled
 *
 * /events/{id}/participants:
 *   get:
 *     summary: Lists an event's participants (owner or admin only)
 *     tags: [Events]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Participant list
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             participants:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId: { type: string }
 *                   status: { type: string, enum: [confirmed, cancelled] }
 *                   joinedAt: { type: string, format: date-time }
 *
 * /events/{id}/join:
 *   post:
 *     summary: The logged-in user joins the event
 *     tags: [Events]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Joined successfully
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             event: { $ref: '#/definitions/Event' }
 *       409:
 *         description: Event is full or already joined
 *
 * /events/{id}/leave:
 *   post:
 *     summary: The logged-in user leaves the event
 *     tags: [Events]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Left successfully
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             event: { $ref: '#/definitions/Event' }
 *       400:
 *         description: User has not joined this event
 *
 * /events/{id}/like:
 *   post:
 *     summary: Likes the event / removes the like (toggle)
 *     tags: [Events]
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
 *             event: { $ref: '#/definitions/Event' }
 *
 * /admin/events:
 *   get:
 *     summary: (Admin) Lists all events regardless of status
 *     description: |
 *       `filter[]`, `search[]`, `sort[]`, `page` and `limit` query parameters are supported.
 *
 *       **Examples:**
 *       - `?filter[status]=pending`
 *       - `?search[title]=kinderfest`
 *       - `?sort[createdAt]=-1`
 *       - `?page=2&limit=10`
 *     tags: [Admin - Events]
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
 *         description: Event list
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             details: { type: object }
 *             events:
 *               type: array
 *               items: { $ref: '#/definitions/AdminEvent' }
 *
 * /admin/events/{id}:
 *   get:
 *     summary: (Admin) Returns a single event
 *     tags: [Admin - Events]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Event detail
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             event: { $ref: '#/definitions/AdminEvent' }
 *   delete:
 *     summary: (Admin) Permanently deletes an event
 *     tags: [Admin - Events]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Event deleted
 *
 * /admin/events/{id}/approve:
 *   put:
 *     summary: (Admin) Approves a pending event, emails the organizer
 *     tags: [Admin - Events]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Approved event
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             event: { $ref: '#/definitions/AdminEvent' }
 *
 * /admin/events/{id}/reject:
 *   put:
 *     summary: (Admin) Rejects a pending event, emails the organizer
 *     tags: [Admin - Events]
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
 *         schema: { $ref: '#/definitions/RejectEventInput' }
 *     responses:
 *       200:
 *         description: Rejected event
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             event: { $ref: '#/definitions/AdminEvent' }
 *
 * /admin/events/{id}/cancel:
 *   put:
 *     summary: (Admin) Cancels an approved event, emails the organizer
 *     tags: [Admin - Events]
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
 *         schema: { $ref: '#/definitions/CancelEventInput' }
 *     responses:
 *       200:
 *         description: Cancelled event
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             event: { $ref: '#/definitions/AdminEvent' }
 */
export {};
