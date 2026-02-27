import { Router, Request, Response } from 'express';
import { getRecentPipelineLogs } from '../db/database';
import { triggerPipeline } from '../pipeline/autoPoster';
import { CLIMATE_TOPICS } from '../content/topics';
import { config } from '../config';

const router = Router();

router.get('/pipeline/logs', async (_req: Request, res: Response) => {
  const logs = await getRecentPipelineLogs(50);
  res.json(logs);
});

router.get('/pipeline/topics', (_req: Request, res: Response) => {
  res.json(CLIMATE_TOPICS.map(t => ({ id: t.id, theme: t.theme, description: t.description })));
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

export default router;
