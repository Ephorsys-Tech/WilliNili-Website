import connectDB from '../config/db.js';
import ShopRental from '../../models/ShopRental.js';
import SiteSettings from '../../models/SiteSettings.js';
import AuditLog from '../../models/AuditLog.js';
import { NotFoundError, ForbiddenError } from '../errors/AppError.js';

export async function isShopRentalActive() {
  await connectDB();
  const settings = await SiteSettings.findOne().lean();
  return Boolean(settings?.shopRentalActive);
}

export async function listPublicShops() {
  const active = await isShopRentalActive();
  if (!active) {
    throw new NotFoundError('Shop rental module is not currently active');
  }

  return ShopRental.find({ isArchived: false, isAvailable: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
}

export async function getPublicShopById(id) {
  const active = await isShopRentalActive();
  if (!active) {
    throw new NotFoundError('Shop rental module is not currently active');
  }

  const shop = await ShopRental.findOne({ _id: id, isArchived: false }).lean();
  if (!shop) {
    throw new NotFoundError('Shop listing not found');
  }
  return shop;
}

export async function listAdminShops({ page = 1, limit = 20, includeArchived = false } = {}) {
  await connectDB();
  const query = {};
  if (!includeArchived) {
    query.isArchived = false;
  }

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (safePage - 1) * safeLimit;

  const [items, total, settings] = await Promise.all([
    ShopRental.find(query).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
    ShopRental.countDocuments(query),
    SiteSettings.findOne().select('shopRentalActive').lean(),
  ]);

  return {
    items,
    isModuleActive: Boolean(settings?.shopRentalActive),
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}

export async function toggleModuleActivation(isActive, adminUser) {
  await connectDB();
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({ shopRentalActive: Boolean(isActive) });
  } else {
    settings.shopRentalActive = Boolean(isActive);
    await settings.save();
  }

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'SHOP_RENTAL_MODULE_TOGGLE',
    targetModel: 'SiteSettings',
    targetId: settings._id.toString(),
    details: { shopRentalActive: settings.shopRentalActive },
  });

  return { shopRentalActive: settings.shopRentalActive };
}

export async function createShop(data, adminUser) {
  await connectDB();
  const shop = await ShopRental.create(data);

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'SHOP_CREATE',
    targetModel: 'ShopRental',
    targetId: shop._id.toString(),
    details: { title: shop.title, shopNumber: shop.shopNumber, rentAmount: shop.rentAmount },
  });

  return shop;
}

export async function updateShop(id, data, adminUser) {
  await connectDB();
  const shop = await ShopRental.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!shop) {
    throw new NotFoundError('Shop listing not found');
  }

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'SHOP_UPDATE',
    targetModel: 'ShopRental',
    targetId: shop._id.toString(),
    details: data,
  });

  return shop;
}

export async function archiveShop(id, adminUser) {
  await connectDB();
  const shop = await ShopRental.findByIdAndUpdate(id, { $set: { isArchived: true, isAvailable: false } }, { new: true });
  if (!shop) {
    throw new NotFoundError('Shop listing not found');
  }

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'SHOP_ARCHIVE',
    targetModel: 'ShopRental',
    targetId: shop._id.toString(),
  });

  return shop;
}
