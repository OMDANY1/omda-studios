import { z } from 'zod'

const requiredText = z.string().trim().min(1)

const nullableText = z.preprocess(
  (value) => {
    if (value === undefined || value === null) return null
    if (typeof value === 'string') return value.trim() || null
    return value
  },
  z.string().nullable()
)

const optionalNullableText = z.preprocess(
  (value) => {
    if (value === undefined) return undefined
    if (value === null) return null
    if (typeof value === 'string') return value.trim() || null
    return value
  },
  z.string().nullable().optional()
)

const optionalEmail = z.preprocess(
  (value) => {
    if (value === undefined) return undefined
    if (value === null) return null
    if (typeof value === 'string') return value.trim() || null
    return value
  },
  z.string().email().nullable().optional()
)

export function withoutUndefined<T extends Record<string, unknown>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  ) as Partial<T>
}

export const serviceCreateSchema = z.object({
  title: requiredText.max(120),
  description: optionalNullableText.transform((value) => value ?? null),
  icon: optionalNullableText.transform((value) => value ?? null),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
})

export const serviceUpdateSchema = z.object({
  title: requiredText.max(120).optional(),
  description: optionalNullableText,
  icon: optionalNullableText,
  order: z.coerce.number().int().optional(),
  published: z.boolean().optional(),
})

export const teamMemberCreateSchema = z.object({
  name: requiredText.max(120),
  role: requiredText.max(120),
  bio: optionalNullableText.transform((value) => value ?? null),
  image: optionalNullableText.transform((value) => value ?? null),
  email: optionalEmail.transform((value) => value ?? null),
  linkedin: optionalNullableText.transform((value) => value ?? null),
  instagram: optionalNullableText.transform((value) => value ?? null),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
})

export const teamMemberUpdateSchema = z.object({
  name: requiredText.max(120).optional(),
  role: requiredText.max(120).optional(),
  bio: optionalNullableText,
  image: optionalNullableText,
  email: optionalEmail,
  linkedin: optionalNullableText,
  instagram: optionalNullableText,
  order: z.coerce.number().int().optional(),
  published: z.boolean().optional(),
})

export const testimonialCreateSchema = z.object({
  name: requiredText.max(120),
  company: optionalNullableText.transform((value) => value ?? null),
  role: optionalNullableText.transform((value) => value ?? null),
  content: requiredText.max(5000),
  image: optionalNullableText.transform((value) => value ?? null),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
})

export const testimonialUpdateSchema = z.object({
  name: requiredText.max(120).optional(),
  company: optionalNullableText,
  role: optionalNullableText,
  content: requiredText.max(5000).optional(),
  image: optionalNullableText,
  rating: z.coerce.number().int().min(1).max(5).optional(),
  order: z.coerce.number().int().optional(),
  published: z.boolean().optional(),
})

export const messageUpdateSchema = z.object({
  status: z.enum(['UNREAD', 'READ', 'REPLIED', 'ARCHIVED']),
})

export const mediaUpdateSchema = z.object({
  filename: requiredText.max(200).optional(),
  alt: optionalNullableText,
})
