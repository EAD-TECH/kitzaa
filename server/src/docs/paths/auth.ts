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
 *         description: Returns a generic message (does not leak whether the email exists). Accounts that have no password yet receive the same link.
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
 *         description: Password changed. The reset token and stored refresh token are invalidated. An existing Google identity is kept.
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
 *
 * /auth/google/nonce:
 *   get:
 *     summary: Issues a one-time nonce for Google Identity Services
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Returns the nonce and sets it in an httpOnly cookie. The browser Origin must be the client app.
 *       401:
 *         description: Origin is missing or not allowed
 *
 * /auth/google:
 *   post:
 *     summary: Verifies a Google ID token and starts a Kitzaa session
 *     tags: [Auth]
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           required: [credential]
 *           properties:
 *             credential:
 *               type: string
 *             locale:
 *               type: string
 *               enum: [de, en]
 *     responses:
 *       200:
 *         description: Refresh cookie is set. The access token is returned in the JSON body, as with email login.
 *       401:
 *         description: Origin, nonce, or Google ID token could not be verified
 *       403:
 *         description: The account is disabled
 *       409:
 *         description: The email already belongs to a password account and was not linked
 *
 * /auth/complete-profile:
 *   post:
 *     summary: Saves username and verified German location for an unfinished Google account
 *     tags: [Auth]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Profile completed
 *       403:
 *         description: Not used here. Other protected routes return this while the profile is unfinished.
 *       409:
 *         description: Username is already taken
 */
export {};
