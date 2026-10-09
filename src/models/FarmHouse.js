import mongoose from 'mongoose';

const FarmHouseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Willy Nilly Farm House & Open Event Grounds',
      trim: true,
    },
    description: {
      type: String,
      default:
        'A sprawling, picturesque agro retreat offering expansive open-air lawns, lush orchards, and natural countryside ambience for destination weddings, family celebrations, corporate offsites, and community festivals.',
    },
    propertyArea: {
      type: String,
      default: '8 Acres of Natural Greenery',
    },
    guestCapacity: {
      type: String,
      default: 'Ideal for 50 to 800+ Guests',
    },
    facilities: {
      type: [String],
      default: [
        'Expansive Open Lawns with Natural Canopy',
        'Covered Dining & Banquet Pavilion',
        'Bridal & Guest Dressing Rooms',
        'Ample Secure Vehicle Parking',
        'Dedicated Catering Preparation Yard',
        'Ambient Landscape Lighting & Power Backup',
      ],
    },
    suitableEvents: {
      type: [String],
      default: [
        'Destination Weddings & Sangeet',
        'Reception & Engagement Parties',
        'Birthday & Anniversary Celebrations',
        'Corporate Retreats & Team Outings',
        'Agro Workshops & Family Gatherings',
      ],
    },
    images: {
      type: [String],
      default: [],
    },
    locationGuide: {
      type: String,
      default: 'Conveniently accessible via Highway connecting key urban hubs with tranquil nature surroundings.',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.FarmHouse || mongoose.model('FarmHouse', FarmHouseSchema);
