/**
 * @swagger
 * definitions:
 *   PostLocation:
 *     type: object
 *     required: [lat, lng]
 *     properties:
 *       lat: { type: number, example: 52.5145 }
 *       lng: { type: number, example: 13.3501 }
 *
 *   PostAuthorSummary:
 *     type: object
 *     properties:
 *       _id: { type: string }
 *       username: { type: string }
 *       firstName: { type: string, nullable: true }
 *       lastName: { type: string, nullable: true }
 *       avatarUrl: { type: string, nullable: true }
 *
 *   PostEventTag:
 *     type: object
 *     nullable: true
 *     properties:
 *       _id: { type: string }
 *       title: { type: string }
 *       slug: { type: string }
 *
 *   Post:
 *     type: object
 *     properties:
 *       _id: { type: string }
 *       author: { $ref: '#/definitions/PostAuthorSummary' }
 *       text: { type: string }
 *       imageUrl: { type: string, nullable: true }
 *       likesCount: { type: integer, example: 0 }
 *       commentsCount: { type: integer, example: 0 }
 *       isLikedByMe: { type: boolean, example: false }
 *       event: { $ref: '#/definitions/PostEventTag' }
 *       placeName: { type: string, nullable: true }
 *       city: { type: string, nullable: true }
 *       location: { $ref: '#/definitions/PostLocation' }
 *       viewCount: { type: integer, example: 0 }
 *       createdAt: { type: string, format: date-time }
 *       updatedAt: { type: string, format: date-time }
 *
 *   CreatePostInput:
 *     type: object
 *     required: [text]
 *     properties:
 *       text: { type: string, maxLength: 5000, example: "Today's park event was amazing!" }
 *       imageUrl: { type: string, nullable: true, example: "https://example.com/post-image.jpg" }
 *       eventId: { type: string, nullable: true, description: "Optional Event ObjectId tag" }
 *       placeName: { type: string, nullable: true, example: Tiergarten }
 *       city: { type: string, nullable: true, example: Berlin }
 *       location:
 *         description: Optional free-place coordinates (not a full address)
 *         nullable: true
 *         $ref: '#/definitions/PostLocation'
 *
 *   UpdatePostInput:
 *     type: object
 *     description: Same fields as CreatePostInput, all optional (partial update)
 *     properties:
 *       text: { type: string, maxLength: 5000 }
 *       imageUrl: { type: string, nullable: true }
 *       eventId: { type: string, nullable: true }
 *       placeName: { type: string, nullable: true }
 *       city: { type: string, nullable: true }
 *       location:
 *         nullable: true
 *         $ref: '#/definitions/PostLocation'
 */
export {};
