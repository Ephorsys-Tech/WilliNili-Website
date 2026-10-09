import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { updateGalleryItemSchema } from '@/backend/validators/gallery.validator';
import { updateGalleryItem, deleteGalleryItem } from '@/backend/services/gallery.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const PATCH = handleRoute(async (req, { params }) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = updateGalleryItemSchema.parse(sanitized);

  return updateGalleryItem(params.id, validated, admin);
});

export const DELETE = handleRoute(async (req, { params }) => {
  const admin = await requireAdmin(req);
  return deleteGalleryItem(params.id, admin);
});
