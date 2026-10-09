import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../../src/backend/security/passwords.js';
import { createSessionToken, verifySessionToken } from '../../src/backend/security/tokens.js';
import { sanitizeNoSql, preventPathTraversal, escapeHtml } from '../../src/backend/security/sanitizer.js';
import { checkRateLimit, resetRateLimit } from '../../src/backend/security/rateLimiter.js';
import { validateImageBuffer } from '../../src/backend/security/uploads.js';

describe('Security Layer Unit Tests', () => {
  describe('Password Hashing (OWASP A02)', () => {
    it('hashes passwords using bcrypt with salt rounds', async () => {
      const password = 'SuperSecretAgroPass2026!';
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);

      const isValid = await comparePassword(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await comparePassword('WrongPassword', hash);
      expect(isInvalid).toBe(false);
    });

    it('rejects empty or invalid password inputs', async () => {
      await expect(hashPassword('')).rejects.toThrow();
      await expect(hashPassword(null)).rejects.toThrow();
    });
  });

  describe('JWT Session Tokens (OWASP A01 / A07)', () => {
    it('creates and securely verifies JWT session tokens', async () => {
      const payload = {
        adminId: '60d5ecb8b5c0c8001f5e8888',
        email: 'admin@willynilly.in',
        role: 'superadmin',
        tokenVersion: 1,
      };

      const token = await createSessionToken(payload);
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);

      const verified = await verifySessionToken(token);
      expect(verified).not.toBeNull();
      expect(verified.adminId).toBe(payload.adminId);
      expect(verified.email).toBe(payload.email);
      expect(verified.role).toBe(payload.role);
    });

    it('returns null for forged or tampered tokens', async () => {
      const payload = { adminId: '60d5ecb8b5c0c8001f5e8888' };
      const token = await createSessionToken(payload);
      const tampered = token.slice(0, -6) + 'abcdef';

      const verified = await verifySessionToken(tampered);
      expect(verified).toBeNull();
    });
  });

  describe('Input Sanitization & Injection Prevention (OWASP A03 / SANS CWE-89/943)', () => {
    it('strips NoSQL injection operator keys starting with $', () => {
      const maliciousPayload = {
        username: 'admin',
        password: { $gt: '' },
        filter: { $where: 'sleep(1000)' },
        details: {
          subQuery: { $ne: null },
          normalField: 'cleanValue',
        },
      };

      const sanitized = sanitizeNoSql(maliciousPayload);

      expect(sanitized.password).toEqual({});
      expect(sanitized.filter).toEqual({});
      expect(sanitized.details.subQuery).toEqual({});
      expect(sanitized.details.normalField).toBe('cleanValue');
      expect(sanitized.username).toBe('admin');
    });

    it('prevents Prototype Pollution gadget injection', () => {
      const payload = JSON.parse('{"__proto__": {"isAdmin": true}, "constructor": {"evil": true}, "safe": "val"}');

      const sanitized = sanitizeNoSql(payload);
      expect(sanitized.safe).toBe('val');
      expect(Object.prototype.hasOwnProperty.call(sanitized, 'constructor')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(sanitized, '__proto__')).toBe(false);
      expect(Object.prototype.isAdmin).toBeUndefined();
      expect(Object.prototype.evil).toBeUndefined();
    });

    it('detects and blocks path traversal sequences (SANS CWE-22)', () => {
      expect(preventPathTraversal('../../etc/passwd')).toBe(false);
      expect(preventPathTraversal('..\\windows\\system32')).toBe(false);
      expect(preventPathTraversal('normal-photo-123.jpg')).toBe(true);
      expect(preventPathTraversal('photo\0.png')).toBe(false);
    });

    it('escapes dangerous HTML/XSS special characters (OWASP A03)', () => {
      const xss = '<script>alert("XSS")</script>&"test"';
      const escaped = escapeHtml(xss);
      expect(escaped).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;&amp;&quot;test&quot;');
    });
  });

  describe('Sliding Window Rate Limiter (OWASP A04 / A07)', () => {
    it('enforces request boundaries and increments counter accurately', () => {
      const key = 'test-ip-rate-limit';
      resetRateLimit(key);

      const r1 = checkRateLimit({ key, max: 3, windowSeconds: 60 });
      expect(r1.allowed).toBe(true);
      expect(r1.remaining).toBe(2);

      const r2 = checkRateLimit({ key, max: 3, windowSeconds: 60 });
      expect(r2.allowed).toBe(true);
      expect(r2.remaining).toBe(1);

      const r3 = checkRateLimit({ key, max: 3, windowSeconds: 60 });
      expect(r3.allowed).toBe(true);
      expect(r3.remaining).toBe(0);

      const r4 = checkRateLimit({ key, max: 3, windowSeconds: 60 });
      expect(r4.allowed).toBe(false);
      expect(r4.retryAfter).toBeGreaterThan(0);

      resetRateLimit(key);
    });
  });

  describe('Upload Signature & Magic Bytes Validation (OWASP A08)', () => {
    it('accepts authentic JPEG, PNG, and WebP buffers', () => {
      // JPEG Magic bytes: FF D8 FF
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
      expect(validateImageBuffer(jpegBuffer)).toBe('image/jpeg');

      // PNG Magic bytes: 89 50 4E 47
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
      expect(validateImageBuffer(pngBuffer)).toBe('image/png');

      // WEBP Magic bytes: RIFF .... WEBP
      const webpBuffer = Buffer.from('RIFF1234WEBP9999');
      expect(validateImageBuffer(webpBuffer)).toBe('image/webp');
    });

    it('rejects executable scripts or forged files disguised as images', () => {
      const phpScript = Buffer.from('<?php echo "evil"; ?>');
      expect(() => validateImageBuffer(phpScript)).toThrow(/Invalid file signature/);

      const bashScript = Buffer.from('#!/bin/bash\nrm -rf /');
      expect(() => validateImageBuffer(bashScript)).toThrow();
    });
  });
});
