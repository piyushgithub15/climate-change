import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { config } from '../config';

function getClient(): OpenAI {
  if (!config.openaiApiKey) {
    throw new Error('OPENAI_API_KEY is not set in .env');
  }
  return new OpenAI({ apiKey: config.openaiApiKey });
}

const TMP_DIR = path.resolve(__dirname, '..', '..', 'tmp');

/**
 * Generate a background image using OpenAI's image generation API.
 * Returns the local file path to the downloaded PNG.
 */
export async function generateBackgroundImage(prompt: string): Promise<string> {
  const client = getClient();

  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  }

  const fullPrompt = `${prompt}. Visually dramatic, atmospheric, suitable as a background for a climate infographic. No text, no words, no letters, no numbers. Photorealistic documentary style. High contrast, cinematic lighting. Portrait orientation.`;

  console.log('[image-gen] Generating background image...');

  const response = await client.images.generate({
    model: 'gpt-image-1',
    prompt: fullPrompt,
    n: 1,
    size: '1024x1536',
    quality: 'medium',
  });

  const imageData = response.data?.[0];
  if (!imageData) throw new Error('No image data in response');

  const filename = `bg-${Date.now()}.png`;
  const filePath = path.join(TMP_DIR, filename);

  if (imageData.b64_json) {
    const buffer = Buffer.from(imageData.b64_json, 'base64');
    fs.writeFileSync(filePath, buffer);
  } else if (imageData.url) {
    const res = await fetch(imageData.url);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
  } else {
    throw new Error('Image response has neither b64_json nor url');
  }

  console.log(`[image-gen] Background saved: ${filename}`);
  return filePath;
}
