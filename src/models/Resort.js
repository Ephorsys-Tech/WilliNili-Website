import mongoose from 'mongoose';

const ResortSchema = new mongoose.Schema(
  {
    resortName: {
      type: String,
      default: 'Willy Nilly Eco Resort',
      trim: true,
    },
    launchStatus: {
      type: String,
      default: 'Launching Soon',
    },
    launchMessage: {
      type: String,
      default:
        'Our premier eco-luxury resort is currently under master planned development. Online booking is strictly disabled until official grand inauguration.',
    },
    conceptDescription: {
      type: String,
      default:
        'A sanctuary where rustic agro charm meets sustainable modern luxury. Featuring bio-climatic private villas, natural pools, Ayurvedic wellness center, organic farm-to-table fine dining, and serene nature trails.',
    },
    featuresPlanned: {
      type: [String],
      default: [
        'Private Luxury Eco Cottages & Tree Villas',
        'Natural Chemical-Free Swimming Lagoon',
        'Ayurvedic Wellness & Yoga Pavilion',
        'Farm-to-Fork Organic Dining Restaurant',
        'Guided Agro & Bird Watching Trails',
      ],
    },
    images: {
      type: [String],
      default: [],
    },
    // Strictly false in MVP - PRD scope boundary
    bookingEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Resort || mongoose.model('Resort', ResortSchema);
