import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name is required'),
    email: z.string().trim().email('Valid email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    phone: z.string().trim().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Valid email is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
