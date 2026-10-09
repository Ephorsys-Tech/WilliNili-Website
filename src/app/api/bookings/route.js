import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { enforceRateLimit } from '@/backend/security/rateLimiter';
import { createBookingSchema } from '@/backend/validators/booking.validator';
import { createBookingRequest, listBookingRequests } from '@/backend/services/booking.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const POST = handleRoute(async (req) => {
  enforceRateLimit(req, { prefix: 'booking_req', max: 20, windowSeconds: 60 });

  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = createBookingSchema.parse(sanitized);

  return createBookingRequest(validated);
}, { status: 201 });

export const GET = handleRoute(async (req) => {
  await requireAdmin(req);

  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 20;
  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';

  return listBookingRequests({ page, limit, status, search });
});
