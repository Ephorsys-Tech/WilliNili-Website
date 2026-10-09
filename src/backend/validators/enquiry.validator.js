import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createEnquirySchema = z.object({
  enquiryType: z.enum(['FarmHouse', 'Horticulture', 'ShopRental', 'General', 'Contact']),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100),
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address')
    .max(100),
  mobile: z
    .string()
    .trim()
    .min(7, 'Mobile number must be at least 7 digits')
    .max(20)
    .regex(/^[0-9+\s\-()]+$/, 'Mobile number contains invalid characters'),
  message: z
    .string()
    .trim()
    .min(5, 'Message must be at least 5 characters')
    .max(2000, 'Message cannot exceed 2000 characters'),
  // FarmHouse specific fields
  eventType: z.string().trim().max(100).optional(),
  preferredDate: z.coerce.date().optional(),
  expectedGuests: z.coerce.number().int().min(1).max(2000).optional(),
  // Horticulture specific fields
  plant: z.string().regex(objectIdRegex, 'Invalid plant selection').optional(),
  plantQuantity: z.coerce.number().int().min(1).max(10000).optional(),
  // ShopRental specific fields
  shop: z.string().regex(objectIdRegex, 'Invalid shop selection').optional(),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(['New', 'Contacted', 'In Progress', 'Closed', 'Archived']),
  adminNotes: z.string().trim().max(1000).optional(),
});
