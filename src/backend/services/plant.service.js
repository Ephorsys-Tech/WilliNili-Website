import connectDB from '../config/db.js';
import Plant from '../../models/Plant.js';
import AuditLog from '../../models/AuditLog.js';
import { NotFoundError } from '../errors/AppError.js';

export async function listPublicPlants({ category = '', search = '' } = {}) {
  await connectDB();
  const query = { isArchived: false };
  if (category) {
    query.category = category;
  }
  if (search) {
    const clean = search.trim();
    query.$or = [
      { name: { $regex: clean, $options: 'i' } },
      { scientificName: { $regex: clean, $options: 'i' } },
      { description: { $regex: clean, $options: 'i' } },
    ];
  }

  return Plant.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
}

export async function getPublicPlantById(id) {
  await connectDB();
  const plant = await Plant.findOne({ _id: id, isArchived: false }).lean();
  if (!plant) {
    throw new NotFoundError('Plant listing not found');
  }
  return plant;
}

export async function listAdminPlants({ page = 1, limit = 20, includeArchived = false } = {}) {
  await connectDB();
  const query = {};
  if (!includeArchived) {
    query.isArchived = false;
  }

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Plant.find(query).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
    Plant.countDocuments(query),
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

export async function createPlant(data, adminUser) {
  await connectDB();
  const plant = await Plant.create(data);

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'PLANT_CREATE',
    targetModel: 'Plant',
    targetId: plant._id.toString(),
    details: { name: plant.name, category: plant.category, price: plant.price },
  });

  return plant;
}

export async function updatePlant(id, data, adminUser) {
  await connectDB();
  const plant = await Plant.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!plant) {
    throw new NotFoundError('Plant not found');
  }

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'PLANT_UPDATE',
    targetModel: 'Plant',
    targetId: plant._id.toString(),
    details: data,
  });

  return plant;
}

export async function archivePlant(id, adminUser) {
  await connectDB();
  const plant = await Plant.findByIdAndUpdate(id, { $set: { isArchived: true } }, { new: true });
  if (!plant) {
    throw new NotFoundError('Plant not found');
  }

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'PLANT_ARCHIVE',
    targetModel: 'Plant',
    targetId: plant._id.toString(),
  });

  return plant;
}
