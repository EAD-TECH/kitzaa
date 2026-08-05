/**
 * @swagger
 * definitions:
 *   Location:
 *     type: object
 *     required: [city, country]
 *     properties:
 *       state: { type: string, nullable: true }
 *       city: { type: string, example: Berlin }
 *       district: { type: string, nullable: true }
 *       zipCode: { type: string, example: "10115", nullable: true }
 *       country: { type: string, default: DE }
 *
 *   User:
 *     type: object
 *     properties:
 *       _id: { type: string }
 *       username: { type: string }
 *       firstName: { type: string }
 *       lastName: { type: string }
 *       email: { type: string }
 *       avatar: { type: string, nullable: true }
 *       role: { type: string, enum: [user, organizer, admin] }
 *       language: { type: string, enum: [de, en] }
 *       location: { $ref: '#/definitions/Location' }
 *       isEmailVerified: { type: boolean }
 *       createdAt: { type: string, format: date-time }
 *       updatedAt: { type: string, format: date-time }
 *
 *   UpdateUserInput:
 *     type: object
 *     properties:
 *       username: { type: string }
 *       firstName: { type: string }
 *       lastName: { type: string }
 *       email: { type: string }
 *       phone: { type: string }
 *       avatarUrl: { type: string }
 *       language: { type: string, enum: [de, en] }
 *       location: { $ref: '#/definitions/Location' }
 *
 *   AdminUpdateUserInput:
 *     allOf:
 *       - { $ref: '#/definitions/UpdateUserInput' }
 *       - type: object
 *         properties:
 *           role: { type: string, enum: [user, organizer, admin] }
 *
 *   AdminCreateUserInput:
 *     type: object
 *     required: [username, firstName, lastName, email, password, location]
 *     properties:
 *       username: { type: string }
 *       firstName: { type: string }
 *       lastName: { type: string }
 *       email: { type: string }
 *       password: { type: string, format: password }
 *       phone: { type: string }
 *       location: { $ref: '#/definitions/Location' }
 *       role: { type: string, enum: [user, organizer, admin], default: user }
 *
 *   ChangePasswordInput:
 *     type: object
 *     required: [currentPassword, newPassword, confirmPassword]
 *     properties:
 *       currentPassword: { type: string, format: password }
 *       newPassword: { type: string, format: password }
 *       confirmPassword: { type: string, format: password }
 */
export {};
