import { z } from 'zod';
import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { toggleModuleActivation } from '@/backend/services/shopRental.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

const toggleSchema = z.object({
  active: z.boolean(),
});

export const POST = handleRoute(async (req) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = toggleSchema.parse(sanitized);

  return toggleModuleActivation(validated.active, admin);
});
