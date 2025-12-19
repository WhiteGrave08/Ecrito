import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username is too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  fullName: z.string().min(1, 'Full name is required').max(100, 'Name is too long'),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username is too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  fullName: z.string().min(1, 'Full name is required').max(100, 'Name is too long'),
  bio: z.string().max(500, 'Bio is too long').optional(),
  avatarUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
