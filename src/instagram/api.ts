import axios from 'axios';
import { config } from '../config';
import { savePageToken, getPageToken } from '../db/database';

const { graphApiBaseUrl, graphApiVersion } = config;

function apiUrl(path: string): string {
  return `${graphApiBaseUrl}/${graphApiVersion}/${path}`;
}

let cachedPageToken: string | null = null;

export async function getValidPageToken(): Promise<string> {
  if (cachedPageToken) return cachedPageToken;

  const stored = await getPageToken();
  if (stored) {
    cachedPageToken = stored;
    return stored;
  }

  console.log('[auth] Exchanging token for a non-expiring Page Token...');

  const llRes = await axios.get(apiUrl('oauth/access_token'), {
    params: {
      grant_type: 'fb_exchange_token',
      client_id: config.metaAppId,
      client_secret: config.metaAppSecret,
      fb_exchange_token: config.accessToken,
    },
  });
  const longLivedUserToken: string = llRes.data.access_token;
  console.log('[auth] Got long-lived user token');

  const pageRes = await axios.get(apiUrl(`${config.facebookPageId}`), {
    params: {
      fields: 'access_token',
      access_token: longLivedUserToken,
    },
  });
  const pageToken: string = pageRes.data.access_token;
  console.log('[auth] Got non-expiring page token');

  await savePageToken(pageToken);
  cachedPageToken = pageToken;
  return pageToken;
}

export async function createImageContainer(imageUrl: string, caption: string): Promise<string> {
  const token = await getValidPageToken();
  const res = await axios.post(
    apiUrl(`${config.instagramAccountId}/media`),
    { image_url: imageUrl, caption },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.id;
}

export async function createCarouselItem(mediaUrl: string, isVideo: boolean): Promise<string> {
  const token = await getValidPageToken();
  const body: Record<string, unknown> = { is_carousel_item: true };

  if (isVideo) {
    body.media_type = 'VIDEO';
    body.video_url = mediaUrl;
  } else {
    body.image_url = mediaUrl;
  }

  const res = await axios.post(
    apiUrl(`${config.instagramAccountId}/media`),
    body,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.id;
}

export async function createCarouselContainer(childIds: string[], caption: string): Promise<string> {
  const token = await getValidPageToken();
  const res = await axios.post(
    apiUrl(`${config.instagramAccountId}/media`),
    {
      media_type: 'CAROUSEL',
      children: childIds.join(','),
      caption,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.id;
}

export async function createReelContainer(videoUrl: string, caption: string): Promise<string> {
  const token = await getValidPageToken();
  const res = await axios.post(
    apiUrl(`${config.instagramAccountId}/media`),
    {
      media_type: 'REELS',
      video_url: videoUrl,
      caption,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.id;
}

export async function checkContainerStatus(containerId: string): Promise<string> {
  const token = await getValidPageToken();
  const res = await axios.get(apiUrl(containerId), {
    params: { fields: 'status_code', access_token: token },
  });
  return res.data.status_code;
}

export async function publishContainer(containerId: string): Promise<string> {
  const token = await getValidPageToken();
  const res = await axios.post(
    apiUrl(`${config.instagramAccountId}/media_publish`),
    { creation_id: containerId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.id;
}

export async function checkRateLimit(): Promise<{ quota_usage: number; config: Record<string, unknown> }> {
  const token = await getValidPageToken();
  const res = await axios.get(apiUrl(`${config.instagramAccountId}/content_publishing_limit`), {
    params: { fields: 'quota_usage,config', access_token: token },
  });
  return res.data;
}

export async function publishImage(imageUrl: string, caption: string): Promise<string> {
  const containerId = await createImageContainer(imageUrl, caption);
  return publishContainer(containerId);
}

export async function publishCarousel(mediaUrls: string[], caption: string): Promise<string> {
  const childIds: string[] = [];
  for (const url of mediaUrls) {
    const isVideo = /\.(mp4|mov|avi|webm)(\?|$)/i.test(url);
    const id = await createCarouselItem(url, isVideo);
    childIds.push(id);
  }
  const carouselId = await createCarouselContainer(childIds, caption);
  return publishContainer(carouselId);
}

export async function publishReel(videoUrl: string, caption: string): Promise<string> {
  const containerId = await createReelContainer(videoUrl, caption);

  for (let i = 0; i < 30; i++) {
    await sleep(10_000);
    const status = await checkContainerStatus(containerId);
    if (status === 'FINISHED') {
      return publishContainer(containerId);
    }
    if (status === 'ERROR') {
      throw new Error(`Reel container ${containerId} failed processing`);
    }
  }

  throw new Error(`Reel container ${containerId} timed out after 5 minutes`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
