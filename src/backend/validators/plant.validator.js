import { z } from 'zod';

export const plantSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  scientificName: z.string().trim().max(120).optional().default(''),
  category: z.enum([
    'Fruit Plants',
    'Flowering Plants',
    'Medicinal Plants',
    'Ornamental Plants',
    'Agro Forestry Saplings',
    'Organic Herbs',
    'Other',
  ]),
  description: z.string().trim().min(5, 'Description must be at least 5 characters'),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  priceBasis: z.string().trim().default('per sapling'),
  availability: z.enum(['In Stock', 'Out of Stock', 'Pre-order']).default('In Stock'),
  careInstructions: z.string().trim().default(''),
  heightSize: z.string().trim().default(''),
  images: z.array(z.string().trim()).default([]),
  isArchived: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export const updatePlantSchema = plantSchema.partial();
