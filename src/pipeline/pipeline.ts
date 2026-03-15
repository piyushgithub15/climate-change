import fs from 'fs';
import { CLIMATE_TOPICS } from '../content/topics';
import { generateContent } from '../content/generator';
import { researchTopic, ResearchFact } from '../content/researcher';
import { fetchUnsplashImage } from '../content/unsplash';
import { renderCarouselSlides } from '../infographic/renderer';
import { uploadToCloudinary, isCloudinaryConfigured } from '../media/uploader';
import { publishCarousel, checkRateLimit } from '../instagram/api';
import { pickArchetype, getSlotTemplate, getArchetypeById, ContentArchetype } from '../content/archetypes';
import { pickCaptionStyle } from '../content/caption-styles';
import { discoverClimateEvent, ClimateEvent } from '../content/event-discovery';
import {
  createPost,
  createPipelineLog,
  updatePipelineLog,
  updatePostStatus,
  getLastUsedTopicId,
  getRecentPostTitles,
  getLastPipelineRunTime,
  savePostSources,
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

export async function runPipeline(slotIndex = 0): Promise<{ postId: number; topicId: string }> {
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
  const archetype = pickArchetype(slotIndex);
  const style = getSlotTemplate(slotIndex);
  const captionStyle = pickCaptionStyle(archetype.id);
  console.log(`\n[pipeline] === Starting carousel pipeline: "${topic.subject}" (${topic.id}) ===`);
  console.log(`[pipeline] Slot: ${slotIndex} | Archetype: ${archetype.name} | Template: ${style} | Caption: ${captionStyle.name}`);

  const logId = await createPipelineLog(topic.id);

  try {
    console.log(`[pipeline] Step 1/6: Researching "${topic.subject}" (method: ${archetype.researchMethod})...`);
    const facts = await researchTopic(topic.subject, archetype);
    console.log(`[pipeline] Research complete — ${facts.length} verified facts`);

    console.log('[pipeline] Step 2/6: Generating carousel content with GPT-4o...');
    const recentPosts = await getRecentPostTitles(7);
    if (recentPosts.length > 0) {
      console.log(`[pipeline] Avoiding ${recentPosts.length} recent angles from the last 7 days`);
    }
    const content = await generateContent(topic, recentPosts, facts, archetype, captionStyle);
    const slideCount = content.slides.length + 1;
    console.log(`[pipeline] Content generated — "${content.coverTitle}" (${slideCount} slides)`);

    console.log('[pipeline] Step 3/6: Fetching cover image from Unsplash...');
    let bgImagePath: string | undefined;
    try {
      bgImagePath = await fetchUnsplashImage(topic.subject);
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

    await savePostSources(logId, facts);

    cleanup(...slidePaths, ...(bgImagePath ? [bgImagePath] : []));

    console.log(`[pipeline] === Carousel complete for "${topic.subject}" ===\n`);
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

export async function runEventPipeline(slotIndex = 0): Promise<{ postId: number; topicId: string; event: ClimateEvent } | null> {
  console.log('\n[event-pipeline] === Searching for breaking climate event ===');

  const event = await discoverClimateEvent();
  if (!event) {
    console.log('[event-pipeline] No significant event found — slot will use regular pipeline');
    return null;
  }

  const archetype = getArchetypeById('current-event')!;
  const style = getSlotTemplate(slotIndex);
  const captionStyle = pickCaptionStyle(archetype.id);
  const eventTopicId = `event-${Date.now()}`;

  console.log(`[event-pipeline] Event: "${event.headline}" | Style: ${style}`);

  const logId = await createPipelineLog(eventTopicId);

  try {
    console.log('[event-pipeline] Step 1/6: Researching event details...');
    const facts = await researchTopic(event.headline, archetype);
    console.log(`[event-pipeline] Research complete — ${facts.length} verified facts`);

    console.log('[event-pipeline] Step 2/6: Generating carousel content...');
    const recentPosts = await getRecentPostTitles(7);

    const eventTopic = {
      id: eventTopicId,
      subject: event.headline,
      category: 'current-event',
      angles: [
        `What just happened: ${event.summary}`,
        `How this compares to historical records in ${event.location}`,
        'The climate science behind why this event occurred',
      ],
    };

    const content = await generateContent(eventTopic, recentPosts, facts, archetype, captionStyle);
    const slideCount = content.slides.length + 1;
    console.log(`[event-pipeline] Content generated — "${content.coverTitle}" (${slideCount} slides)`);

    console.log('[event-pipeline] Step 3/6: Fetching cover image...');
    let bgImagePath: string | undefined;
    try {
      bgImagePath = await fetchUnsplashImage(`${event.headline} ${event.location} climate`);
    } catch (imgErr: any) {
      console.warn(`[event-pipeline] Unsplash failed (${imgErr.message}), continuing without`);
    }

    console.log('[event-pipeline] Step 4/6: Rendering slides...');
    const slidePaths = await renderCarouselSlides(content, style, bgImagePath);
    console.log(`[event-pipeline] ${slidePaths.length} slides rendered`);

    console.log('[event-pipeline] Step 5/6: Uploading to Cloudinary...');
    if (!isCloudinaryConfigured()) {
      throw new Error('Cloudinary is not configured');
    }
    const publicUrls: string[] = [];
    for (let i = 0; i < slidePaths.length; i++) {
      const url = await uploadToCloudinary(slidePaths[i]);
      publicUrls.push(url);
    }

    console.log('[event-pipeline] Step 6/6: Publishing to Instagram...');
    try {
      const rateLimit = await checkRateLimit();
      const usage = rateLimit.quota_usage ?? 0;
      if (usage >= MAX_DAILY_POSTS) {
        throw new Error(`Daily post limit reached (${usage}/25)`);
      }
    } catch (rlErr: any) {
      if (rlErr.message?.includes('Daily post limit')) throw rlErr;
      console.warn(`[event-pipeline] Rate limit check failed, proceeding`);
    }

    const igMediaId = await publishCarousel(publicUrls, content.caption);
    console.log(`[event-pipeline] Published! IG Media ID: ${igMediaId}`);

    const post = await createPost({
      type: 'carousel',
      caption: content.caption,
      media_urls: JSON.stringify(publicUrls),
      scheduled_at: new Date().toISOString(),
    });
    await updatePostStatus(post.id, 'published', { ig_media_id: igMediaId });

    await updatePipelineLog(logId, {
      template_name: `carousel-${style}-event`,
      content_json: JSON.stringify({ ...content, event }),
      post_id: post.id,
      status: 'completed',
    });

    await savePostSources(logId, facts);

    cleanup(...slidePaths, ...(bgImagePath ? [bgImagePath] : []));

    console.log(`[event-pipeline] === Event post complete: "${event.headline}" ===\n`);
    return { postId: post.id, topicId: eventTopicId, event };
  } catch (err: any) {
    const message = err instanceof Error
      ? err.message
      : (typeof err === 'object' ? JSON.stringify(err) : String(err));
    console.error(`[event-pipeline] Failed:`, message);
    await updatePipelineLog(logId, { status: 'failed', error_message: message });
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
