import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { plantSchema } from '@/backend/validators/plant.validator';
import { listPublicPlants, listAdminPlants, createPlant } from '@/backend/services/plant.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const GET = handleRoute(async (req) => {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get('admin') === 'true';

  if (isAdmin) {
    await requireAdmin(req);
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 20;
    const includeArchived = searchParams.get('includeArchived') === 'true';
    return listAdminPlants({ page, limit, includeArchived });
  }

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  return listPublicPlants({ category, search });
});

export const POST = handleRoute(async (req) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = plantSchema.parse(sanitized);

  return createPlant(validated, admin);
}, { status: 201 });
