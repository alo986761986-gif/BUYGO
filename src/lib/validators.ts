import { z } from 'zod';
export const registerSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(10).max(128),
  name: z.string().trim().min(2).max(80).optional(),
});
export const loginSchema = z.object({ email: z.email(), password: z.string().min(1) });
export const productSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180),
  description: z.string().max(10000).default(''),
  priceCents: z.number().int().min(0).max(100000000),
  stock: z.number().int().min(0).max(1000000),
  currency: z.string().regex(/^[A-Z]{3}$/).default('EUR'),
  imageUrl: z.url().optional().nullable(),
  active: z.boolean().default(false),
});
