import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { updateResortSchema } from '@/backend/validators/settings.validator';
import { getOrCreateResortContent, updateResortContent } from '@/backend/services/settings.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const GET = handleRoute(async () => {
  return getOrCreateResortContent();
});

export const PUT = handleRoute(async (req) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = updateResortSchema.parse(sanitized);

  return updateResortContent(validated, admin);
});
