import mongoose from 'mongoose';

const GalleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 120,
    },
    album: {
      type: String,
      required: [true, 'Album/Category is required'],
      enum: [
        'Guest House',
        'Farm House',
        'Events',
        'Resort',
        'Horticulture',
        'Property',
        'Celebrations',
        'General',
      ],
      default: 'General',
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    caption: {
      type: String,
      default: '',
      maxlength: 300,
    },
    isPublic: {
      type: Boolean,
      default: true,
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

GalleryItemSchema.index({ isPublic: 1, album: 1, sortOrder: 1 });

export default mongoose.models.GalleryItem || mongoose.model('GalleryItem', GalleryItemSchema);
