import connectDB from '../config/db.js';
import GalleryItem from '../../models/GalleryItem.js';
import AuditLog from '../../models/AuditLog.js';
import { NotFoundError } from '../errors/AppError.js';

export async function listPublicGallery({ album = '' } = {}) {
  await connectDB();
  const query = { isPublic: true };
  if (album && album !== 'All') {
    query.album = album;
  }
  return GalleryItem.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
}

export async function listAdminGallery({ page = 1, limit = 50, album = '' } = {}) {
  await connectDB();
  const query = {};
  if (album && album !== 'All') {
    query.album = album;
  }

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    GalleryItem.find(query).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
    GalleryItem.countDocuments(query),
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

export async function createGalleryItem(data, adminUser) {
  await connectDB();
  const item = await GalleryItem.create(data);

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'GALLERY_ITEM_CREATE',
    targetModel: 'GalleryItem',
    targetId: item._id.toString(),
    details: { title: item.title, album: item.album },
  });

  return item;
}

export async function updateGalleryItem(id, data, adminUser) {
  await connectDB();
  const item = await GalleryItem.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!item) {
    throw new NotFoundError('Gallery image not found');
  }

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'GALLERY_ITEM_UPDATE',
    targetModel: 'GalleryItem',
    targetId: item._id.toString(),
    details: data,
  });

  return item;
}

export async function deleteGalleryItem(id, adminUser) {
  await connectDB();
  const item = await GalleryItem.findByIdAndDelete(id);
  if (!item) {
    throw new NotFoundError('Gallery image not found');
  }

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'GALLERY_ITEM_DELETE',
    targetModel: 'GalleryItem',
    targetId: id,
    details: { title: item.title, album: item.album },
  });

  return { success: true };
}
