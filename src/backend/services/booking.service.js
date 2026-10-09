import crypto from 'crypto';
import connectDB from '../config/db.js';
import BookingRequest from '../../models/BookingRequest.js';
import Room from '../../models/Room.js';
import AuditLog from '../../models/AuditLog.js';
import { NotFoundError, BadRequestError } from '../errors/AppError.js';

function generateBookingRef() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `WN-BK-${dateStr}-${rand}`;
}

export async function createBookingRequest(data) {
  await connectDB();

  const room = await Room.findById(data.room);
  if (!room || room.isArchived) {
    throw new NotFoundError('The selected room does not exist or is no longer available');
  }

  const checkIn = new Date(data.checkInDate);
  const checkOut = new Date(data.checkOutDate);

  if (checkOut <= checkIn) {
    throw new BadRequestError('Check-out date must be strictly after check-in date');
  }

  const bookingReference = generateBookingRef();

  const booking = await BookingRequest.create({
    bookingReference,
    guestName: data.guestName.trim(),
    email: data.email.toLowerCase().trim(),
    mobile: data.mobile.trim(),
    checkInDate: checkIn,
    checkOutDate: checkOut,
    guestCount: Number(data.guestCount),
    roomsCount: Number(data.roomsCount || 1),
    room: room._id,
    specialRequest: data.specialRequest ? data.specialRequest.trim() : '',
    status: 'New',
    statusHistory: [
      {
        status: 'New',
        changedAt: new Date(),
        changedBy: 'Guest (Website Request)',
        note: 'Booking request submitted',
      },
    ],
  });

  const populated = await BookingRequest.findById(booking._id).populate('room', 'name roomType pricePerNight isAc');

  return {
    bookingReference: populated.bookingReference,
    status: populated.status,
    guestName: populated.guestName,
    checkInDate: populated.checkInDate,
    checkOutDate: populated.checkOutDate,
    room: populated.room,
    createdAt: populated.createdAt,
    message: 'Your booking request has been submitted successfully. Our team will review availability and contact you shortly.',
  };
}

export async function listBookingRequests({ page = 1, limit = 20, status = '', search = '' } = {}) {
  await connectDB();

  const query = {};
  if (status) {
    query.status = status;
  }
  if (search) {
    const cleanSearch = search.trim();
    query.$or = [
      { bookingReference: { $regex: cleanSearch, $options: 'i' } },
      { guestName: { $regex: cleanSearch, $options: 'i' } },
      { email: { $regex: cleanSearch, $options: 'i' } },
      { mobile: { $regex: cleanSearch, $options: 'i' } },
    ];
  }

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    BookingRequest.find(query)
      .populate('room', 'name roomType pricePerNight isAc')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    BookingRequest.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}

export async function getBookingRequestById(id) {
  await connectDB();
  const booking = await BookingRequest.findById(id).populate('room').lean();
  if (!booking) {
    throw new NotFoundError('Booking request not found');
  }
  return booking;
}

export async function updateBookingStatus(id, { status, adminNotes = '' }, adminUser) {
  await connectDB();
  const booking = await BookingRequest.findById(id);
  if (!booking) {
    throw new NotFoundError('Booking request not found');
  }

  const oldStatus = booking.status;
  booking.status = status;
  if (adminNotes !== undefined) {
    booking.adminNotes = adminNotes;
  }

  booking.statusHistory.push({
    status,
    changedAt: new Date(),
    changedBy: adminUser.email || 'Admin',
    note: adminNotes || `Status updated from ${oldStatus} to ${status}`,
  });

  await booking.save();

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'BOOKING_STATUS_UPDATE',
    targetModel: 'BookingRequest',
    targetId: booking._id.toString(),
    details: { oldStatus, newStatus: status, adminNotes },
  });

  return booking;
}
