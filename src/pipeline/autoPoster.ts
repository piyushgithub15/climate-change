import cron from 'node-cron';
import { config } from '../config';
import { runPipeline } from './pipeline';

let isRunning = false;

function randomOffsetMs(): number {
  const maxOffsetMin = 15;
  const offsetMin = Math.floor(Math.random() * (maxOffsetMin * 2 + 1)) - maxOffsetMin;
  return offsetMin * 60 * 1000;
}

async function triggerPipeline(slotIndex = 0) {
  if (isRunning) {
    console.log('[auto-poster] Pipeline already running, skipping');
    return;
  }
  isRunning = true;

  const delayMs = randomOffsetMs();
  const delayMin = Math.round(delayMs / 60000);
  if (delayMs > 0) {
    console.log(`[auto-poster] Random delay: ${delayMin} minutes to appear more human`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  } else if (delayMs < 0) {
    console.log(`[auto-poster] Posting ${Math.abs(delayMin)} minutes early for natural timing`);
  }

  try {
    const result = await runPipeline(slotIndex);
    console.log(`[auto-poster] Auto-post completed: slot=${slotIndex}, topic=${result.topicId}, post=#${result.postId}`);
  } catch (err: any) {
    const message = err instanceof Error
      ? err.message
      : (typeof err === 'object' ? JSON.stringify(err) : String(err));
    console.error('[auto-poster] Auto-post failed:', message);
  } finally {
    isRunning = false;
  }
}

export function startAutoPoster(): void {
  const { postingHours, timezone } = config.pipeline;

  if (!config.openaiApiKey) {
    console.log('[auto-poster] Skipped — OPENAI_API_KEY not configured');
    return;
  }

  postingHours.forEach((hour, index) => {
    const cronExpr = `0 ${hour} * * *`;
    cron.schedule(cronExpr, () => triggerPipeline(index), { timezone });
  });

  const schedule = postingHours.map(h => `${h}:00`).join(', ');
  console.log(
    `[auto-poster] Scheduled ${postingHours.length} daily posts at ${schedule} ±15min (${timezone})`
  );
}

export { triggerPipeline };
