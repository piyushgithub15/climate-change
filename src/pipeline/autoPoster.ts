import cron from 'node-cron';
import { config } from '../config';
import { runPipeline, runEventPipeline } from './pipeline';

let isRunning = false;
let isPaused = false;
let todayEventSlot = -1;
let eventSlotDate = '';
let eventUsedToday = false;

export function pauseAutoPoster(): void {
  isPaused = true;
  console.log('[auto-poster] PAUSED via command');
}

export function resumeAutoPoster(): void {
  isPaused = false;
  console.log('[auto-poster] RESUMED via command');
}

export function isAutoPosterPaused(): boolean {
  return isPaused;
}

export function isAutoPosterRunning(): boolean {
  return isRunning;
}

function pickEventSlot(): number {
  const today = new Date().toISOString().slice(0, 10);
  if (eventSlotDate !== today) {
    const slots = config.pipeline.postingHours.length;
    todayEventSlot = Math.floor(Math.random() * slots);
    eventSlotDate = today;
    eventUsedToday = false;
    console.log(`[auto-poster] Today's event slot: ${todayEventSlot} (${config.pipeline.postingHours[todayEventSlot]}:00)`);
  }
  return todayEventSlot;
}

function randomOffsetMs(): number {
  const maxOffsetMin = 15;
  const offsetMin = Math.floor(Math.random() * (maxOffsetMin * 2 + 1)) - maxOffsetMin;
  return offsetMin * 60 * 1000;
}

async function triggerPipeline(slotIndex = 0) {
  if (isPaused) {
    console.log('[auto-poster] Paused — skipping scheduled post');
    return;
  }
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
    const eventSlot = pickEventSlot();
    const isEventSlot = slotIndex === eventSlot && !eventUsedToday;

    if (isEventSlot) {
      console.log(`[auto-poster] Slot ${slotIndex} is today's event slot — attempting event pipeline`);
      try {
        const eventResult = await runEventPipeline(slotIndex);
        if (eventResult) {
          eventUsedToday = true;
          console.log(`[auto-poster] Event post completed: "${eventResult.event.headline}", post=#${eventResult.postId}`);
          return;
        }
        console.log('[auto-poster] No significant event found — falling back to regular pipeline');
      } catch (eventErr: any) {
        console.warn(`[auto-poster] Event pipeline failed (${eventErr.message}), falling back to regular`);
      }
    }

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

  pickEventSlot();

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
