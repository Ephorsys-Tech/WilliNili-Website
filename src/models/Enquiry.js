import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    enquiryType: {
      type: String,
      required: [true, 'Enquiry type is required'],
      enum: ['FarmHouse', 'Horticulture', 'ShopRental', 'General', 'Contact'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
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
    message: {
      type: String,
      required: [true, 'Message/requirements is required'],
      maxlength: 2000,
    },
    // FarmHouse Event specific
    eventType: {
      type: String,
      default: '',
    },
    preferredDate: {
      type: Date,
      default: null,
    },
    expectedGuests: {
      type: Number,
      default: null,
    },
    // Horticulture specific
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      default: null,
    },
    plantName: {
      type: String,
      default: '',
    },
    plantQuantity: {
      type: Number,
      default: null,
    },
    // ShopRental specific
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShopRental',
      default: null,
    },
    shopTitle: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Closed', 'Archived'],
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

EnquirySchema.index({ enquiryType: 1, status: 1, createdAt: -1 });
EnquirySchema.index({ email: 1 });

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
