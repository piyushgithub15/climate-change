import fs from 'fs';
import { CLIMATE_TOPICS } from '../content/topics';
import { generateContent } from '../content/generator';
import { researchTopic } from '../content/researcher';
import { fetchUnsplashImage } from '../content/unsplash';
import { renderCarouselSlides } from '../infographic/renderer';
import { uploadToCloudinary, isCloudinaryConfigured } from '../media/uploader';
import { publishCarousel, checkRateLimit } from '../instagram/api';
import { pickArchetype, ContentArchetype } from '../content/archetypes';
import {
  createPost,
  createPipelineLog,
  updatePipelineLog,
  updatePostStatus,
  getLastUsedTopicId,
  getRecentPostTitles,
  getLastPipelineRunTime,
} from '../db/database';

const MAX_DAILY_POSTS = 20;
const COOLDOWN_MINUTES = 5;

async function pickNextTopic(): Promise<typeof CLIMATE_TOPICS[number]> {
  const lastUsedId = await getLastUsedTopicId();
  if (!lastUsedId) return CLIMATE_TOPICS[0];

  const lastIndex = CLIMATE_TOPICS.findIndex(t => t.id === lastUsedId);
  const nextIndex = (lastIndex + 1) % CLIMATE_TOPICS.length;
  return CLIMATE_TOPICS[nextIndex];
}

export async function runPipeline(forEvening = false): Promise<{ postId: number; topicId: string }> {
  const lastRun = await getLastPipelineRunTime();
  if (lastRun) {
    const elapsedMs = Date.now() - lastRun.getTime();
    const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;
    if (elapsedMs < cooldownMs) {
      const waitSec = Math.ceil((cooldownMs - elapsedMs) / 1000);
      throw new Error(`Pipeline cooldown active — try again in ${waitSec}s to prevent duplicate posts`);
    }
  }

  const topic = await pickNextTopic();
  const archetype = pickArchetype(forEvening);
  const style = archetype.preferredStyles[Math.floor(Math.random() * archetype.preferredStyles.length)];
  console.log(`\n[pipeline] === Starting carousel pipeline: "${topic.theme}" (${topic.id}) ===`);
  console.log(`[pipeline] Archetype: ${archetype.name} | Template: ${style}`);

  const logId = await createPipelineLog(topic.id);

  try {
    console.log('[pipeline] Step 1/6: Researching latest data with Perplexity...');
    const researchData = await researchTopic(topic.theme);
    console.log('[pipeline] Research complete');

    console.log('[pipeline] Step 2/6: Generating carousel content with GPT-4o...');
    const recentPosts = await getRecentPostTitles(7);
    if (recentPosts.length > 0) {
      console.log(`[pipeline] Avoiding ${recentPosts.length} recent angles from the last 7 days`);
    }
    const content = await generateContent(topic, recentPosts, researchData, archetype);
    const slideCount = content.slides.length + 1;
    console.log(`[pipeline] Content generated — "${content.coverTitle}" (${slideCount} slides)`);

    console.log('[pipeline] Step 3/6: Fetching cover image from Unsplash...');
    let bgImagePath: string | undefined;
    try {
      bgImagePath = await fetchUnsplashImage(topic.theme);
      console.log('[pipeline] Cover image ready');
    } catch (imgErr: any) {
      console.warn(`[pipeline] Unsplash image failed (${imgErr.message}), continuing without cover image`);
    }

    console.log('[pipeline] Step 4/6: Rendering carousel slides...');
    const slidePaths = await renderCarouselSlides(content, style, bgImagePath);
    console.log(`[pipeline] ${slidePaths.length} slides rendered`);

    console.log('[pipeline] Step 5/6: Uploading slides to Cloudinary...');
    if (!isCloudinaryConfigured()) {
      throw new Error(
        'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env'
      );
    }
    const publicUrls: string[] = [];
    for (let i = 0; i < slidePaths.length; i++) {
      const url = await uploadToCloudinary(slidePaths[i]);
      publicUrls.push(url);
      console.log(`[pipeline] Uploaded slide ${i + 1}/${slidePaths.length}`);
    }

    console.log('[pipeline] Step 6/6: Publishing carousel to Instagram...');

    try {
      const rateLimit = await checkRateLimit();
      const usage = rateLimit.quota_usage ?? 0;
      console.log(`[pipeline] Rate limit check: ${usage}/${MAX_DAILY_POSTS} posts used (IG limit: 25)`);
      if (usage >= MAX_DAILY_POSTS) {
        throw new Error(`Daily post limit reached (${usage}/25). Skipping publish to protect your account.`);
      }
    } catch (rlErr: any) {
      if (rlErr.message?.includes('Daily post limit')) throw rlErr;
      console.warn(`[pipeline] Rate limit check failed (${rlErr.message}), proceeding cautiously`);
    }

    const igMediaId = await publishCarousel(publicUrls, content.caption);
    console.log(`[pipeline] Published! IG Media ID: ${igMediaId}`);

    const post = await createPost({
      type: 'carousel',
      caption: content.caption,
      media_urls: JSON.stringify(publicUrls),
      scheduled_at: new Date().toISOString(),
    });
    await updatePostStatus(post.id, 'published', { ig_media_id: igMediaId });

    await updatePipelineLog(logId, {
      template_name: `carousel-${style}`,
      content_json: JSON.stringify(content),
      post_id: post.id,
      status: 'completed',
    });

    cleanup(...slidePaths, ...(bgImagePath ? [bgImagePath] : []));

    console.log(`[pipeline] === Carousel complete for "${topic.theme}" ===\n`);
    return { postId: post.id, topicId: topic.id };
  } catch (err: any) {
    const message = err instanceof Error
      ? err.message
      : (typeof err === 'object' ? JSON.stringify(err) : String(err));
    console.error(`[pipeline] Failed:`, message);
    if (err?.response?.data) {
      console.error(`[pipeline] API response:`, JSON.stringify(err.response.data));
    }
    await updatePipelineLog(logId, {
      status: 'failed',
      error_message: message,
    });
    throw err;
  }
}

function cleanup(...files: string[]) {
  for (const f of files) {
    try {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    } catch {
      // ignore cleanup errors
    }
  }
}
