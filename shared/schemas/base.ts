import * as z from 'zod';

export const EntityIDSchema = z.coerce.number<number>().positive();

export type EntityID = z.infer<typeof EntityIDSchema>;

export const TimestampSchema = z.strictObject({
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().nullish(),
});

export const AuthorSchema = z.strictObject({
  createdBy: EntityIDSchema,
  updatedBy: EntityIDSchema,
});

export const AuditFieldsSchema = z.strictObject({
  ...TimestampSchema.shape,
  ...AuthorSchema.shape,
});

export type AuditFields = z.infer<typeof AuditFieldsSchema>;

export const BaseSchema = z.strictObject({
  id: EntityIDSchema,
  ...AuditFieldsSchema.shape,
});

export type Entity = z.infer<typeof BaseSchema>;

export type NewEntity<T extends Entity> = Omit<T, 'id' | Exclude<keyof AuditFields, 'createdBy'>>;
