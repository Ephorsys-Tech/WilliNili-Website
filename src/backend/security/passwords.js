import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(plainTextPassword) {
  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
}

export async function comparePassword(plainTextPassword, hashedPassword) {
  if (!plainTextPassword || !hashedPassword) {
    return false;
  }
  return bcrypt.compare(plainTextPassword, hashedPassword);
}
