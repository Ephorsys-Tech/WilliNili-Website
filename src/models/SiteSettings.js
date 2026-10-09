import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: 'Willy Nilly',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Where Nature Meets Hospitality & Sustainable Agro Living',
      trim: true,
    },
    ownerName: {
      type: String,
      default: 'Mr. Sarat Kumar Singh',
      trim: true,
    },
    ownerTitle: {
      type: String,
      default: 'Founder & Visionary',
      trim: true,
    },
    ownerBio: {
      type: String,
      default:
        'Pioneering sustainable agro tourism and horticulture development in the region, Mr. Sarat Kumar Singh created Willy Nilly to foster close harmony with nature, eco-conscious leisure, and community empowerment.',
      trim: true,
    },
    ownerPhotoUrl: {
      type: String,
      default: '/images/owner-placeholder.jpg',
    },
    aboutStory: {
      type: String,
      default:
        'Nestled amidst lush greenery and fertile soils, Willy Nilly is an agro-tourism retreat and horticulture center dedicated to organic living, tranquil hospitality, and celebration spaces in natural surroundings.',
    },
    vision: {
      type: String,
      default:
        'To be the benchmark agro-tourism destination that enriches lives through sustainable horticulture, serene hospitality, and vibrant natural spaces.',
    },
    mission: {
      type: String,
      default:
        'To provide authentic agro-living experiences, promote eco-friendly horticulture practices, and offer memorable stays and celebrations.',
    },
    highlights: {
      type: [String],
      default: [
        'Scenic agro-tourism campus with lush greenery',
        'Serene guest house accommodations with modern amenities',
        'Expansive open-air farm house grounds for weddings & private events',
        'Curated horticulture plant & sapling nursery',
        'Upcoming luxury eco-resort experience',
      ],
    },
    phonePrimary: {
      type: String,
      default: '+91 98765 43210',
    },
    phoneSecondary: {
      type: String,
      default: '+91 98765 43211',
    },
    emailPrimary: {
      type: String,
      default: 'info@willynilly.in',
    },
    address: {
      type: String,
      default: 'Willy Nilly Agro Campus, Green Valley Road, State Highway, India',
    },
    locationMapUrl: {
      type: String,
      default: 'https://maps.google.com',
    },
    businessHours: {
      type: String,
      default: 'Guest House: 24/7 Check-in | Horticulture Nursery: 8:00 AM – 6:00 PM',
    },
    // CRITICAL PRD REQUIREMENT: Shop Rental is inactive by default
    shopRentalActive: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      enum: ['nature', 'luxury', 'earth', 'ocean'],
      default: 'nature',
    },
    resortLaunchingText: {
      type: String,
      default: 'Launching Soon - Experience Eco-Luxury amidst Nature. Bookings will open upon official inauguration.',
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
