import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { config } from '../config';

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const { cloudName, apiKey, apiSecret } = config.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env'
    );
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  configured = true;
}

export function isCloudinaryConfigured(): boolean {
  const { cloudName, apiKey, apiSecret } = config.cloudinary;
  return !!(cloudName && apiKey && apiSecret);
}

/**
 * Upload a local file to Cloudinary and return its public URL.
 */
export async function uploadToCloudinary(filePath: string): Promise<string> {
  ensureConfigured();

  const isVideo = /\.(mp4|mov|avi|webm)$/i.test(filePath);

  const result: UploadApiResponse = await cloudinary.uploader.upload(filePath, {
    resource_type: isVideo ? 'video' : 'image',
    folder: 'instagram-autoposter',
  });

  return result.secure_url;
}

/**
 * Upload multiple files and return their public URLs.
 */
export async function uploadMultipleToCloudinary(filePaths: string[]): Promise<string[]> {
  const urls: string[] = [];
  for (const filePath of filePaths) {
    const url = await uploadToCloudinary(filePath);
    urls.push(url);
  }
  return urls;
}
