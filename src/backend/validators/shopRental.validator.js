import { z } from 'zod';

export const shopRentalSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(120),
  shopNumber: z.string().trim().min(1, 'Shop number is required').max(50),
  sizeSqFt: z.coerce.number().min(10, 'Size must be at least 10 sq ft'),
  rentAmount: z.coerce.number().min(0, 'Rent amount must be non-negative'),
  rentPeriod: z.enum(['Monthly', 'Quarterly', 'Annual']).default('Monthly'),
  location: z.string().trim().min(2, 'Location is required').max(200),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  facilities: z.array(z.string().trim()).default([]),
  images: z.array(z.string().trim()).default([]),
  isAvailable: z.boolean().default(true),
  isArchived: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export const updateShopRentalSchema = shopRentalSchema.partial();
