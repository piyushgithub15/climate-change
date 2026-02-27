import cron from 'node-cron';
import { config } from '../config';
import { runPipeline } from './pipeline';

let isRunning = false;

async function triggerPipeline() {
  if (isRunning) {
    console.log('[auto-poster] Pipeline already running, skipping');
    return;
  }
  isRunning = true;

  try {
    const result = await runPipeline();
    console.log(`[auto-poster] Auto-post completed: topic=${result.topicId}, post=#${result.postId}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[auto-poster] Auto-post failed:', message);
  } finally {
    isRunning = false;
  }
}

export function startAutoPoster(): void {
  const { morningHour, eveningHour, timezone } = config.pipeline;

  if (!config.openaiApiKey) {
    console.log('[auto-poster] Skipped — OPENAI_API_KEY not configured');
    return;
  }

  const morningCron = `0 ${morningHour} * * *`;
  const eveningCron = `0 ${eveningHour} * * *`;

  cron.schedule(morningCron, triggerPipeline, { timezone });
  cron.schedule(eveningCron, triggerPipeline, { timezone });

  console.log(
    `[auto-poster] Scheduled at ${morningHour}:00 and ${eveningHour}:00 (${timezone})`
  );
}

export { triggerPipeline };
