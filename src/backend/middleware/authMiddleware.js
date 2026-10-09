import { verifySessionToken, SESSION_COOKIE_NAME } from '../security/tokens.js';
import { UnauthorizedError, ForbiddenError } from '../errors/AppError.js';
import connectDB from '../config/db.js';
import Admin from '../../models/Admin.js';

export async function requireAdmin(req) {
  let token = null;

  // 1. Check HttpOnly cookie
  if (req.cookies && typeof req.cookies.get === 'function') {
    const cookie = req.cookies.get(SESSION_COOKIE_NAME);
    if (cookie?.value) token = cookie.value;
  } else if (req.headers) {
    const cookieHeader = req.headers.get?.('cookie') || req.headers?.cookie;
    if (cookieHeader) {
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
      if (match) token = match[1];
    }
  }

  // 2. Check Authorization header
  if (!token) {
    const authHeader = req.headers.get?.('authorization') || req.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    throw new UnauthorizedError('Authentication required. No active session token found.');
  }

  const payload = await verifySessionToken(token);
  if (!payload || !payload.adminId) {
    throw new UnauthorizedError('Session expired or invalid token.');
  }

  await connectDB();
  const admin = await Admin.findById(payload.adminId).lean();

  if (!admin || !admin.isActive) {
    throw new ForbiddenError('Administrator account not found or has been deactivated.');
  }

  // Enforce session revocation via tokenVersion
  if (payload.tokenVersion !== undefined && admin.tokenVersion !== payload.tokenVersion) {
    throw new UnauthorizedError('Session has been revoked. Please log in again.');
  }

  return {
    id: admin._id.toString(),
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
}
