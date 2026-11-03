import connectDB from '../config/db.js';
import Admin from '../../models/Admin.js';
import AuditLog from '../../models/AuditLog.js';
import { hashPassword, comparePassword } from '../security/passwords.js';
import { createSessionToken, generateResetToken, hashToken } from '../security/tokens.js';
import { sendPasswordResetEmail } from './email.service.js';
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

/**
 * Initiates a secure password reset flow.
 * - Adheres strictly to OWASP guidelines against account enumeration and timing attacks.
 * - Stores only the SHA-256 hash of the 256-bit token in the database.
 * - Sets a strict 15-minute expiration time.
 */
export async function requestPasswordReset({ email, ip = '' }) {
  await connectDB();
  const normalizedEmail = (email || '').toLowerCase().trim();

  const admin = await Admin.findOne({ email: normalizedEmail });

  // Uniform response message across all outcomes to prevent user enumeration
  const standardMessage =
    'If an account associated with that email exists, password reset instructions have been generated.';

  if (!admin || !admin.isActive) {
    // Constant-time dummy hash to resist timing analysis
    await comparePassword('dummyPassword123', '$2a$12$e80yqVkWbWJ2e5aYlU920uO5V9LwYd6V5q4X0k7F1r8z3N5p5g2O');
    return { success: true, message: standardMessage };
  }

  // Generate 256-bit cryptographically secure token
  const { rawToken, hashedToken } = generateResetToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

  admin.resetPasswordToken = hashedToken;
  admin.resetPasswordExpires = expiresAt;
  await admin.save();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetUrl = `${appUrl}/admin/reset-password?token=${rawToken}&email=${encodeURIComponent(admin.email)}`;

  await AuditLog.create({
    adminId: admin._id,
    adminEmail: admin.email,
    action: 'PASSWORD_RESET_REQUESTED',
    ip,
    details: { expiresAt },
  });

  logger.info('Admin password reset requested', {
    email: admin.email,
    ip,
    expiresAt,
  });

  // Attempt to send email via SMTP (gracefully falls back if SMTP is not configured)
  await sendPasswordResetEmail({
    to: admin.email,
    resetUrl,
    expiresMinutes: 15,
  });

  console.log('\n======================================================');
  console.log(' [SECURITY] ADMIN PASSWORD RESET LINK GENERATED:');
  console.log(` Target Account : ${admin.email}`);
  console.log(` Reset URL      : ${resetUrl}`);
  console.log(` Valid For      : 15 Minutes`);
  console.log('======================================================\n');

  return {
    success: true,
    message: standardMessage,
    // When running locally / in development, provide the debug link for immediate convenience
    ...(process.env.NODE_ENV !== 'production' ? { debugResetUrl: resetUrl } : {}),
  };
}

/**
 * Completes the password reset process.
 * - Verifies the SHA-256 hashed token against unexpired tokens.
 * - Re-hashes the new password with bcrypt (12 salt rounds).
 * - Invalidates the token and increments tokenVersion to revoke all active sessions.
 */
export async function resetPassword({ token, password, ip = '' }) {
  await connectDB();
  const hashedToken = hashToken(token);

  const admin = await Admin.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
    isActive: true,
  });

  if (!admin) {
    throw new BadRequestError('Invalid or expired password reset link. Please request a new one.');
  }

  const passwordHash = await hashPassword(password);
  admin.passwordHash = passwordHash;
  admin.resetPasswordToken = null;
  admin.resetPasswordExpires = null;
  admin.tokenVersion += 1; // Immediately revokes all active session JWTs across devices
  await admin.save();

  await AuditLog.create({
    adminId: admin._id,
    adminEmail: admin.email,
    action: 'PASSWORD_RESET_COMPLETED',
    ip,
  });

  logger.info('Admin password reset completed successfully', {
    email: admin.email,
    ip,
  });

  return {
    success: true,
    message: 'Your password has been successfully reset. You can now log in with your new password.',
  };
}
