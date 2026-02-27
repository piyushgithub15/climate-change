import fs from 'fs';
import path from 'path';
import https from 'https';
import { config } from '../config';

const TMP_DIR = path.resolve(__dirname, '..', '..', 'tmp');

function httpsGet(url: string, headers: Record<string, string> = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const opts = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers,
    };
    https.get(opts, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        httpsGet(res.headers.location, headers).then(resolve, reject);
        return;
      }
      let data = '';
      res.on('data', (chunk: Buffer) => { data += chunk.toString(); });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Unsplash API error (${res.statusCode}): ${data.slice(0, 200)}`));
          return;
        }
        resolve(data);
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const follow = (u: string) => {
      const parsed = new URL(u);
      const opts = { hostname: parsed.hostname, path: parsed.pathname + parsed.search };
      https.get(opts, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          follow(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Image download failed: HTTP ${res.statusCode}`));
          return;
        }
        const stream = fs.createWriteStream(dest);
        res.pipe(stream);
        stream.on('finish', () => { stream.close(); resolve(); });
        stream.on('error', reject);
      }).on('error', reject);
    };
    follow(url);
  });
}

export async function fetchUnsplashImage(query: string): Promise<string> {
  const accessKey = config.unsplashAccessKey;
  if (!accessKey) {
    throw new Error('UNSPLASH_ACCESS_KEY is not set in .env');
  }

  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

  const searchTerms = `${query} nature environment`.slice(0, 100);
  const apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchTerms)}&orientation=portrait&content_filter=high`;

  const body = await httpsGet(apiUrl, { Authorization: `Client-ID ${accessKey}` });
  const data = JSON.parse(body);

  const imageUrl = data.urls?.regular || data.urls?.full;
  if (!imageUrl) throw new Error('No image URL returned from Unsplash');

  const filePath = path.join(TMP_DIR, `unsplash-${Date.now()}.jpg`);
  const sizedUrl = `${imageUrl}&w=1080&h=1350&fit=crop&crop=entropy`;
  await downloadImage(sizedUrl, filePath);

  console.log(`[unsplash] Downloaded cover image by ${data.user?.name || 'unknown'} (${data.user?.links?.html || ''})`);
  return filePath;
}
