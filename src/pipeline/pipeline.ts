import fs from 'fs';
import { CLIMATE_TOPICS } from '../content/topics';
import { generateContent } from '../content/generator';
import { researchTopic } from '../content/researcher';
import { renderCarouselSlides } from '../infographic/renderer';
import { uploadToCloudinary, isCloudinaryConfigured } from '../media/uploader';
import { publishCarousel } from '../instagram/api';
import {
  createPost,
  createPipelineLog,
  updatePipelineLog,
  updatePostStatus,
  getLastUsedTopicId,
  getRecentPostTitles,
} from '../db/database';

async function pickNextTopic(): Promise<typeof CLIMATE_TOPICS[number]> {
  const lastUsedId = await getLastUsedTopicId();
  if (!lastUsedId) return CLIMATE_TOPICS[0];

  const lastIndex = CLIMATE_TOPICS.findIndex(t => t.id === lastUsedId);
  const nextIndex = (lastIndex + 1) % CLIMATE_TOPICS.length;
  return CLIMATE_TOPICS[nextIndex];
}

export async function runPipeline(): Promise<{ postId: number; topicId: string }> {
  const topic = await pickNextTopic();
  console.log(`\n[pipeline] === Starting carousel pipeline: "${topic.theme}" (${topic.id}) ===`);

  const logId = await createPipelineLog(topic.id);

  try {
    console.log('[pipeline] Step 1/5: Researching latest data with Perplexity...');
    const researchData = await researchTopic(topic.theme);
    console.log('[pipeline] Research complete');

    console.log('[pipeline] Step 2/5: Generating carousel content with GPT-4o...');
    const recentPosts = await getRecentPostTitles(7);
    if (recentPosts.length > 0) {
      console.log(`[pipeline] Avoiding ${recentPosts.length} recent angles from the last 7 days`);
    }
    const content = await generateContent(topic, recentPosts, researchData);
    const slideCount = content.slides.length + 1;
    console.log(`[pipeline] Content generated — "${content.coverTitle}" (${slideCount} slides)`);

    console.log('[pipeline] Step 3/5: Rendering carousel slides...');
    const slidePaths = await renderCarouselSlides(content);
    console.log(`[pipeline] ${slidePaths.length} slides rendered`);

    console.log('[pipeline] Step 4/5: Uploading slides to Cloudinary...');
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

    console.log('[pipeline] Step 5/5: Publishing carousel to Instagram...');
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
      template_name: 'carousel-clean',
      content_json: JSON.stringify(content),
      post_id: post.id,
      status: 'completed',
    });

    cleanup(...slidePaths);

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
