import mongoose from 'mongoose';

const PlantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plant name is required'],
      trim: true,
      maxlength: 120,
    },
    scientificName: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Fruit Plants',
        'Flowering Plants',
        'Medicinal Plants',
        'Ornamental Plants',
        'Agro Forestry Saplings',
        'Organic Herbs',
        'Other',
      ],
      default: 'Fruit Plants',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    priceBasis: {
      type: String,
      default: 'per sapling',
      trim: true,
    },
    availability: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Pre-order'],
      default: 'In Stock',
    },
    careInstructions: {
      type: String,
      default: 'Requires direct sunlight, regular organic watering, and compost-rich soil.',
    },
    heightSize: {
      type: String,
      default: '1-2 Feet Nursery Pot',
    },
    images: {
      type: [String],
      default: [],
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

PlantSchema.index({ isArchived: 1, category: 1, availability: 1 });

export default mongoose.models.Plant || mongoose.model('Plant', PlantSchema);
