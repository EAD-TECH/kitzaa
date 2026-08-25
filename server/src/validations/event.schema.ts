
import { z } from 'zod';

const ageRangeSchema = z.enum(['0-3', '4-6', '7-10', '10-14', 'parents', 'all-ages']);

const priceSchema = z.object({
    amount: z.number().min(0),
    currency: z.string().trim().min(1).default('EUR'),
});

const scheduleSchema = z
    .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional().nullable(),
        startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
        endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
        isRecurring: z.boolean().optional().default(false),
        recurrenceRule: z.string().optional().nullable(),
    })
    .refine((data) => !data.endDate || data.startDate <= data.endDate, {
        message: 'startDate cannot be after endDate',
        path: ['endDate'],
    })
    .refine((data) => data.startDate >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: 'startDate cannot be in the past',
        path: ['startDate'],
    });

const locationSchema = z.object({
    venueName: z.string().trim().optional().nullable(),
    addressLine: z.string().trim().min(1, 'Address is required'),
    city: z.string().trim().min(1, 'City is required'),
    state: z.string().trim().optional().nullable(),
    zipCode: z
        .string()
        .regex(/^\d{5}$/, 'Please enter a valid German postal code (5 digits)')
        .optional()
        .nullable(),
    country: z.string().trim().default('DE'),
    coordinates: z
        .object({
            lat: z.number().min(-90).max(90),
            lng: z.number().min(-180).max(180),
        })
        .transform(({ lat, lng }) => ({
            type: 'Point' as const,
            coordinates: [lng, lat] as [number, number],
        })),
});


export const nearbyQuerySchema = z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
    radius: z.coerce.number().positive().max(50000).default(5000), // metre, ust sinir 50km
});

export type NearbyQueryInput = z.infer<typeof nearbyQuerySchema>;


const capacitySchema = z.object({
    max: z.number().int().min(1, 'Capacity must be at least 1'),
});

const baseEventSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(100),
    description: z.string().trim().min(1, 'Description is required').max(2000),
    coverImage: z.string().url().optional().nullable(),
    images: z.array(z.string().url()).optional().default([]),
    categoryId: z.string().min(1, 'Category is required'),
    locationType: z.enum(['indoor', 'outdoor', 'online']),
    ageRange: ageRangeSchema,
    isFree: z.boolean(),
    price: priceSchema.optional().nullable(),
    schedule: scheduleSchema,
    location: locationSchema,
    capacity: capacitySchema,
});


//  CREATE SCHEMA

export const createEventSchema = baseEventSchema
    .strict()
    .refine((data) => data.isFree || !!data.price, {
        message: 'Price is required for paid events',
        path: ['price'],
    });


// UPDATE SCHEMA 

export const updateEventSchema = baseEventSchema.partial().strict();



// EVENT STATUS SCHEMA

export const eventStatusSchema = z
    .object({
        status: z.enum(['approved', 'rejected', 'cancelled', 'completed']),
        rejectedReason: z.string().trim().min(1).optional(),
    })
    .strict()
    .refine((data) => data.status !== 'rejected' || !!data.rejectedReason, {
        message: 'rejectedReason is required when status is "rejected"',
        path: ['rejectedReason'],
    });


// REJECT SCHEMA 

export const rejectEventSchema = z
    .object({
        rejectedReason: z.string().trim().min(1, 'rejectedReason is required'),
    })
    .strict();


// CANCEL SCHEMA 

export const cancelEventSchema = z
    .object({
        cancelledReason: z.string().trim().min(1, 'cancelledReason is required'),
    })
    .strict();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventStatusInput = z.infer<typeof eventStatusSchema>;
export type RejectEventInput = z.infer<typeof rejectEventSchema>;
export type CancelEventInput = z.infer<typeof cancelEventSchema>;