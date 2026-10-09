import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';

export const GET = handleRoute(async (req) => {
  const admin = await requireAdmin(req);
  return { admin };
});
