import { z } from 'zod';

export const galleryItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(120, 'Title cannot exceed 120 characters'),
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
  imageUrl: z
    .string()
    .trim()
    .min(1, 'Image is required. Please upload a photo or provide a valid image URL.')
    .refine(
      (url) =>
        url.startsWith('https://') ||
        url.startsWith('http://') ||
        url.startsWith('/'),
      'Image URL must be a valid secure URL or relative path'
    )
    .refine(
      (url) => !url.toLowerCase().startsWith('javascript:') && !url.toLowerCase().startsWith('data:'),
      'Malicious URL schemes are not permitted'
    ),
  caption: z.string().trim().max(300, 'Caption cannot exceed 300 characters').optional().default(''),
  isPublic: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const updateGalleryItemSchema = galleryItemSchema.partial();
