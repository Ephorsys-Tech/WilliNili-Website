import { NextResponse } from 'next/server';
import { handleRoute } from '@/backend/middleware/routeHandler';
import { enforceRateLimit, getClientIp } from '@/backend/security/rateLimiter';
import { forgotPasswordSchema } from '@/backend/validators/auth.validator';
import { requestPasswordReset } from '@/backend/services/auth.service';

export const POST = handleRoute(async (req) => {
  // Rate limit: 5 requests per 15 minutes per IP to prevent spam and enumeration
  enforceRateLimit(req, {
    prefix: 'forgot_password',
    max: 5,
    windowSeconds: 900,
  });

  const body = await req.json();
  const validated = forgotPasswordSchema.parse(body);
  const ip = getClientIp(req);

  const result = await requestPasswordReset({
    email: validated.email,
    ip,
  });

  return NextResponse.json({
    success: true,
    data: result,
  });
});

