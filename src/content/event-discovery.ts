import { tavily } from '@tavily/core';
import OpenAI from 'openai';
import { config } from '../config';

export interface ClimateEvent {
  headline: string;
  summary: string;
  location: string;
  impactScore: number;
  sourceUrl: string;
  sourceName: string;
  publishedDate: string;
}

const NEWS_DOMAINS = [
  'reuters.com',
  'bbc.com',
  'theguardian.com',
  'aljazeera.com',
  'apnews.com',
  'carbonbrief.org',
  'climatechangenews.com',
  'scientificamerican.com',
  'nature.com',
  'phys.org',
];

function getTavilyClient() {
  if (!config.tavilyApiKey) throw new Error('TAVILY_API_KEY is not set');
  return tavily({ apiKey: config.tavilyApiKey });
}

function getOpenAIClient(): OpenAI {
  if (!config.openaiApiKey) throw new Error('OPENAI_API_KEY is not set');
  return new OpenAI({ apiKey: config.openaiApiKey });
}

export async function discoverClimateEvent(): Promise<ClimateEvent | null> {
  const client = getTavilyClient();

  const response = await client.search(
    'breaking climate change weather extreme event disaster record temperature today',
    {
      searchDepth: 'advanced',
      maxResults: 8,
      topic: 'news',
      timeRange: 'week',
      includeDomains: NEWS_DOMAINS,
      includeAnswer: false,
    }
  );

  if (response.results.length === 0) {
    console.log('[event-discovery] No climate news found');
    return null;
  }

  const snippets = response.results
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content}`)
    .join('\n\n');

  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You pick the single most impactful climate event from news snippets.
Rules:
- Pick the event with the HIGHEST visual and emotional impact for Instagram
- Prefer: record temperatures, extreme weather disasters, major policy decisions, corporate scandals, ice melt records, species extinction events
- Avoid: opinion pieces, previews of upcoming conferences, minor local stories
- Return ONLY valid JSON, no markdown fences`,
      },
      {
        role: 'user',
        content: `Pick the BEST climate event for an Instagram post from these news articles:

${snippets}

Return JSON:
{"headline":"short punchy headline for Instagram","summary":"2-3 sentence summary of the event","location":"country or region","impactScore":1-10,"sourceUrl":"url","sourceName":"publication name","publishedDate":"YYYY-MM-DD or best guess"}`,
      },
    ],
    temperature: 0.2,
    max_tokens: 500,
  });

  const raw = completion.choices[0]?.message?.content?.trim();
  if (!raw) return null;

  try {
    const event: ClimateEvent = JSON.parse(raw);
    if (event.impactScore < 4) {
      console.log(`[event-discovery] Best event scored ${event.impactScore}/10 — too low, skipping`);
      return null;
    }
    console.log(`[event-discovery] Found: "${event.headline}" (impact: ${event.impactScore}/10)`);
    return event;
  } catch {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const event: ClimateEvent = JSON.parse(jsonMatch[0]);
      console.log(`[event-discovery] Found: "${event.headline}" (impact: ${event.impactScore}/10)`);
      return event;
    }
    console.warn('[event-discovery] Failed to parse event selection');
    return null;
  }
}
