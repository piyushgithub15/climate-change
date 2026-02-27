import OpenAI from 'openai';
import { config } from '../config';
import { ClimateTopic } from './topics';

export interface BarDataItem {
  label: string;
  value: number;
  displayValue: string;
}

export interface DonutSegment {
  label: string;
  percent: number;
  highlight?: boolean;
}

export interface CompareItem {
  label: string;
  value: string;
  description: string;
}

export interface RankedItem {
  rank: number;
  label: string;
  value: string;
}

export type ChartType = 'bars' | 'donut' | 'compare' | 'ranked';

export interface SlideContent {
  heading: string;
  body: string;
  stat: string;
  statLabel: string;
  secondaryStat?: string;
  secondaryStatLabel?: string;
  chartType?: ChartType;
  bars?: BarDataItem[];
  donut?: DonutSegment[];
  compare?: CompareItem[];
  ranked?: RankedItem[];
  source: string;
}

export interface GeneratedContent {
  coverTitle: string;
  coverSubtitle: string;
  slides: SlideContent[];
  ctaText: string;
  caption: string;
  imagePrompt: string;
  source: string;
}

function getClient(): OpenAI {
  if (!config.openaiApiKey) {
    throw new Error('OPENAI_API_KEY is not set in .env');
  }
  return new OpenAI({ apiKey: config.openaiApiKey });
}

export async function generateContent(
  topic: ClimateTopic,
  recentPosts: { topic_id: string; title: string }[] = [],
): Promise<GeneratedContent> {
  const client = getClient();

  const systemPrompt = `You are a climate change investigative journalist creating Instagram carousel explainers. 
You focus on corporate accountability, naming specific companies, CEOs, billionaires, and industry leaders responsible for climate damage.
Always cite real statistics from reputable sources (IPCC, Carbon Disclosure Project, Climate Accountability Institute, peer-reviewed studies).
Never fabricate numbers. Name real companies and people with verified facts.
Your tone is direct, factual, and educational — like a mini documentary in slides.`;

  const recentSection = recentPosts.length > 0
    ? `\n\nDO NOT repeat any of these angles — they were already posted in the last 7 days:\n${recentPosts.map(p => `- "${p.title}"`).join('\n')}\n\nPick a COMPLETELY DIFFERENT angle, fact, or story.`
    : '';

  const userPrompt = `Create a 4-slide Instagram carousel explainer.

Theme: ${topic.theme}
Context: ${topic.description}
${recentSection}

Pick a FRESH, SPECIFIC angle. Don't be generic — zoom into one surprising fact, one scandal, one comparison, or one person/company. Use real, verified data from reputable sources.

IMPORTANT RULES:
1. Every slide MUST have a "source" field with the actual data source (e.g., "CDP 2024", "IPCC AR6", "Oxfam 2023").
2. Every slide MUST have a primary stat and a secondary stat.
3. Every slide MUST have exactly ONE chart. Use a DIFFERENT chart type for each slide. Pick from these 4 types:

CHART TYPES (use each at most once, vary across slides):

A) "bars" — horizontal bar chart comparing entities:
   "chartType": "bars",
   "bars": [
     { "label": "ExxonMobil", "value": 95, "displayValue": "14.3%" },
     { "label": "Shell", "value": 70, "displayValue": "10.6%" }
   ]
   (value is 0-100 for bar width, displayValue is the real number shown)

B) "donut" — donut/pie chart showing proportions (segments must total ~100):
   "chartType": "donut",
   "donut": [
     { "label": "Fossil fuels", "percent": 73, "highlight": true },
     { "label": "Agriculture", "percent": 12 },
     { "label": "Industry", "percent": 8 },
     { "label": "Other", "percent": 7 }
   ]

C) "compare" — side-by-side comparison (2 items, stark contrast):
   "chartType": "compare",
   "compare": [
     { "label": "Billionaire", "value": "8,190 tonnes", "description": "Average annual CO2" },
     { "label": "Average person", "value": "4.6 tonnes", "description": "Average annual CO2" }
   ]

D) "ranked" — numbered ranking list (3-5 items):
   "chartType": "ranked",
   "ranked": [
     { "rank": 1, "label": "Saudi Aramco", "value": "59.26 Gt CO2" },
     { "rank": 2, "label": "Chevron", "value": "43.35 Gt CO2" },
     { "rank": 3, "label": "Gazprom", "value": "43.23 Gt CO2" }
   ]

Respond in this exact JSON format (no markdown, no code fences, just raw JSON):
{
  "coverTitle": "Bold title (max 8 words)",
  "coverSubtitle": "Hook that makes people swipe (max 15 words)",
  "slides": [
    {
      "heading": "Heading (max 6 words)",
      "body": "2-3 sentences with specific names and data.",
      "stat": "Primary number",
      "statLabel": "What it represents",
      "secondaryStat": "Secondary number",
      "secondaryStatLabel": "What it means",
      "chartType": "one of: bars, donut, compare, ranked",
      "bars or donut or compare or ranked": "array matching the chosen chartType",
      "source": "Specific data source (e.g., 'IPCC AR6, 2023')"
    }
  ],
  "ctaText": "",
  "source": "Overall sources",
  "caption": "Engaging 3-4 sentence caption. Start with 'Swipe to learn more'. End with 10-12 hashtags.",
  "imagePrompt": ""
}`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2500,
  });

  const raw = response.choices[0]?.message?.content?.trim();
  if (!raw) throw new Error('Empty response from GPT-4o');

  try {
    const parsed = JSON.parse(raw) as GeneratedContent;
    if (!parsed.coverTitle || !parsed.slides || !parsed.caption) {
      throw new Error('Missing required fields in GPT response');
    }
    return parsed;
  } catch (err) {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as GeneratedContent;
    }
    throw new Error(`Failed to parse GPT-4o response: ${err}`);
  }
}
