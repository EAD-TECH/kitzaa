/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lists users (admin sees all, a regular user only sees themselves)
 *     description: |
 *       `filter[]`, `search[]`, `sort[]`, `page` and `limit` query parameters are supported.
 *
 *       **Examples:**
 *       - `?filter[role]=organizer`
 *       - `?search[username]=testuser`
 *       - `?sort[createdAt]=-1`
 *       - `?page=2&limit=10`
 *     tags: [Users]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: page
 *         type: integer
 *       - in: query
 *         name: limit
 *         type: integer
 *     responses:
 *       200:
 *         description: User list
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             details: { type: object }
 *             user:
 *               type: array
 *               items: { $ref: '#/definitions/User' }
 *
 * /users/{id}:
 *   get:
 *     summary: Returns the logged-in user's own profile
 *     description: "Note: although the route takes an :id parameter, the controller always operates on req.user (the token owner)."
 *     tags: [Users]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User profile
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             user: { $ref: '#/definitions/User' }
 *   put:
 *     summary: Updates the logged-in user's own profile
 *     description: All fields are optional, but at least one must be provided.
 *     tags: [Users]
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
 *         schema: { $ref: '#/definitions/UpdateUserInput' }
 *     responses:
 *       200:
 *         description: Updated user
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             user: { $ref: '#/definitions/User' }
 *   delete:
 *     summary: Deletes the logged-in user's own account
 *     tags: [Users]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Account deleted
 *
 * /users/{id}/password:
 *   put:
 *     summary: Changes the logged-in user's own password (current password is verified)
 *     tags: [Users]
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
 *         schema: { $ref: '#/definitions/ChangePasswordInput' }
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: currentPassword is incorrect
 *
 * /admin/users:
 *   get:
 *     summary: (Admin) Lists all users
 *     description: |
 *       `filter[]`, `search[]`, `sort[]`, `page` and `limit` query parameters are supported.
 *
 *       **Examples:**
 *       - `?filter[role]=admin`
 *       - `?search[email]=test@example.com`
 *       - `?sort[createdAt]=-1`
 *       - `?page=2&limit=10`
 *     tags: [Admin - Users]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: page
 *         type: integer
 *       - in: query
 *         name: limit
 *         type: integer
 *     responses:
 *       200:
 *         description: User list
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             details: { type: object }
 *             user:
 *               type: array
 *               items: { $ref: '#/definitions/User' }
 *   post:
 *     summary: (Admin) Creates a new user, can assign a role
 *     tags: [Admin - Users]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema: { $ref: '#/definitions/AdminCreateUserInput' }
 *     responses:
 *       201:
 *         description: Created user
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             user: { $ref: '#/definitions/User' }
 *       409:
 *         description: Email or username already registered
 *
 * /admin/users/{id}:
 *   get:
 *     summary: (Admin) Returns a single user
 *     tags: [Admin - Users]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             user: { $ref: '#/definitions/User' }
 *       404:
 *         description: User not found
 *   put:
 *     summary: (Admin) Updates a user (including role)
 *     tags: [Admin - Users]
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
 *         schema: { $ref: '#/definitions/AdminUpdateUserInput' }
 *     responses:
 *       200:
 *         description: Updated user
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             user: { $ref: '#/definitions/User' }
 *   delete:
 *     summary: (Admin) Deletes a user
 *     tags: [Admin - Users]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: User deleted
 *
 * /admin/users/{id}/password:
 *   put:
 *     summary: (Admin) Resets a user's password without knowing the current password
 *     tags: [Admin - Users]
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
 *         schema: { $ref: '#/definitions/ChangePasswordInput' }
 *     responses:
 *       200:
 *         description: Password updated
 */
export {};
