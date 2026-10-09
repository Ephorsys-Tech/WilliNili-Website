import { NextResponse } from 'next/server';
import { handleRoute } from '@/backend/middleware/routeHandler';
import { enforceRateLimit, getClientIp } from '@/backend/security/rateLimiter';
import { loginSchema } from '@/backend/validators/auth.validator';
import { login } from '@/backend/services/auth.service';
import { getSessionCookieOptions } from '@/backend/security/tokens';
import { env } from '@/backend/config/env';

export const POST = handleRoute(async (req) => {
  // Rate limit: 5 attempts per 5 mins per IP to prevent brute-force attacks
  enforceRateLimit(req, {
    prefix: 'login',
    max: env.RATE_LIMIT_LOGIN_MAX || 5,
    windowSeconds: env.RATE_LIMIT_LOGIN_WINDOW_SECONDS || 300,
  });

  const body = await req.json();
  const validated = loginSchema.parse(body);
  const ip = getClientIp(req);

  const result = await login({
    email: validated.email,
    password: validated.password,
    ip,
  });

  const response = NextResponse.json({
    success: true,
    data: {
      admin: result.admin,
      message: 'Logged in successfully',
    },
  });

  // Set secure HttpOnly cookie
  const cookieOpts = getSessionCookieOptions();
  response.cookies.set(cookieOpts.name, result.token, cookieOpts);

  return response;
});
