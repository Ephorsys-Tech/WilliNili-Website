import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { AppError } from '../errors/AppError.js';
import { logger } from '../logging/logger.js';
import { verifyCsrf } from '../security/csrf.js';

export function handleRoute(handler, options = {}) {
  return async (req, context) => {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();

    try {
      // CSRF check on state-changing requests if requested or by default
      if (options.csrf !== false && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        verifyCsrf(req);
      }

      const res = await handler(req, { ...context, requestId });

      // If handler returns a NextResponse, pass it through while attaching requestId header
      if (res instanceof NextResponse) {
        res.headers.set('X-Request-Id', requestId);
        return res;
      }

      // Default JSON response
      const jsonResponse = NextResponse.json(
        {
          success: true,
          data: res,
          requestId,
        },
        { status: options.status || 200 }
      );

      jsonResponse.headers.set('X-Request-Id', requestId);
      return jsonResponse;
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const isAppError = error instanceof AppError;
      const statusCode = isAppError ? error.statusCode : 500;
      const code = isAppError ? error.code : 'INTERNAL_SERVER_ERROR';

      // Redacted error logging
      logger.error('API Error Encountered', {
        requestId,
        method: req.method,
        url: req.url,
        statusCode,
        code,
        message: error.message,
        durationMs,
        details: isAppError ? error.details : undefined,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      });

      // Safe error message to client: in production, never leak raw internal server errors
      const clientMessage =
        isAppError || process.env.NODE_ENV !== 'production'
          ? error.message
          : 'An unexpected server error occurred. Please try again later.';

      const errorBody = {
        success: false,
        error: {
          code,
          message: clientMessage,
          details: isAppError ? error.details : null,
        },
        requestId,
      };

      const errResponse = NextResponse.json(errorBody, { status: statusCode });
      errResponse.headers.set('X-Request-Id', requestId);
      return errResponse;
    }
  };
}
