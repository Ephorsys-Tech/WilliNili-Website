import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Room from '../../src/models/Room.js';
import BookingRequest from '../../src/models/BookingRequest.js';
import { createBookingRequest, updateBookingStatus } from '../../src/backend/services/booking.service.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Booking Request Integration Flow', () => {
  let createdRoomId;

  it('creates an available room in the database', async () => {
    const room = await Room.create({
      name: 'Integration Test Room',
      roomType: 'Deluxe',
      isAc: true,
      pricePerNight: 3000,
      priceDisplay: true,
      capacityAdults: 2,
      capacityChildren: 1,
      bedType: 'King Bed',
      description: 'Test Room description for booking integration flow.',
      features: ['Balcony', 'Garden View'],
      amenities: ['Hot Water', 'Wi-Fi'],
      isAvailable: true,
    });

    createdRoomId = room._id.toString();
    expect(createdRoomId).toBeDefined();
  });

  it('submits a public guest booking request and receives reference number', async () => {
    const bookingData = {
      guestName: 'Anil Kumar',
      email: 'anil@example.com',
      mobile: '+91 9988776655',
      checkInDate: '2026-11-20',
      checkOutDate: '2026-11-23',
      guestCount: 2,
      roomsCount: 1,
      room: createdRoomId,
      specialRequest: 'Late evening check-in around 8 PM',
    };

    const res = await createBookingRequest(bookingData);

    expect(res.bookingReference).toMatch(/^WN-BK-\d{8}-[A-F0-9]{6}$/);
    expect(res.status).toBe('New');
    expect(res.guestName).toBe('Anil Kumar');
    expect(res.message).toContain('booking request has been submitted successfully');

    // Confirm stored in MongoDB
    const stored = await BookingRequest.findOne({ bookingReference: res.bookingReference });
    expect(stored).not.toBeNull();
    expect(stored.status).toBe('New');
    expect(stored.statusHistory.length).toBe(1);
    expect(stored.statusHistory[0].status).toBe('New');
  });

  it('updates booking request status with admin notes and records history', async () => {
    const booking = await BookingRequest.findOne();
    expect(booking).not.toBeNull();

    const adminUser = {
      id: new mongoose.Types.ObjectId().toString(),
      email: 'admin@willynilly.in',
      role: 'superadmin',
    };

    const updated = await updateBookingStatus(
      booking._id.toString(),
      {
        status: 'Confirmed',
        adminNotes: 'Spoke with guest on phone, room availability confirmed.',
      },
      adminUser
    );

    expect(updated.status).toBe('Confirmed');
    expect(updated.adminNotes).toContain('room availability confirmed');
    expect(updated.statusHistory.length).toBe(2);
    expect(updated.statusHistory[1].status).toBe('Confirmed');
    expect(updated.statusHistory[1].changedBy).toBe('admin@willynilly.in');
  });
});
