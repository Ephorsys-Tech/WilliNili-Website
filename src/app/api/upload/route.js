import { handleRoute } from '@/backend/middleware/routeHandler';
import { requireAdmin } from '@/backend/middleware/authMiddleware';
import { saveSecureImage } from '@/backend/security/uploads';
import { BadRequestError } from '@/backend/errors/AppError';

export const POST = handleRoute(async (req) => {
  await requireAdmin(req);

  const formData = await req.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    throw new BadRequestError('No file provided in form data with field name "file"');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return saveSecureImage(buffer, file.name);
}, { status: 201 });
