import { NextResponse } from 'next/server';
import { handleRoute } from '@/backend/middleware/routeHandler';
import { enforceRateLimit, getClientIp } from '@/backend/security/rateLimiter';
import { resetPasswordSchema } from '@/backend/validators/auth.validator';
import { resetPassword } from '@/backend/services/auth.service';

export const POST = handleRoute(async (req) => {
  // Rate limit: 5 reset attempts per 15 minutes per IP
  enforceRateLimit(req, {
    prefix: 'reset_password',
    max: 5,
    windowSeconds: 900,
  });

  const body = await req.json();
  const validated = resetPasswordSchema.parse(body);
  const ip = getClientIp(req);

  const result = await resetPassword({
    token: validated.token,
    password: validated.password,
    ip,
  });

  return NextResponse.json({
    success: true,
    data: result,
  });
});

