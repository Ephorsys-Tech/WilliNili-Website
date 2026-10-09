import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { galleryItemSchema } from '@/backend/validators/gallery.validator';
import { listPublicGallery, listAdminGallery, createGalleryItem } from '@/backend/services/gallery.service';
import { sanitizeNoSql } from '@/backend/security/sanitizer';

export const GET = handleRoute(async (req) => {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get('admin') === 'true';
  const album = searchParams.get('album') || '';

  if (isAdmin) {
    await requireAdmin(req);
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 50;
    return listAdminGallery({ page, limit, album });
  }

  return listPublicGallery({ album });
});

export const POST = handleRoute(async (req) => {
  const admin = await requireAdmin(req);
  const raw = await req.json();
  const sanitized = sanitizeNoSql(raw);
  const validated = galleryItemSchema.parse(sanitized);

  return createGalleryItem(validated, admin);
}, { status: 201 });
