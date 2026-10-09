import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
      maxlength: 120,
    },
    roomType: {
      type: String,
      required: [true, 'Room type is required'],
      enum: ['Single', 'Double', 'Family', 'Deluxe', 'Suite'],
      default: 'Double',
    },
    isAc: {
      type: Boolean,
      default: true,
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price must be positive'],
    },
    priceDisplay: {
      type: Boolean,
      default: true,
    },
    capacityAdults: {
      type: Number,
      required: true,
      default: 2,
      min: 1,
    },
    capacityChildren: {
      type: Number,
      default: 1,
      min: 0,
    },
    bedType: {
      type: String,
      default: 'King Size Bed',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    features: {
      type: [String],
      default: ['Garden View', 'Attached Bathroom', 'Free Wi-Fi', 'Room Service'],
    },
    amenities: {
      type: [String],
      default: ['Hot Water', 'Clean Linens', 'Work Desk', 'Power Backup'],
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

RoomSchema.index({ isArchived: 1, isAvailable: 1, sortOrder: 1 });

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);
