import { z } from 'zod';

export const galleryItemSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(120),
  album: z.enum([
    'Guest House',
    'Farm House',
    'Events',
    'Resort',
    'Horticulture',
    'Property',
    'Celebrations',
    'General',
  ]),
  imageUrl: z.string().trim().min(1, 'Image URL is required'),
  caption: z.string().trim().max(300).optional().default(''),
  isPublic: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const updateGalleryItemSchema = galleryItemSchema.partial();
