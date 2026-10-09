import crypto from 'crypto';
import connectDB from '../config/db.js';
import Enquiry from '../../models/Enquiry.js';
import SiteSettings from '../../models/SiteSettings.js';
import Plant from '../../models/Plant.js';
import ShopRental from '../../models/ShopRental.js';
import AuditLog from '../../models/AuditLog.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../errors/AppError.js';

function generateEnquiryRef() {
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `WN-ENQ-${dateStr}-${rand}`;
}

export async function createEnquiry(data) {
  await connectDB();

  // CRITICAL PRD RULE: Shop Rental enquiries are disabled when module is inactive
  if (data.enquiryType === 'ShopRental') {
    const settings = await SiteSettings.findOne().lean();
    if (!settings || !settings.shopRentalActive) {
      throw new ForbiddenError('Shop Rental enquiries are currently not accepting submissions.');
    }
    if (data.shop) {
      const shop = await ShopRental.findById(data.shop);
      if (!shop || shop.isArchived) {
        throw new NotFoundError('Selected shop not found or unavailable');
      }
      data.shopTitle = `${shop.title} (${shop.shopNumber})`;
    }
  }

  if (data.enquiryType === 'Horticulture' && data.plant) {
    const plant = await Plant.findById(data.plant);
    if (plant) {
      data.plantName = plant.name;
    }
  }

  const reference = generateEnquiryRef();

  const enquiry = await Enquiry.create({
    reference,
    enquiryType: data.enquiryType,
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    mobile: data.mobile.trim(),
    message: data.message.trim(),
    eventType: data.eventType || '',
    preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
    expectedGuests: data.expectedGuests ? Number(data.expectedGuests) : null,
    plant: data.plant || null,
    plantName: data.plantName || '',
    plantQuantity: data.plantQuantity ? Number(data.plantQuantity) : null,
    shop: data.shop || null,
    shopTitle: data.shopTitle || '',
    status: 'New',
    statusHistory: [
      {
        status: 'New',
        changedAt: new Date(),
        changedBy: 'Visitor Submission',
        note: `Enquiry submitted for ${data.enquiryType}`,
      },
    ],
  });

  return {
    reference: enquiry.reference,
    enquiryType: enquiry.enquiryType,
    name: enquiry.name,
    createdAt: enquiry.createdAt,
    message: 'Your enquiry has been received. Our team will review your requirements and respond shortly.',
  };
}

export async function listEnquiries({ page = 1, limit = 20, type = '', status = '', search = '' } = {}) {
  await connectDB();

  const query = {};
  if (type) query.enquiryType = type;
  if (status) query.status = status;
  if (search) {
    const cleanSearch = search.trim();
    query.$or = [
      { reference: { $regex: cleanSearch, $options: 'i' } },
      { name: { $regex: cleanSearch, $options: 'i' } },
      { email: { $regex: cleanSearch, $options: 'i' } },
      { mobile: { $regex: cleanSearch, $options: 'i' } },
    ];
  }

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Enquiry.find(query)
      .populate('plant', 'name price')
      .populate('shop', 'title shopNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Enquiry.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}

export async function getEnquiryById(id) {
  await connectDB();
  const enquiry = await Enquiry.findById(id)
    .populate('plant')
    .populate('shop')
    .lean();
  if (!enquiry) {
    throw new NotFoundError('Enquiry not found');
  }
  return enquiry;
}

export async function updateEnquiryStatus(id, { status, adminNotes = '' }, adminUser) {
  await connectDB();
  const enquiry = await Enquiry.findById(id);
  if (!enquiry) {
    throw new NotFoundError('Enquiry not found');
  }

  const oldStatus = enquiry.status;
  enquiry.status = status;
  if (adminNotes !== undefined) {
    enquiry.adminNotes = adminNotes;
  }

  enquiry.statusHistory.push({
    status,
    changedAt: new Date(),
    changedBy: adminUser.email || 'Admin',
    note: adminNotes || `Status changed from ${oldStatus} to ${status}`,
  });

  await enquiry.save();

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'ENQUIRY_STATUS_UPDATE',
    targetModel: 'Enquiry',
    targetId: enquiry._id.toString(),
    details: { oldStatus, newStatus: status, adminNotes },
  });

  return enquiry;
}
