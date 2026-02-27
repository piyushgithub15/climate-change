import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import { initSchema } from './db/database';
import { getValidPageToken } from './instagram/api';
import { startScheduler } from './scheduler/scheduler';
import { startAutoPoster } from './pipeline/autoPoster';
import postsRouter from './routes/posts';
import pipelineRouter from './routes/pipeline';

async function main() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(express.static(path.resolve(__dirname, '..', 'public')));

  app.use('/api', postsRouter);
  app.use('/api', pipelineRouter);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  await initSchema();
  console.log('[db] Turso database initialized');

  try {
    await getValidPageToken();
    console.log('[auth] Page token ready');
  } catch (err) {
    console.error('[auth] Failed to get page token:', err);
    console.error('[auth] Make sure ACCESS_TOKEN in .env is a valid, fresh token from the Graph API Explorer');
    process.exit(1);
  }

  startScheduler();
  startAutoPoster();

  app.listen(config.port, () => {
    console.log(`\n  Instagram Auto-Poster running at http://localhost:${config.port}\n`);
  });
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
