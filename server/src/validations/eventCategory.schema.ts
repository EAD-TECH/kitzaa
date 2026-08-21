import { z } from 'zod';

export const createEventCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Category name is required')
      .max(50, 'Category name cannot exceed 50 characters'),

    description: z
      .string()
      .trim()
      .max(500, 'Description cannot exceed 500 characters')
      .optional()
      .nullable(),

    icon: z.string().trim().optional(),

    isActive: z.boolean().optional().default(true),
  })
  .strict();

export const updateEventCategorySchema = createEventCategorySchema.partial().strict();

export const eventCategoryParamsSchema = z
  .object({
    id: z.string().min(1, 'Category id is required'),
  })
  .strict();

export type CreateEventCategoryInput = z.infer<typeof createEventCategorySchema>;
export type UpdateEventCategoryInput = z.infer<typeof updateEventCategorySchema>;
export type EventCategoryParams = z.infer<typeof eventCategoryParamsSchema>;