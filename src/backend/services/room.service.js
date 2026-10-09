import connectDB from '../config/db.js';
import Room from '../../models/Room.js';
import AuditLog from '../../models/AuditLog.js';
import { NotFoundError } from '../errors/AppError.js';

export async function listPublicRooms() {
  await connectDB();
  return Room.find({ isArchived: false, isAvailable: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
}

export async function getPublicRoomById(id) {
  await connectDB();
  const room = await Room.findOne({ _id: id, isArchived: false }).lean();
  if (!room) {
    throw new NotFoundError('Room not found or no longer active');
  }
  return room;
}

export async function listAdminRooms({ page = 1, limit = 20, includeArchived = false } = {}) {
  await connectDB();
  const query = {};
  if (!includeArchived) {
    query.isArchived = false;
  }

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Room.find(query).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
    Room.countDocuments(query),
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

export async function createRoom(data, adminUser) {
  await connectDB();
  const room = await Room.create(data);

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'ROOM_CREATE',
    targetModel: 'Room',
    targetId: room._id.toString(),
    details: { name: room.name, roomType: room.roomType, pricePerNight: room.pricePerNight },
  });

  return room;
}

export async function updateRoom(id, data, adminUser) {
  await connectDB();
  const room = await Room.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!room) {
    throw new NotFoundError('Room not found');
  }

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'ROOM_UPDATE',
    targetModel: 'Room',
    targetId: room._id.toString(),
    details: data,
  });

  return room;
}

export async function archiveRoom(id, adminUser) {
  await connectDB();
  const room = await Room.findByIdAndUpdate(id, { $set: { isArchived: true, isAvailable: false } }, { new: true });
  if (!room) {
    throw new NotFoundError('Room not found');
  }

  await AuditLog.create({
    adminId: adminUser.id,
    adminEmail: adminUser.email,
    action: 'ROOM_ARCHIVE',
    targetModel: 'Room',
    targetId: room._id.toString(),
  });

  return room;
}
