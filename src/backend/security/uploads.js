import path from 'path';
import crypto from 'crypto';
import fs from 'fs/promises';
import { BadRequestError } from '../errors/AppError.js';
import { env } from '../config/env.js';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const MAGIC_NUMBERS = {
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
  webp: [0x52, 0x49, 0x46, 0x46], // 'RIFF'
};

export function validateImageBuffer(buffer) {
  if (!buffer || buffer.length < 12) {
    throw new BadRequestError('Uploaded file is too small or invalid');
  }

  // Check JPEG
  if (
    buffer[0] === MAGIC_NUMBERS.jpeg[0] &&
    buffer[1] === MAGIC_NUMBERS.jpeg[1] &&
    buffer[2] === MAGIC_NUMBERS.jpeg[2]
  ) {
    return 'image/jpeg';
  }

  // Check PNG
  if (
    buffer[0] === MAGIC_NUMBERS.png[0] &&
    buffer[1] === MAGIC_NUMBERS.png[1] &&
    buffer[2] === MAGIC_NUMBERS.png[2] &&
    buffer[3] === MAGIC_NUMBERS.png[3]
  ) {
    return 'image/png';
  }

  // Check WEBP (starts with 'RIFF' and bytes 8..11 is 'WEBP')
  if (
    buffer[0] === MAGIC_NUMBERS.webp[0] &&
    buffer[1] === MAGIC_NUMBERS.webp[1] &&
    buffer[2] === MAGIC_NUMBERS.webp[2] &&
    buffer[3] === MAGIC_NUMBERS.webp[3]
  ) {
    const webpTag = buffer.toString('ascii', 8, 12);
    if (webpTag === 'WEBP') {
      return 'image/webp';
    }
  }

  throw new BadRequestError('Invalid file signature. Only authentic JPEG, PNG, and WebP images are permitted.');
}

export async function saveSecureImage(fileBuffer, originalFilename = '') {
  const maxBytes = env.UPLOAD_MAX_BYTES || 5242880;
  if (fileBuffer.length > maxBytes) {
    throw new BadRequestError(`File size exceeds limit of ${Math.round(maxBytes / 1024 / 1024)}MB`);
  }

  const detectedMime = validateImageBuffer(fileBuffer);

  let ext = '.jpg';
  if (detectedMime === 'image/png') ext = '.png';
  if (detectedMime === 'image/webp') ext = '.webp';

  const randomName = `${crypto.randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  await fs.mkdir(uploadDir, { recursive: true });
  const finalPath = path.join(uploadDir, randomName);
  await fs.writeFile(finalPath, fileBuffer);

  return {
    url: `/uploads/${randomName}`,
    filename: randomName,
    mimeType: detectedMime,
    size: fileBuffer.length,
  };
}
