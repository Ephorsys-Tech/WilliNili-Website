import { SignJWT, jwtVerify } from 'jose';
import { env } from '../config/env.js';

export const SESSION_COOKIE_NAME = 'wn_admin_session';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || env.JWT_SECRET;
  return new TextEncoder().encode(secret);
};

export async function createSessionToken(payload) {
  const key = getSecretKey();
  const maxAge = env.SESSION_MAX_AGE_SECONDS || 86400;

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(key);
}

export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export function getSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: env.SESSION_MAX_AGE_SECONDS || 86400,
  };
}
