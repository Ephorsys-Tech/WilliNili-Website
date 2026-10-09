import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { updateFarmHouseSchema } from '@/backend/validators/settings.validator';
import { getOrCreateFarmHouseContent, updateFarmHouseContent } from '@/backend/services/settings.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const GET = handleRoute(async () => {
  return getOrCreateFarmHouseContent();
});

export const PUT = handleRoute(async (req) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = updateFarmHouseSchema.parse(sanitized);

  return updateFarmHouseContent(validated, admin);
});
