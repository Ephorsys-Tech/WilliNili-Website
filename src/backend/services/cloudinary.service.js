import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';

/**
 * Dynamically resolves Cloudinary credentials from process.env or validated env config.
 * Always ensures the latest credentials from .env / .env.local are active.
 */
export function getCloudinaryConfig() {
  const cloudName = String(
    process.env.CLOUDINARY_CLOUD_NAME |
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    env.CLOUDINARY_CLOUD_NAME ||
    env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    ''
  ).trim();

  const apiKey = String(
    process.env.CLOUDINARY_API_KEY ||
    env.CLOUDINARY_API_KEY ||
    ''
  ).trim();

  const apiSecret = String(
    process.env.CLOUDINARY_API_SECRET ||
    env.CLOUDINARY_API_SECRET ||
    ''
  ).trim();

  const isConfigured = Boolean(cloudName && apiKey && apiSecret);

  if (isConfigured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  return {
    isConfigured,
    cloudName,
    apiKey,
    apiSecret,
  };
}

/**
 * Check if Cloudinary is configured with valid credentials.
 * @returns {boolean}
 */
export function isCloudinaryConfigured() {
  return getCloudinaryConfig().isConfigured;
}

/**
 * Upload an image buffer directly to Cloudinary using upload_stream
 * @param {Buffer} buffer - File buffer
 * @param {Object} options - Upload options (folder, tags, transformations)
 * @returns {Promise<Object>}
 */
export async function uploadToCloudinary(buffer, options = {}) {
  const config = getCloudinaryConfig();
  if (!config.isConfigured) {
    throw new Error('Cloudinary is not configured with active credentials. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment.');
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
  if (!isCloudinaryConfigured() || !publicId) return null;
  try {
    const config = getCloudinaryConfig();
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true,
    });
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
  getCloudinaryConfig,
};
