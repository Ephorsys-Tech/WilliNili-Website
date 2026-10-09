import connectDB from '../config/db.js';
import Admin from '../../models/Admin.js';
import AuditLog from '../../models/AuditLog.js';
import { hashPassword, comparePassword } from '../security/passwords.js';
import { createSessionToken } from '../security/tokens.js';
import { UnauthorizedError, BadRequestError, ConflictError } from '../errors/AppError.js';
import { logger } from '../logging/logger.js';

export async function login({ email, password, ip = '' }) {
  await connectDB();
  const normalizedEmail = email.toLowerCase().trim();

  const admin = await Admin.findOne({ email: normalizedEmail });
  if (!admin) {
    // Constant time-ish delay or generic message to prevent account enumeration
    await comparePassword('dummyPassword123', '$2a$12$e80yqVkWbWJ2e5aYlU920uO5V9LwYd6V5q4X0k7F1r8z3N5p5g2O');
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!admin.isActive) {
    throw new UnauthorizedError('This administrator account has been disabled.');
  }

  const isValid = await comparePassword(password, admin.passwordHash);
  if (!isValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = await createSessionToken({
    adminId: admin._id.toString(),
    email: admin.email,
    role: admin.role,
    tokenVersion: admin.tokenVersion,
  });

  await AuditLog.create({
    adminId: admin._id,
    adminEmail: admin.email,
    action: 'ADMIN_LOGIN',
    ip,
    details: { timestamp: new Date() },
  });

  logger.info('Admin logged in successfully', { email: admin.email, ip });

  return {
    token,
    admin: {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
}

export async function logout({ adminId, ip = '' }) {
  if (adminId) {
    await connectDB();
    await AuditLog.create({
      adminId,
      action: 'ADMIN_LOGOUT',
      ip,
    });
  }
  return { success: true };
}

export async function getSession(adminId) {
  await connectDB();
  const admin = await Admin.findById(adminId).select('-passwordHash').lean();
  if (!admin || !admin.isActive) {
    throw new UnauthorizedError('Admin session invalid or expired');
  }
  return {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
    role: admin.role,
    lastLoginAt: admin.lastLoginAt,
  };
}

export async function createInitialAdmin({ name, email, password, role = 'admin' }) {
  await connectDB();
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await Admin.findOne({ email: normalizedEmail });
  if (existing) {
    throw new ConflictError('Admin with this email already exists');
  }

  const passwordHash = await hashPassword(password);
  const admin = await Admin.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role,
    isActive: true,
  });

  return {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
}
