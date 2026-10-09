import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { shopRentalSchema } from '@/backend/validators/shopRental.validator';
import { listPublicShops, listAdminShops, createShop } from '@/backend/services/shopRental.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const GET = handleRoute(async (req) => {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get('admin') === 'true';

  if (isAdmin) {
    await requireAdmin(req);
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 20;
    const includeArchived = searchParams.get('includeArchived') === 'true';
    return listAdminShops({ page, limit, includeArchived });
  }

  // PRD: Inactive by default. If inactive, throws NotFoundError
  return listPublicShops();
});

export const POST = handleRoute(async (req) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = shopRentalSchema.parse(sanitized);

  return createShop(validated, admin);
}, { status: 201 });
