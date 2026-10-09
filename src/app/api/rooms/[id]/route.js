import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { updateRoomSchema } from '@/backend/validators/room.validator';
import { getPublicRoomById, updateRoom, archiveRoom } from '@/backend/services/room.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const GET = handleRoute(async (req, { params }) => {
  return getPublicRoomById(params.id);
});

export const PATCH = handleRoute(async (req, { params }) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = updateRoomSchema.parse(sanitized);

  return updateRoom(params.id, validated, admin);
});

export const DELETE = handleRoute(async (req, { params }) => {
  const admin = await requireAdmin(req);
  return archiveRoom(params.id, admin);
});
