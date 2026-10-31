import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';

// Configure Cloudinary if credentials are present
const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  env.CLOUDINARY_CLOUD_NAME ||
  env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET || env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(
  cloudName && apiKey && apiSecret &&
  cloudName.trim() !== '' &&
  apiKey.trim() !== '' &&
  apiSecret.trim() !== ''
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * Upload an image buffer directly to Cloudinary using upload_stream
 * @param {Buffer} buffer - File buffer
 * @param {Object} options - Upload options (folder, tags, transformations)
 * @returns {Promise<Object>}
 */
export async function uploadToCloudinary(buffer, options = {}) {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary is not configured with active credentials');
  }

  const folder = options.folder || env.CLOUDINARY_FOLDER || 'willy_nilly';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        // Auto-optimize formats and compression
        format: options.format || undefined,
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]', error);
          return reject(error);
        }
        resolve({
          url: result.secure_url || result.url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          size: result.bytes,
          provider: 'cloudinary',
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an image by its public_id from Cloudinary
 * @param {string} publicId
 * @returns {Promise<Object>}
 */
export async function deleteFromCloudinary(publicId) {
  if (!isCloudinaryConfigured || !publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('[Cloudinary Destroy Error]', err);
    return null;
  }
}

export default {
  uploadToCloudinary,
  deleteFromCloudinary,
  isCloudinaryConfigured,
};
