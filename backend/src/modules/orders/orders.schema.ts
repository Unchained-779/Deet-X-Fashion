import { z } from 'zod';

export const checkoutSchema = z.object({
  body: z.object({
    customer: z.object({
      fullName: z.string().trim().min(2, 'Full name is required'),
      email: z.string().trim().email('Valid email address is required'),
      phone: z.string().trim().min(10, 'Valid 10-digit phone number is required'),
      street: z.string().trim().min(3, 'Street address is required'),
      city: z.string().trim().min(2, 'City is required'),
      state: z.string().trim().optional().default('Delhi'),
      pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/, 'Invalid 6-digit Indian PIN code'),
    }),
    items: z
      .array(
        z.object({
          variantId: z.string().min(1, 'Variant ID required'),
          quantity: z.number().int().positive('Quantity must be greater than 0'),
          price: z.number().positive('Price must be greater than 0'),
        })
      )
      .min(1, 'At least one item required in cart'),
    totalAmount: z.number().positive('Total amount must be positive'),
  }),
});

export const orderParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
});

export type CheckoutPayload = z.infer<typeof checkoutSchema>['body'];
