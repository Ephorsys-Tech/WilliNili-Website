import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { getDashboardMetrics } from '@/backend/services/dashboard.service';

export const GET = handleRoute(async (req) => {
  await requireAdmin(req);
  return getDashboardMetrics();
});
