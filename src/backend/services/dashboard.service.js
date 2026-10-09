import connectDB from '../config/db.js';
import BookingRequest from '../../models/BookingRequest.js';
import Enquiry from '../../models/Enquiry.js';
import Room from '../../models/Room.js';
import Plant from '../../models/Plant.js';
import ShopRental from '../../models/ShopRental.js';
import GalleryItem from '../../models/GalleryItem.js';
import SiteSettings from '../../models/SiteSettings.js';

export async function getDashboardMetrics() {
  await connectDB();

  const [
    newBookingsCount,
    totalBookingsCount,
    newEnquiriesCount,
    totalEnquiriesCount,
    activeRoomsCount,
    activePlantsCount,
    activeShopsCount,
    galleryCount,
    settings,
    recentBookings,
    recentEnquiries,
  ] = await Promise.all([
    BookingRequest.countDocuments({ status: 'New' }),
    BookingRequest.countDocuments(),
    Enquiry.countDocuments({ status: 'New' }),
    Enquiry.countDocuments(),
    Room.countDocuments({ isArchived: false, isAvailable: true }),
    Plant.countDocuments({ isArchived: false }),
    ShopRental.countDocuments({ isArchived: false, isAvailable: true }),
    GalleryItem.countDocuments({ isPublic: true }),
    SiteSettings.findOne().lean(),
    BookingRequest.find()
      .populate('room', 'name pricePerNight')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return {
    metrics: {
      newBookingsCount,
      totalBookingsCount,
      newEnquiriesCount,
      totalEnquiriesCount,
      activeRoomsCount,
      activePlantsCount,
      activeShopsCount,
      galleryCount,
      shopRentalActive: Boolean(settings?.shopRentalActive),
    },
    recentBookings,
    recentEnquiries,
  };
}
