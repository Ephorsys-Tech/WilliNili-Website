import { NextResponse } from 'next/server';
import { handleRoute } from '@/backend/middleware/routeHandler';
import { logout } from '@/backend/services/auth.service';
import { SESSION_COOKIE_NAME, getSessionCookieOptions } from '@/backend/security/tokens';
import { getClientIp } from '@/backend/security/rateLimiter';

export const POST = handleRoute(async (req) => {
  const ip = getClientIp(req);
  await logout({ ip });

  const response = NextResponse.json({
    success: true,
    data: { message: 'Logged out successfully' },
  });

  // Clear session cookie
  const cookieOpts = getSessionCookieOptions();
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...cookieOpts,
    maxAge: 0,
  });

  return response;
});
