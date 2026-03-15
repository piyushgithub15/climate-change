import { Router, Request, Response } from 'express';
import { getRecentPipelineLogs, getRecentPostTitles, getPostSources } from '../db/database';
import { runPipeline, runEventPipeline } from '../pipeline/pipeline';
import { CLIMATE_TOPICS } from '../content/topics';
import { config } from '../config';
import { generateContent } from '../content/generator';
import { researchTopic } from '../content/researcher';
import { fetchUnsplashImage } from '../content/unsplash';
import { renderCarouselSlides } from '../infographic/renderer';
import { ARCHETYPES, pickArchetype, getArchetypeById, SLOT_TEMPLATES } from '../content/archetypes';
import path from 'path';

const router = Router();

router.get('/pipeline/logs', async (_req: Request, res: Response) => {
  const logs = await getRecentPipelineLogs(50);
  res.json(logs);
});

router.get('/pipeline/topics', (_req: Request, res: Response) => {
  res.json(CLIMATE_TOPICS.map(t => ({ id: t.id, subject: t.subject, category: t.category })));
});

router.get('/pipeline/archetypes', (_req: Request, res: Response) => {
  const todaySlots = SLOT_TEMPLATES.map((template, i) => ({
    slot: i,
    archetype: pickArchetype(i).id,
    template,
  }));
  res.json({
    all: ARCHETYPES.map(a => ({ id: a.id, name: a.name, goal: a.goal, styles: a.preferredStyles })),
    today: todaySlots,
  });
});

router.get('/pipeline/status', (_req: Request, res: Response) => {
  res.json({
    openaiConfigured: !!config.openaiApiKey,
    cloudinaryConfigured: !!(config.cloudinary.cloudName && config.cloudinary.apiKey),
    schedule: {
      postingHours: config.pipeline.postingHours,
      postsPerDay: config.pipeline.postingHours.length,
      timezone: config.pipeline.timezone,
    },
    topicsCount: CLIMATE_TOPICS.length,
    archetypesCount: ARCHETYPES.length,
  });
});

router.post('/pipeline/generate', async (_req: Request, res: Response) => {
  if (!config.openaiApiKey) {
    res.status(400).json({ error: 'OPENAI_API_KEY is not configured in .env' });
    return;
  }

  try {
    const slotIndex = typeof _req.body?.slot === 'number' ? _req.body.slot : 0;
    res.json({ message: `Pipeline started — slot ${slotIndex}, generating immediately (no delay)` });
    runPipeline(slotIndex).then(result => {
      console.log(`[api] Pipeline completed: topic=${result.topicId}, post=#${result.postId}`);
    }).catch(err => {
      console.error('[api] Pipeline failed:', err instanceof Error ? err.message : String(err));
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
    const archetypeId = req.body?.archetype;
    const archetype = archetypeId
      ? getArchetypeById(archetypeId) || pickArchetype()
      : ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)];

    const forceStyle = req.body?.style;
    const style = forceStyle || archetype.preferredStyles[Math.floor(Math.random() * archetype.preferredStyles.length)];

    const topicIndex = CLIMATE_TOPICS.findIndex(t => t.id === (req.body?.topicId || ''));
    const topic = topicIndex >= 0 ? CLIMATE_TOPICS[topicIndex] : CLIMATE_TOPICS[Math.floor(Math.random() * CLIMATE_TOPICS.length)];

    console.log(`[preview] Generating preview: "${topic.subject}" | Archetype: ${archetype.name} | Style: ${style}`);

    const facts = await researchTopic(topic.subject, archetype);
    const recentPosts = await getRecentPostTitles(7);
    const content = await generateContent(topic, recentPosts, facts, archetype);

    let bgImagePath: string | undefined;
    try {
      bgImagePath = await fetchUnsplashImage(topic.subject);
    } catch (imgErr: any) {
      console.warn(`[preview] Unsplash image failed (${imgErr.message}), continuing without`);
    }

    const slidePaths = await renderCarouselSlides(content, style as any, bgImagePath);

    const previewUrls = slidePaths.map(p => `/preview/${path.basename(p)}`);

    console.log(`[preview] ${slidePaths.length} slides ready for preview`);
    res.json({
      style,
      archetype: archetype.id,
      archetypeName: archetype.name,
      topic: topic.subject,
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

router.post('/pipeline/generate-event', async (_req: Request, res: Response) => {
  if (!config.openaiApiKey) {
    res.status(400).json({ error: 'OPENAI_API_KEY is not configured' });
    return;
  }

  try {
    res.json({ message: 'Event pipeline started — searching for breaking climate event' });
    runEventPipeline(0).then(result => {
      if (result) {
        console.log(`[api] Event pipeline completed: "${result.event.headline}", post=#${result.postId}`);
      } else {
        console.log('[api] Event pipeline: no significant event found');
      }
    }).catch(err => {
      console.error('[api] Event pipeline failed:', err instanceof Error ? err.message : String(err));
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

router.get('/pipeline/sources/:logId', async (req: Request, res: Response) => {
  const logId = parseInt(req.params.logId as string, 10);
  if (isNaN(logId)) {
    res.status(400).json({ error: 'Invalid logId' });
    return;
  }
  const sources = await getPostSources(logId);
  res.json(sources);
});

export default router;
