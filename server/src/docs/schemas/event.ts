/**
 * @swagger
 * definitions:
 *   AgeRange:
 *     type: object
 *     required: [min, max]
 *     properties:
 *       min: { type: integer, example: 3 }
 *       max: { type: integer, example: 12 }
 *
 *   Price:
 *     type: object
 *     required: [amount]
 *     properties:
 *       amount: { type: number, example: 9.99 }
 *       currency: { type: string, default: EUR }
 *
 *   Schedule:
 *     type: object
 *     required: [startDate, startTime, endTime]
 *     properties:
 *       startDate: { type: string, format: date, example: "2026-07-31" }
 *       endDate: { type: string, format: date, nullable: true }
 *       startTime: { type: string, example: "10:00" }
 *       endTime: { type: string, example: "16:00" }
 *       isRecurring: { type: boolean, default: false }
 *       recurrenceRule: { type: string, nullable: true, example: weekly }
 *
 *   EventLocation:
 *     type: object
 *     required: [addressLine, city]
 *     properties:
 *       venueName: { type: string, nullable: true }
 *       addressLine: { type: string, example: "Parkstrasse 1" }
 *       city: { type: string, example: Berlin }
 *       state: { type: string, nullable: true }
 *       zipCode: { type: string, example: "10115", nullable: true }
 *       country: { type: string, default: DE }
 *       coordinates:
 *         type: object
 *         nullable: true
 *         description: Coordinates coming from the frontend (map/geolocation).
 *         properties:
 *           lat: { type: number, example: 52.5321 }
 *           lng: { type: number, example: 13.3845 }
 *
 *   Capacity:
 *     type: object
 *     required: [max]
 *     properties:
 *       max: { type: integer, example: 20 }
 *       current: { type: integer, example: 0 }
 *
 *   Event:
 *     type: object
 *     properties:
 *       _id: { type: string }
 *       title: { type: string }
 *       slug: { type: string }
 *       description: { type: string }
 *       coverImage: { type: string, nullable: true }
 *       images: { type: array, items: { type: string } }
 *       categoryId:
 *         description: id string if not populated, { _id, name, slug, icon } if populated
 *         oneOf:
 *           - { type: string }
 *           - type: object
 *             properties:
 *               _id: { type: string }
 *               name: { type: string }
 *               slug: { type: string }
 *               icon: { type: string }
 *       ageRange: { $ref: '#/definitions/AgeRange' }
 *       createdBy:
 *         description: id string if not populated, { _id, username, avatarUrl } if populated
 *         oneOf:
 *           - { type: string }
 *           - type: object
 *             properties:
 *               _id: { type: string }
 *               username: { type: string }
 *               avatarUrl: { type: string, nullable: true }
 *       status: { type: string, enum: [pending, approved, rejected, cancelled, completed] }
 *       isFree: { type: boolean }
 *       price: { $ref: '#/definitions/Price' }
 *       schedule: { $ref: '#/definitions/Schedule' }
 *       location: { $ref: '#/definitions/EventLocation' }
 *       capacity: { $ref: '#/definitions/Capacity' }
 *       viewCount: { type: integer }
 *       createdAt: { type: string, format: date-time }
 *       updatedAt: { type: string, format: date-time }
 *
 *   AdminEvent:
 *     allOf:
 *       - { $ref: '#/definitions/Event' }
 *       - type: object
 *         properties:
 *           rejectedReason: { type: string, nullable: true }
 *           cancelledReason: { type: string, nullable: true }
 *           approvedAt: { type: string, format: date-time, nullable: true }
 *
 *   CreateEventInput:
 *     type: object
 *     required: [title, description, categoryId, ageRange, isFree, schedule, location, capacity]
 *     properties:
 *       title: { type: string, maxLength: 100 }
 *       description: { type: string, maxLength: 2000 }
 *       coverImage: { type: string, nullable: true }
 *       images: { type: array, items: { type: string } }
 *       categoryId: { type: string }
 *       ageRange: { $ref: '#/definitions/AgeRange' }
 *       isFree: { type: boolean }
 *       price:
 *         description: required if isFree is false
 *         $ref: '#/definitions/Price'
 *       schedule: { $ref: '#/definitions/Schedule' }
 *       location: { $ref: '#/definitions/EventLocation' }
 *       capacity: { $ref: '#/definitions/Capacity' }
 *
 *   UpdateEventInput:
 *     allOf:
 *       - { $ref: '#/definitions/CreateEventInput' }
 *
 *   RejectEventInput:
 *     type: object
 *     required: [rejectedReason]
 *     properties:
 *       rejectedReason: { type: string, example: "Event details are insufficient." }
 *
 *   CancelEventInput:
 *     type: object
 *     required: [cancelledReason]
 *     properties:
 *       cancelledReason: { type: string, example: "Cancelled due to weather conditions." }
 */
export {};
