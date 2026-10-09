const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'secret',
  'authorization',
  'cookie',
  'session',
  'jwt',
  'creditcard',
  'cvv',
]);

function redact(data) {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(redact);

  const cleaned = {};
  for (const [key, val] of Object.entries(data)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      cleaned[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null) {
      cleaned[key] = redact(val);
    } else {
      cleaned[key] = val;
    }
  }
  return cleaned;
}

function formatLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const safeMeta = redact(meta);
  const logObj = {
    timestamp,
    level,
    message,
    ...safeMeta,
  };
  return JSON.stringify(logObj);
}

export const logger = {
  info(message, meta) {
    console.log(formatLog('info', message, meta));
  },
  warn(message, meta) {
    console.warn(formatLog('warn', message, meta));
  },
  error(message, meta) {
    console.error(formatLog('error', message, meta));
  },
  debug(message, meta) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatLog('debug', message, meta));
    }
  },
};

export default logger;
