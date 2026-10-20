import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2, 'Title must be at least 2 characters'),
    slug: z.string().trim().optional(),
    description: z.string().trim().min(5, 'Description is required'),
    basePrice: z.number().positive('Base price must be positive'),
    categoryId: z.string().optional().nullable(),
    countryOfOrigin: z.string().default('India'),
    fabricCare: z.string().optional().nullable(),
    imageUrl: z.string().url('Must be a valid URL').optional().nullable(),
    variants: z
      .array(
        z.object({
          sku: z.string().trim().min(2, 'SKU must be provided').toUpperCase(),
          size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE_SIZE']),
          colorName: z.string().trim().min(2, 'Color name is required'),
          colorHex: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Invalid hex color').default('#000000'),
          stockCount: z.number().int().nonnegative().default(10),
          images: z.array(z.string().url()).default([]),
        })
      )
      .min(1, 'At least one SKU variant is required'),
  }),
});

export const getProductsQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    search: z.string().optional(),
  }),
});

export const productParamSchema = z.object({
  params: z.object({
    identifier: z.string().min(1, 'Identifier is required'),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>['query'];
