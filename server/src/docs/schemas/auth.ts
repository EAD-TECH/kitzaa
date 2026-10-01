/**
 * @swagger
 * definitions:
 *   RegisterInput:
 *     type: object
 *     required: [username, firstName, lastName, email, password, location]
 *     properties:
 *       username: { type: string, example: testuser }
 *       firstName: { type: string, example: Test }
 *       lastName: { type: string, example: User }
 *       email: { type: string, example: test@example.com }
 *       password: { type: string, format: password, example: "Test123." }
 *       phone: { type: string, example: "+491234567890" }
 *       avatarUrl: { type: string, nullable: true }
 *       language: { type: string, enum: [de, en] }
 *       location:
 *         type: object
 *         required: [city]
 *         properties:
 *           city: { type: string, example: Berlin }
 *           state: { type: string, nullable: true }
 *           district: { type: string, nullable: true }
 *           zipCode: { type: string, example: "10115" }
 *           country: { type: string, default: DE }
 *
 *   LoginInput:
 *     type: object
 *     required: [login, password]
 *     properties:
 *       login:
 *         type: string
 *         description: username or email
 *         example: testuser
 *       password: { type: string, format: password }
 *
 *   ForgotPasswordInput:
 *     type: object
 *     required: [email]
 *     properties:
 *       email: { type: string, example: test@example.com }
 *
 *   ResetPasswordInput:
 *     type: object
 *     required: [newPassword, confirmPassword]
 *     properties:
 *       newPassword: { type: string, format: password }
 *       confirmPassword: { type: string, format: password }
 *
 *   AuthResponse:
 *     type: object
 *     properties:
 *       error: { type: boolean, example: false }
 *       accessToken: { type: string }
 *       user: { $ref: '#/definitions/User' }
 */
export {};
