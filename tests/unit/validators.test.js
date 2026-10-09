import { describe, it, expect } from 'vitest';
import { createBookingSchema } from '../../src/backend/validators/booking.validator.js';
import { createEnquirySchema } from '../../src/backend/validators/enquiry.validator.js';
import { roomSchema } from '../../src/backend/validators/room.validator.js';
import { plantSchema } from '../../src/backend/validators/plant.validator.js';
import { shopRentalSchema } from '../../src/backend/validators/shopRental.validator.js';

describe('Schema Validators Unit Tests', () => {
  describe('Booking Request Validator', () => {
    it('accepts valid booking data with checkout after checkin', () => {
      const valid = {
        guestName: 'Sarat Singh',
        email: 'sarat@example.com',
        mobile: '+91 9876543210',
        checkInDate: '2026-11-10',
        checkOutDate: '2026-11-14',
        guestCount: 2,
        roomsCount: 1,
        room: '60d5ecb8b5c0c8001f5e8888',
        specialRequest: 'Vegetarian breakfast',
      };

      const result = createBookingSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects booking when check-out date is equal to or before check-in date', () => {
      const invalidDates = {
        guestName: 'Sarat Singh',
        email: 'sarat@example.com',
        mobile: '+91 9876543210',
        checkInDate: '2026-11-14',
        checkOutDate: '2026-11-10', // Before check-in
        guestCount: 2,
        roomsCount: 1,
        room: '60d5ecb8b5c0c8001f5e8888',
      };

      const result = createBookingSchema.safeParse(invalidDates);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/Check-out date must be strictly after/);
    });

    it('rejects non-positive guest count or invalid room ObjectId', () => {
      const badGuestCount = {
        guestName: 'Sarat Singh',
        email: 'sarat@example.com',
        mobile: '+91 9876543210',
        checkInDate: '2026-11-10',
        checkOutDate: '2026-11-12',
        guestCount: 0, // Must be >= 1
        roomsCount: 1,
        room: 'invalid-id-format',
      };

      const result = createBookingSchema.safeParse(badGuestCount);
      expect(result.success).toBe(false);
    });
  });

  describe('Enquiry Request Validator', () => {
    it('validates FarmHouse event enquiry fields', () => {
      const farmEnquiry = {
        enquiryType: 'FarmHouse',
        name: 'Amit Patel',
        email: 'amit@patel.com',
        mobile: '+91 9123456789',
        message: 'Looking to book open lawn for a wedding reception for 300 guests',
        eventType: 'Wedding / Reception',
        preferredDate: '2026-12-05',
        expectedGuests: 300,
      };

      const result = createEnquirySchema.safeParse(farmEnquiry);
      expect(result.success).toBe(true);
    });

    it('validates Horticulture plant enquiry fields', () => {
      const plantEnquiry = {
        enquiryType: 'Horticulture',
        name: 'Sunita Roy',
        email: 'sunita@roy.org',
        mobile: '9876543210',
        message: 'Need 50 grafted mango saplings for orchard expansion',
        plant: '60d5ecb8b5c0c8001f5e8888',
        plantQuantity: 50,
      };

      const result = createEnquirySchema.safeParse(plantEnquiry);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email formats', () => {
      const badEmail = {
        enquiryType: 'General',
        name: 'John Doe',
        email: 'not-an-email',
        mobile: '9876543210',
        message: 'Hello, need help',
      };

      const result = createEnquirySchema.safeParse(badEmail);
      expect(result.success).toBe(false);
    });
  });

  describe('Room Inventory Validator', () => {
    it('validates room record with required fields', () => {
      const validRoom = {
        name: 'Garden Verandah Suite',
        roomType: 'Deluxe',
        isAc: true,
        pricePerNight: 2800,
        priceDisplay: true,
        capacityAdults: 2,
        capacityChildren: 1,
        bedType: 'King Bed',
        description: 'Spacious suite with garden verandah view and natural breezes.',
        features: ['Garden View', 'Attached Bath'],
        amenities: ['Hot Water', 'Clean Linens'],
      };

      const result = roomSchema.safeParse(validRoom);
      expect(result.success).toBe(true);
    });

    it('rejects negative room pricing or invalid roomType enum', () => {
      const badRoom = {
        name: 'Suite',
        roomType: 'Penthouse', // Invalid enum
        pricePerNight: -500, // Invalid negative price
        capacityAdults: 1,
        bedType: 'Single Bed',
        description: 'Short room desc.',
      };

      const result = roomSchema.safeParse(badRoom);
      expect(result.success).toBe(false);
    });
  });

  describe('Shop Rental Validator', () => {
    it('validates commercial shop creation fields', () => {
      const validShop = {
        title: 'Entrance Plaza Commercial Unit 1',
        shopNumber: 'S-01',
        sizeSqFt: 350,
        rentAmount: 15000,
        rentPeriod: 'Monthly',
        location: 'Ground Floor, Agro Campus Main Gate',
        description: 'Prime retail outlet for agriculture seeds, organic foods or crafts.',
        facilities: ['Shutter Door', 'Power Supply'],
      };

      const result = shopRentalSchema.safeParse(validShop);
      expect(result.success).toBe(true);
    });
  });
});
