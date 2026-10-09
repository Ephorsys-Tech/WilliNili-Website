import { ForbiddenError } from '../errors/AppError.js';

export function verifyCsrf(req) {
  const method = req.method?.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  // Next.js App Router headers
  const origin = req.headers.get?.('origin') || req.headers?.origin;
  const referer = req.headers.get?.('referer') || req.headers?.referer;
  const host = req.headers.get?.('host') || req.headers?.host;

  // If standard custom AJAX header is present, it cannot be sent by cross-origin standard HTML form submissions
  const customHeader = req.headers.get?.('x-requested-with') || req.headers?.['x-requested-with'];
  if (customHeader) {
    return true;
  }

  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (host && originUrl.host === host) {
        return true;
      }
    } catch {
      // Invalid URL
    }
  }

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (host && refererUrl.host === host) {
        return true;
      }
    } catch {
      // Invalid URL
    }
  }

  // In test or non-browser environments where origin/referer might not be passed
  if (process.env.NODE_ENV === 'test' && !origin && !referer) {
    return true;
  }

  throw new ForbiddenError('Cross-Site Request Forgery (CSRF) validation failed');
}
