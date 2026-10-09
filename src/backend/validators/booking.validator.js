import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createBookingSchema = z
  .object({
    guestName: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z
      .string()
      .trim()
      .email('Please provide a valid email address')
      .max(100),
    mobile: z
      .string()
      .trim()
      .min(7, 'Mobile number must be at least 7 digits')
      .max(20, 'Mobile number cannot exceed 20 characters')
      .regex(/^[0-9+\s\-()]+$/, 'Mobile number contains invalid characters'),
    checkInDate: z.coerce.date({ invalid_type_error: 'Valid check-in date is required' }),
    checkOutDate: z.coerce.date({ invalid_type_error: 'Valid check-out date is required' }),
    guestCount: z.coerce
      .number()
      .int()
      .min(1, 'Guest count must be at least 1')
      .max(50, 'For groups larger than 50, please submit a Farm House enquiry'),
    roomsCount: z.coerce
      .number()
      .int()
      .min(1, 'At least 1 room is required')
      .max(20, 'Maximum 20 rooms per booking request'),
    room: z.string().regex(objectIdRegex, 'Invalid room selection'),
    specialRequest: z.string().trim().max(1000, 'Special request cannot exceed 1000 characters').optional().default(''),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: 'Check-out date must be strictly after check-in date',
    path: ['checkOutDate'],
  });

export const updateBookingStatusSchema = z.object({
  status: z.enum(['New', 'Under Review', 'Confirmed', 'Declined', 'Cancelled']),
  adminNotes: z.string().trim().max(1000).optional(),
});
