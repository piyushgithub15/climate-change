import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import { config } from '../config';
import { ResearchFact } from '../content/researcher';
import { GeneratedContent } from '../content/generator';

let bot: TelegramBot | null = null;

type ApprovalResolver = (decision: 'approve' | 'reject' | 'regenerate') => void;
const pendingApprovals = new Map<string, ApprovalResolver>();

export function isTelegramConfigured(): boolean {
  return !!(config.telegram.botToken && config.telegram.chatId);
}

export function initTelegramBot(): void {
  if (!isTelegramConfigured()) {
    console.log('[telegram] Not configured — skipping bot init');
    return;
  }

  bot = new TelegramBot(config.telegram.botToken, { polling: true });

  bot.on('callback_query', async (query) => {
    if (!query.data) return;

    const [action, approvalId] = query.data.split(':');
    const resolver = pendingApprovals.get(approvalId);

    if (!resolver) {
      await bot!.answerCallbackQuery(query.id, { text: 'This post has already been handled.' });
      return;
    }

    pendingApprovals.delete(approvalId);

    if (action === 'approve') {
      await bot!.answerCallbackQuery(query.id, { text: 'Approved! Publishing to Instagram...' });
      await bot!.editMessageReplyMarkup(
        { inline_keyboard: [[{ text: '✅ APPROVED', callback_data: 'noop' }]] },
        { chat_id: query.message!.chat.id, message_id: query.message!.message_id },
      );
      resolver('approve');
    } else if (action === 'reject') {
      await bot!.answerCallbackQuery(query.id, { text: 'Rejected. Post will not be published.' });
      await bot!.editMessageReplyMarkup(
        { inline_keyboard: [[{ text: '❌ REJECTED', callback_data: 'noop' }]] },
        { chat_id: query.message!.chat.id, message_id: query.message!.message_id },
      );
      resolver('reject');
    } else if (action === 'regenerate') {
      await bot!.answerCallbackQuery(query.id, { text: 'Generating a new post...' });
      await bot!.editMessageReplyMarkup(
        { inline_keyboard: [[{ text: '🔄 REGENERATING...', callback_data: 'noop' }]] },
        { chat_id: query.message!.chat.id, message_id: query.message!.message_id },
      );
      resolver('regenerate');
    }
  });

  bot.on('polling_error', (err) => {
    console.error('[telegram] Polling error:', err.message);
  });

  console.log('[telegram] Bot initialized and listening for approvals');
}

export async function sendForApproval(
  slidePaths: string[],
  content: GeneratedContent,
  facts: ResearchFact[],
  archetype: string,
  topic: string,
): Promise<'approve' | 'reject' | 'regenerate'> {
  if (!bot) throw new Error('Telegram bot not initialized');

  const chatId = config.telegram.chatId;
  const approvalId = `post_${Date.now()}`;

  const existingPaths = slidePaths.filter(p => fs.existsSync(p));
  console.log(`[telegram] Sending ${existingPaths.length} slides to chat ${chatId}...`);

  const escapeMd = (text: string) => text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');

  try {
    for (let i = 0; i < existingPaths.length; i++) {
      const caption = i === 0
        ? `📋 ${escapeMd(content.coverTitle)}\n\n🏷 Archetype: ${escapeMd(archetype)}\n📌 Topic: ${escapeMd(topic)}`
        : undefined;

      await bot.sendPhoto(chatId, existingPaths[i], {
        caption,
        parse_mode: undefined,
      });
      console.log(`[telegram] Slide ${i + 1}/${existingPaths.length} sent`);
    }
  } catch (err: any) {
    console.error(`[telegram] Failed to send slides:`, err.message);
    throw err;
  }

  const sourcesText = facts
    .filter(f => f.sourceUrl)
    .reduce((acc, f) => {
      if (!acc.has(f.source)) acc.set(f.source, f.sourceUrl);
      return acc;
    }, new Map<string, string>());

  const sourcesList = [...sourcesText.entries()]
    .slice(0, 10)
    .map(([name, url]) => `• ${name}: ${url}`)
    .join('\n');

  const captionPreview = content.caption.length > 800
    ? content.caption.slice(0, 800) + '...'
    : content.caption;

  const detailsMessage = `📝 Caption:\n${captionPreview}\n\n📎 Sources (${sourcesText.size}):\n${sourcesList || 'No URLs available'}`;

  await bot.sendMessage(chatId, detailsMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Approve & Post', callback_data: `approve:${approvalId}` },
          { text: '❌ Reject', callback_data: `reject:${approvalId}` },
        ],
        [
          { text: '🔄 Generate New', callback_data: `regenerate:${approvalId}` },
        ],
      ],
    },
  });

  console.log(`[telegram] Sent post for approval (id: ${approvalId})`);

  return new Promise((resolve) => {
    pendingApprovals.set(approvalId, resolve);
  });
}

export function stopTelegramBot(): void {
  if (bot) {
    bot.stopPolling();
    bot = null;
  }
}
