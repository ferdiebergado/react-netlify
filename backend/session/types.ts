import * as z from 'zod';
import { BaseSchema, EntityIDSchema } from '../../shared/schemas/base.ts';

export const SessionRowSchema = z.strictObject({
  ...BaseSchema.pick({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  }).shape,
  sessionId: z.string(),
  userId: EntityIDSchema,
  expiresAt: z.iso.datetime(),
  lastActiveAt: z.iso.datetime(),
  revokedAt: z.iso.datetime().nullish(),
});

export type Session = z.infer<typeof SessionRowSchema>;

export type NewSession = Pick<Session, 'sessionId' | 'userId' | 'expiresAt'>;
