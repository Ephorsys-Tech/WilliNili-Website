import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { updateBookingStatusSchema } from '@/backend/validators/booking.validator';
import { getBookingRequestById, updateBookingStatus } from '@/backend/services/booking.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const GET = handleRoute(async (req, { params }) => {
  await requireAdmin(req);
  return getBookingRequestById(params.id);
});

export const PATCH = handleRoute(async (req, { params }) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = updateBookingStatusSchema.parse(sanitized);

  return updateBookingStatus(params.id, validated, admin);
});
