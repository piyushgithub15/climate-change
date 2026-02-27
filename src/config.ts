import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  metaAppId: required('META_APP_ID'),
  metaAppSecret: required('META_APP_SECRET'),
  instagramAccountId: required('INSTAGRAM_ACCOUNT_ID'),
  facebookPageId: required('FACEBOOK_PAGE_ID'),
  accessToken: required('ACCESS_TOKEN'),
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  perplexityApiKey: process.env.PERPLEXITY_API_KEY || '',
  turso: {
    url: process.env.TURSO_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN || '',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  port: parseInt(process.env.PORT || '3000', 10),
  graphApiVersion: 'v25.0',
  graphApiBaseUrl: 'https://graph.facebook.com',
  pipeline: {
    morningHour: parseInt(process.env.PIPELINE_MORNING_HOUR || '9', 10),
    eveningHour: parseInt(process.env.PIPELINE_EVENING_HOUR || '18', 10),
    timezone: process.env.PIPELINE_TIMEZONE || Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
};
