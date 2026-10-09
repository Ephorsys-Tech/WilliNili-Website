import { z } from 'zod';

export const roomSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  roomType: z.enum(['Single', 'Double', 'Family', 'Deluxe', 'Suite']),
  isAc: z.boolean().default(true),
  pricePerNight: z.coerce.number().min(0, 'Price must be non-negative'),
  priceDisplay: z.boolean().default(true),
  capacityAdults: z.coerce.number().int().min(1, 'At least 1 adult capacity required'),
  capacityChildren: z.coerce.number().int().min(0).default(0),
  bedType: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  features: z.array(z.string().trim()).default([]),
  amenities: z.array(z.string().trim()).default([]),
  images: z.array(z.string().trim()).default([]),
  isAvailable: z.boolean().default(true),
  isArchived: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export const updateRoomSchema = roomSchema.partial();
