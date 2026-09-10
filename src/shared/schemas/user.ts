import * as z from 'zod';
import { BaseSchema } from './base.ts';

export const UserRowSchema = z.strictObject({
  ...BaseSchema.pick({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  }).shape,

  // Basic Profile
  googleId: z.string().min(1, 'Google ID is required'),
  email: z.email('Invalid email address').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  picture: z.url('Invalid URL format').optional(),

  // Permissions
  role: z.enum(['user', 'admin']).optional(),

  // Timestamps (ISO 8601 Strings)
  lastLoginAt: z.iso.datetime(),
  deactivatedAt: z.iso.datetime().optional(),
});

export type User = z.infer<typeof UserRowSchema>;

export type NewUser = Pick<User, 'googleId' | 'email' | 'name' | 'picture'>;

export type Profile = Pick<User, 'name' | 'email' | 'picture'>;
