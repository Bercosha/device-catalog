import { z } from 'zod'

export const DeviceCategorySchema = z.enum([
  'smartphone',
  'wearable',
  'accessory',
])

export const DeviceBadgeSchema = z.enum(['top', 'new', 'sale']).nullable()

export const DeviceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  brand: z.string(),
  model: z.string(),
  category: DeviceCategorySchema,
  priceMDL: z.number().int().nonnegative(),
  oldPriceMDL: z.number().int().nonnegative().nullable(),
  inStock: z.boolean(),
  badge: DeviceBadgeSchema,
  specs: z.record(z.string(), z.string()),
  image: z.string(),
})

export const DevicesSchema = z.array(DeviceSchema)

const QueryArrayParamSchema = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform(value => {
    if (!value) return []

    const values = Array.isArray(value) ? value : value.split(',')

    return Array.from(
      new Set(values.map(item => item.trim()).filter(Boolean))
    )
  })

export const DevicesQuerySchema = z
  .object({
    brand: QueryArrayParamSchema,
    minPrice: z.coerce.number().int().nonnegative().optional(),
    maxPrice: z.coerce.number().int().nonnegative().optional(),
    sort: z.enum(['price-asc', 'price-desc']).optional(),
    page: z.coerce.number().int().positive().default(1),
    perPage: z.coerce.number().int().positive().max(12).default(8),
  })
  .superRefine((query, ctx) => {
    if (
      typeof query.minPrice === 'number' &&
      typeof query.maxPrice === 'number' &&
      query.minPrice > query.maxPrice
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['minPrice'],
        message: 'minPrice cannot be greater than maxPrice',
      })
    }
  })

export const DevicesResponseSchema = z.object({
  items: DevicesSchema,
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  perPage: z.number().int().positive(),
  totalPages: z.number().int().positive(),
  availableFilters: z.object({
    brands: z.array(z.string()),
    price: z.object({
      min: z.number().int().nonnegative(),
      max: z.number().int().nonnegative(),
    }),
  }),
})

export type Device = z.infer<typeof DeviceSchema>
export type DevicesQuery = z.infer<typeof DevicesQuerySchema>
export type DevicesResponse = z.infer<typeof DevicesResponseSchema>
export type DeviceCategory = z.infer<typeof DeviceCategorySchema>
export type DeviceBadge = z.infer<typeof DeviceBadgeSchema>