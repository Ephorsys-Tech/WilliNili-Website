import mongoose from 'mongoose';

const BookingRequestSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      maxlength: 20,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [1, 'Guest count must be at least 1'],
    },
    roomsCount: {
      type: Number,
      required: [true, 'Number of rooms is required'],
      min: [1, 'At least 1 room must be requested'],
      default: 1,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Selected room is required'],
    },
    specialRequest: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['New', 'Under Review', 'Confirmed', 'Declined', 'Cancelled'],
      default: 'New',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: String, default: 'System' },
        note: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

BookingRequestSchema.index({ status: 1, createdAt: -1 });
BookingRequestSchema.index({ email: 1 });

export default mongoose.models.BookingRequest || mongoose.model('BookingRequest', BookingRequestSchema);
