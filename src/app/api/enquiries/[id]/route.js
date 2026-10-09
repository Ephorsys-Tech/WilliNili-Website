import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { updateEnquiryStatusSchema } from '@/backend/validators/enquiry.validator';
import { getEnquiryById, updateEnquiryStatus } from '@/backend/services/enquiry.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const GET = handleRoute(async (req, { params }) => {
  await requireAdmin(req);
  return getEnquiryById(params.id);
});

export const PATCH = handleRoute(async (req, { params }) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = updateEnquiryStatusSchema.parse(sanitized);

  return updateEnquiryStatus(params.id, validated, admin);
});
