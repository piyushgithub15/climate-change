import { Router, Request, Response } from 'express';
import { getRecentPipelineLogs, getRecentPostTitles } from '../db/database';
import { triggerPipeline } from '../pipeline/autoPoster';
import { CLIMATE_TOPICS } from '../content/topics';
import { config } from '../config';
import { generateContent } from '../content/generator';
import { researchTopic } from '../content/researcher';
import { fetchUnsplashImage } from '../content/unsplash';
import { renderCarouselSlides, pickTemplateStyle } from '../infographic/renderer';
import path from 'path';

const router = Router();

router.get('/pipeline/logs', async (_req: Request, res: Response) => {
  const logs = await getRecentPipelineLogs(50);
  res.json(logs);
});

router.get('/pipeline/topics', (_req: Request, res: Response) => {
  res.json(CLIMATE_TOPICS.map(t => ({ id: t.id, theme: t.theme })));
});

router.get('/pipeline/status', (_req: Request, res: Response) => {
  res.json({
    openaiConfigured: !!config.openaiApiKey,
    cloudinaryConfigured: !!(config.cloudinary.cloudName && config.cloudinary.apiKey),
    schedule: {
      morningHour: config.pipeline.morningHour,
      eveningHour: config.pipeline.eveningHour,
      timezone: config.pipeline.timezone,
    },
    topicsCount: CLIMATE_TOPICS.length,
  });
});

router.post('/pipeline/generate', async (_req: Request, res: Response) => {
  if (!config.openaiApiKey) {
    res.status(400).json({ error: 'OPENAI_API_KEY is not configured in .env' });
    return;
  }

  try {
    res.json({ message: 'Pipeline started — check the logs for progress' });
    triggerPipeline().catch(err => {
      console.error('[api] Pipeline trigger failed:', err);
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

router.post('/pipeline/preview', async (req: Request, res: Response) => {
  if (!config.openaiApiKey) {
    res.status(400).json({ error: 'OPENAI_API_KEY is not configured' });
    return;
  }

  try {
    const forceStyle = req.body?.style;
    const style = forceStyle || pickTemplateStyle();
    const topicIndex = CLIMATE_TOPICS.findIndex(t => t.id === (req.body?.topicId || ''));
    const topic = topicIndex >= 0 ? CLIMATE_TOPICS[topicIndex] : CLIMATE_TOPICS[Math.floor(Math.random() * CLIMATE_TOPICS.length)];

    console.log(`[preview] Generating preview: "${topic.theme}" (${style})`);

    const researchData = await researchTopic(topic.theme);
    const recentPosts = await getRecentPostTitles(7);
    const content = await generateContent(topic, recentPosts, researchData);

    let bgImagePath: string | undefined;
    try {
      bgImagePath = await fetchUnsplashImage(topic.theme);
    } catch (imgErr: any) {
      console.warn(`[preview] Unsplash image failed (${imgErr.message}), continuing without`);
    }

    const slidePaths = await renderCarouselSlides(content, style as any, bgImagePath);

    const previewUrls = slidePaths.map(p => `/preview/${path.basename(p)}`);

    console.log(`[preview] ${slidePaths.length} slides ready for preview`);
    res.json({
      style,
      topic: topic.theme,
      title: content.coverTitle,
      slides: previewUrls,
      caption: content.caption,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[preview] Failed:', message);
    res.status(500).json({ error: message });
  }
});

export default router;
