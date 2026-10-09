import mongoose from 'mongoose';

const ShopRentalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Shop title is required'],
      trim: true,
      maxlength: 120,
    },
    shopNumber: {
      type: String,
      required: [true, 'Shop number/identifier is required'],
      trim: true,
    },
    sizeSqFt: {
      type: Number,
      required: [true, 'Size in square feet is required'],
      min: [10, 'Size must be at least 10 sq ft'],
    },
    rentAmount: {
      type: Number,
      required: [true, 'Rent amount is required'],
      min: [0, 'Rent amount must be non-negative'],
    },
    rentPeriod: {
      type: String,
      enum: ['Monthly', 'Quarterly', 'Annual'],
      default: 'Monthly',
    },
    location: {
      type: String,
      required: [true, 'Location details are required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    facilities: {
      type: [String],
      default: ['Shutter Door', 'Electricity Connection', 'Front Paved Road', 'Shared Restroom'],
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

ShopRentalSchema.index({ isArchived: 1, isAvailable: 1 });

export default mongoose.models.ShopRental || mongoose.model('ShopRental', ShopRentalSchema);
