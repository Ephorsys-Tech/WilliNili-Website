import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { updateSiteSettingsSchema } from '@/backend/validators/settings.validator';
import { getPublicSettings, updateSiteSettings } from '@/backend/services/settings.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const GET = handleRoute(async () => {
  return getPublicSettings();
});

export const PUT = handleRoute(async (req) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = updateSiteSettingsSchema.parse(sanitized);

  return updateSiteSettings(validated, admin);
});
