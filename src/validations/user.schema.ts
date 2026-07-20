import { z } from 'zod';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/;

const PHONE_REGEX =
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{0,4}$/;

export const createUserSchema = z.object({
    username: z
        .string()
        .trim()
        .min(2, 'Username is required')
        .max(50, 'Username cannot exceed 50 characters'),

    firstName: z
        .string()
        .trim()
        .min(2, 'First name is required')
        .max(50, 'First name cannot exceed 50 characters'),

    lastName: z
        .string()
        .trim()
        .min(2, 'Last name is required')
        .max(50, 'Last name cannot exceed 50 characters'),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .regex(EMAIL_REGEX, 'Please enter a valid email address'),

    password: z
        .string()
        .regex(
            PASSWORD_REGEX,
            'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
        ),

    phone: z
        .string()
        .regex(
            PHONE_REGEX,
            'Please enter a valid phone number (international format supported)'
        )
        .nullable() // alan gelmeyebilir, gelirse null olabilir.
        .optional(),

    avatarUrl: z.string().url().nullable().optional(),

    language: z.enum(['de', 'en']).optional(),

    location: z.object({
        state: z.string().trim().nullable().optional(),

        city: z
            .string()
            .trim()
            .min(2, 'City is required'),

        district: z.string().trim().nullable().optional(),

        zipCode: z
            .string()
            .regex(/^\d{5}$/, 'Please enter a valid German postal code')
            .nullable()
            .optional(),

        country: z.string().default('DE').optional(),
    }),
}).strict(); // strict whitelist disinda herseyi reeddetmek icin kullaniyoruz.


// loginschema

export const loginSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1, 'Username or email is required'),

  password: z
    .string()
    .min(1, 'Password is required'),
}).strict();


// update schema

export const updateUserSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, 'Username must be at least 3 characters')
      .max(50)
      .optional(),

    firstName: z
      .string()
      .trim()
      .min(2, 'First name must be at least 2 characters')
      .max(50)
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(2, 'Last name must be at least 2 characters')
      .max(50)
      .optional(),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .refine((value) => EMAIL_REGEX.test(value), {
        message: 'Please enter a valid email address',
      })
      .optional(),

    phone: z
      .string()
      .trim()
      .min(7, 'Phone number is too short')
      .max(20, 'Phone number is too long')
      .refine((value) => PHONE_REGEX.test(value), {
        message: 'Please enter a valid phone number',
      })
      .optional(),

    avatarUrl: z.string().url().optional(),

    language: z.enum(['de', 'en']).optional(),

    location: z
      .object({
        state: z.string().trim().min(2).max(50).optional(),

        city: z
          .string()
          .trim()
          .min(2, 'City must be at least 2 characters')
          .max(50)
          .optional(),

        district: z
          .string()
          .trim()
          .min(2)
          .max(50)
          .optional(),

        zipCode: z
          .string()
          .regex(/^\d{5}$/, {
            message: 'Please enter a valid German postal code (5 digits)',
          })
          .optional(),

        country: z
          .string()
          .trim()
          .min(2)
          .max(50)
          .optional(),
      })
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update.',
  });  // req.body tamamen bossa hata verir. yani hicbir alan degismediyse.


  // password update

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, 'Current password is required'),

    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
        'Password must contain uppercase, lowercase, number and special character'
      ),

    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });