import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Admin from '../../src/models/Admin.js';
import Resort from '../../src/models/Resort.js';
import { requireAdmin } from '../../src/backend/middleware/authMiddleware.js';
import { verifyCsrf } from '../../src/backend/security/csrf.js';
import { createSessionToken } from '../../src/backend/security/tokens.js';
import { hashPassword } from '../../src/backend/security/passwords.js';
import { UnauthorizedError, ForbiddenError } from '../../src/backend/errors/AppError.js';
import { updateResortContent } from '../../src/backend/services/settings.service.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Enterprise API Security Verification (OWASP Top 10 & SANS Top 25)', () => {
  describe('A01: Broken Access Control / SANS CWE-306, CWE-862', () => {
    it('rejects requests with missing session token with 401 Unauthorized', async () => {
      const mockReq = {
        cookies: { get: () => undefined },
        headers: { get: () => undefined },
      };

      await expect(requireAdmin(mockReq)).rejects.toThrow(UnauthorizedError);
    });

    it('rejects requests with tampered or invalid session token', async () => {
      const mockReq = {
        cookies: { get: () => ({ value: 'invalid.tampered.jwttoken' }) },
        headers: { get: () => undefined },
      };

      await expect(requireAdmin(mockReq)).rejects.toThrow(UnauthorizedError);
    });

    it('rejects session when admin account has been deactivated (CWE-285)', async () => {
      const passwordHash = await hashPassword('Password123!');
      const deactivatedAdmin = await Admin.create({
        name: 'Deactivated User',
        email: 'deactivated@willynilly.in',
        passwordHash,
        isActive: false,
      });

      const token = await createSessionToken({
        adminId: deactivatedAdmin._id.toString(),
        email: deactivatedAdmin.email,
        role: 'admin',
        tokenVersion: 0,
      });

      const mockReq = {
        cookies: { get: () => ({ value: token }) },
        headers: { get: () => undefined },
      };

      await expect(requireAdmin(mockReq)).rejects.toThrow(ForbiddenError);
    });

    it('rejects revoked session when tokenVersion in database is incremented', async () => {
      const passwordHash = await hashPassword('Password123!');
      const admin = await Admin.create({
        name: 'Revoked User',
        email: 'revoked@willynilly.in',
        passwordHash,
        tokenVersion: 2, // Database is at version 2
        isActive: true,
      });

      const oldToken = await createSessionToken({
        adminId: admin._id.toString(),
        email: admin.email,
        role: 'admin',
        tokenVersion: 1, // Token created with old version 1
      });

      const mockReq = {
        cookies: { get: () => ({ value: oldToken }) },
        headers: { get: () => undefined },
      };

      await expect(requireAdmin(mockReq)).rejects.toThrow(/Session has been revoked/);
    });
  });

  describe('A04: Insecure Design & Scope Enforcement (PRD Scope Guard)', () => {
    it('guarantees resort bookings remain strictly disabled even if attempted in payload', async () => {
      const adminUser = {
        id: new mongoose.Types.ObjectId().toString(),
        email: 'admin@willynilly.in',
      };

      // Attempt to enable bookings in Resort update
      const updated = await updateResortContent(
        {
          launchMessage: 'Attempting launch',
          bookingEnabled: true, // Malicious / invalid attempt
        },
        adminUser
      );

      // System must forcefully override bookingEnabled to false
      expect(updated.bookingEnabled).toBe(false);

      const stored = await Resort.findOne();
      expect(stored.bookingEnabled).toBe(false);
    });
  });

  describe('A08: Software and Data Integrity Failures / CSRF (SANS CWE-352)', () => {
    it('allows safe HTTP read methods without CSRF restrictions', () => {
      const getReq = { method: 'GET' };
      expect(verifyCsrf(getReq)).toBe(true);
    });

    it('allows mutating requests when custom XMLHttpRequest header is present', () => {
      const postReq = {
        method: 'POST',
        headers: {
          get: (h) => (h.toLowerCase() === 'x-requested-with' ? 'XMLHttpRequest' : undefined),
        },
      };
      expect(verifyCsrf(postReq)).toBe(true);
    });

    it('blocks mutating cross-origin requests when Origin does not match host', () => {
      const crossOriginReq = {
        method: 'POST',
        headers: {
          get: (h) => {
            if (h === 'origin') return 'https://attacker-website.com';
            if (h === 'host') return 'willynilly.in';
            return undefined;
          },
        },
      };
      expect(() => verifyCsrf(crossOriginReq)).toThrow(ForbiddenError);
    });
  });
});
