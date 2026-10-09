import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { roomSchema } from '@/backend/validators/room.validator';
import { listPublicRooms, listAdminRooms, createRoom } from '@/backend/services/room.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const GET = handleRoute(async (req) => {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get('admin') === 'true';

  if (isAdmin) {
    await requireAdmin(req);
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 20;
    const includeArchived = searchParams.get('includeArchived') === 'true';
    return listAdminRooms({ page, limit, includeArchived });
  }

  return listPublicRooms();
});

export const POST = handleRoute(async (req) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = roomSchema.parse(sanitized);

  return createRoom(validated, admin);
}, { status: 201 });
