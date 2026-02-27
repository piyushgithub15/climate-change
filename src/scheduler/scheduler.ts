import cron from 'node-cron';
import { getDuePosts, updatePostStatus, ScheduledPost } from '../db/database';
import { publishImage, publishCarousel, publishReel } from '../instagram/api';

let isProcessing = false;

async function processPost(post: ScheduledPost): Promise<void> {
  const mediaUrls: string[] = JSON.parse(post.media_urls);

  console.log(`[scheduler] Publishing post #${post.id} (${post.type})...`);
  await updatePostStatus(post.id, 'publishing');

  try {
    let igMediaId: string;

    switch (post.type) {
      case 'image':
        igMediaId = await publishImage(mediaUrls[0], post.caption);
        break;
      case 'carousel':
        igMediaId = await publishCarousel(mediaUrls, post.caption);
        break;
      case 'reel':
        igMediaId = await publishReel(mediaUrls[0], post.caption);
        break;
      default:
        throw new Error(`Unknown post type: ${post.type}`);
    }

    await updatePostStatus(post.id, 'published', { ig_media_id: igMediaId });
    console.log(`[scheduler] Post #${post.id} published (IG Media ID: ${igMediaId})`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await updatePostStatus(post.id, 'failed', { error_message: message });
    console.error(`[scheduler] Post #${post.id} failed:`, message);
  }
}

async function tick() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const duePosts = await getDuePosts();
    if (duePosts.length > 0) {
      console.log(`[scheduler] Found ${duePosts.length} post(s) due for publishing`);
    }
    for (const post of duePosts) {
      await processPost(post);
    }
  } catch (err) {
    console.error('[scheduler] Tick error:', err);
  } finally {
    isProcessing = false;
  }
}

export function startScheduler(): void {
  cron.schedule('* * * * *', tick, {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  console.log('[scheduler] Started — checking for due posts every minute');
}
