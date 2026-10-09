import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { updatePlantSchema } from '@/backend/validators/plant.validator';
import { getPublicPlantById, updatePlant, archivePlant } from '@/backend/services/plant.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const GET = handleRoute(async (req, { params }) => {
  return getPublicPlantById(params.id);
});

export const PATCH = handleRoute(async (req, { params }) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = updatePlantSchema.parse(sanitized);

  return updatePlant(params.id, validated, admin);
});

export const DELETE = handleRoute(async (req, { params }) => {
  const admin = await requireAdmin(req);
  return archivePlant(params.id, admin);
});
