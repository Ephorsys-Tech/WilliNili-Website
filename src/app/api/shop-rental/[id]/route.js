import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { updateShopRentalSchema } from '@/backend/validators/shopRental.validator';
import { getPublicShopById, updateShop, archiveShop } from '@/backend/services/shopRental.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const GET = handleRoute(async (req, { params }) => {
  // If module is inactive, throws NotFoundError (PRD requirement)
  return getPublicShopById(params.id);
});

export const PATCH = handleRoute(async (req, { params }) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = updateShopRentalSchema.parse(sanitized);

  return updateShop(params.id, validated, admin);
});

export const DELETE = handleRoute(async (req, { params }) => {
  const admin = await requireAdmin(req);
  return archiveShop(params.id, admin);
});
