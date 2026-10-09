import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { enforceRateLimit } from '@/backend/security/rateLimiter';
import { createEnquirySchema } from '@/backend/validators/enquiry.validator';
import { createEnquiry, listEnquiries } from '@/backend/services/enquiry.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const POST = handleRoute(async (req) => {
  enforceRateLimit(req, { prefix: 'enquiry_sub', max: 20, windowSeconds: 60 });

  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = createEnquirySchema.parse(sanitized);

  return createEnquiry(validated);
}, { status: 201 });

export const GET = handleRoute(async (req) => {
  await requireAdmin(req);

  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 20;
  const type = searchParams.get('type') || '';
  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';

  return listEnquiries({ page, limit, type, status, search });
});
