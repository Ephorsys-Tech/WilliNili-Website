export function sanitizeNoSql(input) {
  if (input === null || input === undefined) return input;
  if (typeof input !== 'object') return input;

  if (Array.isArray(input)) {
    return input.map(sanitizeNoSql);
  }

  const clean = {};
  for (const [key, value] of Object.entries(input)) {
    // Prevent Prototype Pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    // Prevent NoSQL Injection: reject or strip keys starting with '$'
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    clean[key] = sanitizeNoSql(value);
  }
  return clean;
}

export function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function preventPathTraversal(filename) {
  if (typeof filename !== 'string') return false;
  // Disallow null bytes and traversal sequences
  if (filename.includes('\0') || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false;
  }
  return true;
}
