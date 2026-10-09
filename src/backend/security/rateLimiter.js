import { RateLimitError } from '../errors/AppError.js';

const rateLimitStore = new Map();

// Periodic cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

export function getClientIp(req) {
  const forwarded = req.headers.get?.('x-forwarded-for') || req.headers?.['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get?.('x-real-ip') || req.headers?.['x-real-ip'];
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export function checkRateLimit({ key, max, windowSeconds }) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let record = rateLimitStore.get(key);

  if (!record || record.resetAt <= now) {
    record = { count: 1, resetAt: now + windowMs };
    rateLimitStore.set(key, record);
    return {
      allowed: true,
      remaining: max - 1,
      resetAt: record.resetAt,
    };
  }

  if (record.count >= max) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
      retryAfter,
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: max - record.count,
    resetAt: record.resetAt,
  };
}

export function enforceRateLimit(req, { prefix = 'rate', max = 60, windowSeconds = 60 }) {
  const ip = getClientIp(req);
  const key = `${prefix}:${ip}`;
  const result = checkRateLimit({ key, max, windowSeconds });

  if (!result.allowed) {
    throw new RateLimitError(`Too many requests. Please try again in ${result.retryAfter} seconds.`, {
      retryAfter: result.retryAfter,
    });
  }

  return result;
}

export function resetRateLimit(key) {
  rateLimitStore.delete(key);
}
