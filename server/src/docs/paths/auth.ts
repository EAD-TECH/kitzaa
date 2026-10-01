/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Creates a new user account
 *     tags: [Auth]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema: { $ref: '#/definitions/RegisterInput' }
 *     responses:
 *       201:
 *         description: Registration successful, verification email sent
 *         schema: { $ref: '#/definitions/AuthResponse' }
 *       409:
 *         description: Email or username already registered
 *
 * /auth/login:
 *   post:
 *     summary: Logs in with username/email + password
 *     tags: [Auth]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema: { $ref: '#/definitions/LoginInput' }
 *     responses:
 *       200:
 *         description: Login successful
 *         schema: { $ref: '#/definitions/AuthResponse' }
 *       401:
 *         description: Wrong username/email or password
 *
 * /auth/logout:
 *   post:
 *     summary: Logs out, clears the refreshToken cookie
 *     tags: [Auth]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Logout successful
 *
 * /auth/refresh:
 *   post:
 *     summary: Issues a new accessToken using the refreshToken cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New accessToken
 *         schema:
 *           type: object
 *           properties:
 *             error: { type: boolean, example: false }
 *             accessToken: { type: string }
 *       400:
 *         description: refreshToken cookie is missing
 *       401:
 *         description: refreshToken is invalid or expired
 *
 * /auth/forgot-password:
 *   post:
 *     summary: Sends a password reset link (if the email exists)
 *     tags: [Auth]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema: { $ref: '#/definitions/ForgotPasswordInput' }
 *     responses:
 *       200:
 *         description: Returns a generic message (does not leak whether the email exists)
 *
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Resets the password using the token from the email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         required: true
 *         schema: { $ref: '#/definitions/ResetPasswordInput' }
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Token is invalid or expired
 *
 * /auth/verify-email/{token}:
 *   get:
 *     summary: Verifies the email address using the link from the email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Token is invalid or expired
 */
export {};
