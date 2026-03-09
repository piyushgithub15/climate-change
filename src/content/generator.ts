import OpenAI from 'openai';
import { config } from '../config';
import { ClimateTopic } from './topics';
import { ContentArchetype } from './archetypes';
import { CaptionStyle, pickCaptionStyle } from './caption-styles';

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

export interface TrendPoint {
  label: string;
  value: number;
  displayValue: string;
}

export interface PictogramData {
  filled: number;
  total: number;
  filledLabel: string;
  emptyLabel: string;
}

export type ChartType = 'bars' | 'donut' | 'compare' | 'ranked' | 'trend' | 'pictogram';

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
  trend?: TrendPoint[];
  trendLabel?: string;
  pictogram?: PictogramData;
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

const HASHTAG_POOL = [
  '#ClimateCrisis', '#ClimateEmergency', '#ClimateCollapse', '#ClimateBreakdown',
  '#ClimateJustice', '#ClimateTruth', '#ClimateReality', '#ClimateFacts',
  '#SystemChange', '#SystemicFailure', '#CorporateGreed', '#CorporateAccountability',
  '#BigOilLies', '#FossilFuelCrimes', '#EndFossilFuels', '#FossilFuelLobby',
  '#PollutionKills', '#Greenwashing', '#GreenwashingExposed', '#NetZeroScam',
  '#PlanetOverProfit', '#PeopleOverProfit', '#WakeUp', '#OpenYourEyes',
  '#ClimateAction', '#ClimateActivism', '#Degrowth', '#Overconsumption',
  '#EatTheRich', '#TaxTheRich', '#BillionaireHypocrisy', '#WealthInequality',
  '#MassExtinction', '#SixthExtinction', '#BiodiversityLoss', '#EcosystemCollapse',
  '#WaterCrisis', '#FoodCrisis', '#HungerCrisis', '#ClimateRefugees',
  '#EnvironmentalRacism', '#EnvironmentalJustice', '#IndiaClimateCrisis',
  '#HimalayanMeltdown', '#MonsoonCrisis', '#Deforestation', '#SaveForests',
  '#AirPollution', '#ToxicAir', '#Microplastics', '#OceanDeath',
  '#HeatWave', '#ExtremeWeather', '#ClimateDisaster', '#Tipping',
  '#ParisAgreementFailed', '#COPFailure', '#ClimateScam', '#WakeUpIndia',
  '#PopulationCrisis', '#Overpopulation', '#ConsumptionCrisis', '#BoilingPoint',
];

function pickRandomHashtags(count: number = 10): string {
  const shuffled = [...HASHTAG_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).join(' ');
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
  researchData: string = '',
  archetype?: ContentArchetype,
  captionStyle?: CaptionStyle,
): Promise<GeneratedContent> {
  const client = getClient();

  const currentYear = new Date().getFullYear();
  const selectedCaptionStyle = captionStyle ?? pickCaptionStyle(archetype?.id);

  const toneDirective = archetype
    ? `\nTONE: ${archetype.toneDirective}`
    : '\nYour tone is direct, factual, and educational — like a mini documentary in slides.';

  const systemPrompt = `You are a RADICAL climate truth-teller creating Instagram carousels that refuse to sugarcoat the existential crisis facing humanity. You are NOT neutral. You are ANGRY. You are FACTUAL. You are URGENT.

Your approach:
- NAME THE GUILTY. Name specific corporations, billionaires, CEOs, politicians, and industries. Don't say "fossil fuel industry" — say "Saudi Aramco, ExxonMobil, Shell, Chevron, and Gazprom."
- FOLLOW THE MONEY. Every climate crime has a profiteer. Expose them.
- ATTACK THE SYSTEM, NOT THE INDIVIDUAL. The common person recycling is not the problem. 30 corporations producing 71% of emissions IS. The billionaire flying private jets while preaching sustainability IS.
- INDIA-FOCUSED WITH GLOBAL CONTEXT. Your primary audience is Indian. Use Indian examples, Indian cities, Indian data wherever possible — then connect to the global picture. Mention Indian states (UP, Bihar, Rajasthan), Indian rivers (Ganga, Yamuna), Indian realities (80 crore people on free rations, informal workers in 50°C heat).

You have been provided with LIVE WEB RESEARCH data below — use ONLY the facts, statistics, and sources from that research. Do NOT hallucinate any numbers. If a stat is in the research, use it with its exact source.

RADICAL FRAMING (CRITICAL):
- The climate crisis is NOT a "future problem." It is HERE. NOW. People are DYING today.
- Development vs Environment is a FALSE CHOICE — your body IS the Earth. Same water, same minerals, same temperature sensitivity. Destroying one destroys the other.
- The Paris Agreement FAILED — emissions were supposed to DROP 44% by 2030, instead they INCREASED 3%. Every COP is theater.
- Population × per-capita consumption = total emissions. This is the equation nobody will discuss because it requires uncomfortable truths.
- 100-1,000 species are going extinct EVERY SINGLE DAY. We are living through the 6th mass extinction and scrolling through Instagram.
- The rich KNOW what's coming. They're buying bunkers and building rockets. They plan to LEAVE. You will be left behind.
- Media covers ZERO minutes of climate per day. Your ignorance is by design. The same billionaires causing emissions control what you see on TV and social media.
- "2°C average" means PEAK DAYS OF 55-60°C. With humidity, felt temperature hits 15°C above actual. Your AC, bike, car, and phone will fail in that heat.
${toneDirective}

CRITICAL WRITING RULES:

1. Every slide body MUST end with a SPECIFIC, VISCERAL, GUT-PUNCHING consequence — not corporate-speak.

BANNED PHRASES (NEVER use): "health issues", "long-term impacts", "disrupted education", "poor conditions", "environmental damage", "negative effects", "worsening situation", "sacrificing their future", "we need to act", "time is running out", "think about future generations", "make sustainable choices".

REQUIRED: Replace with BRUTAL SPECIFICS like: "rickshaw drivers collapsing dead on Delhi roads at 52°C", "80 crore Indians who depend on free rations watching crops fail", "Himalayan glaciers disappearing — first the floods, then permanent drought for 75 crore people", "your child breathing microplastics with every single breath", "birds burning alive mid-flight in 50°C heat", "100 cities in India running out of water within 5 years".

2. Use NUMBERS that SHOCK. Not "many people affected" but "1.2 BILLION climate refugees by 2050 — that's 15% of all humans alive." Not "rising temperatures" but "India lost 10% of GDP to climate change THIS YEAR alone — heading to 30-40% loss."

3. Make every post feel like a WAKE-UP SLAP, not a lecture. The reader should feel uncomfortable, angry, and compelled to share.`;

  const recentSection = recentPosts.length > 0
    ? `\n\nDO NOT repeat any of these angles — they were already posted in the last 7 days:\n${recentPosts.map(p => `- "${p.title}"`).join('\n')}\n\nPick a COMPLETELY DIFFERENT angle, fact, or story.`
    : '';

  const researchSection = researchData
    ? `\n\n=== LIVE WEB RESEARCH (use these facts and sources) ===\n${researchData}\n=== END RESEARCH ===`
    : '';

  const archetypeSection = archetype
    ? `\n\nCONTENT ARCHETYPE: "${archetype.name}" (Goal: ${archetype.goal})

COVER SLIDE:
${archetype.coverPrompt}

SLIDE STRUCTURE (follow this EXACTLY):
${archetype.slidePrompt}

BEFORE RESPONDING: Re-read each body. If any uses vague language — REWRITE with specific, quantified consequences.`
    : `\nUsing the research data above, pick the most compelling angle — one surprising fact, scandal, comparison, or company/person. Be SPECIFIC, not generic. Use ONLY real data from the research.

FOR EVERY SLIDE BODY: Follow this structure — (1) state the fact with a specific number, (2) explain why it's significant, (3) describe the real human/environmental cost.

BEFORE RESPONDING: Re-read each body. If any uses vague language — REWRITE with specific, quantified consequences.`;

  const userPrompt = `Create a 4-slide Instagram carousel explainer.

Theme: ${topic.theme}
${researchSection}
${recentSection}
${archetypeSection}

IMPORTANT RULES:
1. Every slide MUST have a "source" field with a REAL, SPECIFIC data source AND year from the research (e.g., "IEA World Energy Outlook ${currentYear}", "UNEP Emissions Gap Report ${currentYear - 1}").
2. Every slide MUST have a primary stat and a secondary stat — taken directly from the research data.
3. Every slide MUST have exactly ONE chart. Use a DIFFERENT chart type for each slide. Pick from these 6 types:

CHART TYPES (use each at most once, vary across slides — you MUST use at least 3 different types):

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

E) "trend" — line/area chart showing change over time (3-5 data points):
   "chartType": "trend",
   "trendLabel": "Global Chemical Production (Million Tonnes)",
   "trend": [
     { "label": "2000", "value": 25, "displayValue": "1.2 Gt" },
     { "label": "2010", "value": 40, "displayValue": "2.1 Gt" },
     { "label": "2020", "value": 65, "displayValue": "3.4 Gt" },
     { "label": "2030", "value": 85, "displayValue": "4.5 Gt" }
   ]
   (value is 0-100 for Y-axis position. displayValue is the REAL number shown on each point. trendLabel is the chart title describing what the axis measures. GREAT for timeline archetypes.)

F) "pictogram" — icon grid showing proportion (e.g., 7 out of 10 people affected):
   "chartType": "pictogram",
   "pictogram": {
     "filled": 7,
     "total": 10,
     "filledLabel": "Affected by flooding",
     "emptyLabel": "Not affected"
   }
   (filled/total are counts 1-10. GREAT for human-scale proportions like "7 in 10 people" or "3 out of 5 countries".)

CAPTION STYLE FOR THIS POST: "${selectedCaptionStyle.name}" — ${selectedCaptionStyle.purpose}
${selectedCaptionStyle.prompt}

Respond in this exact JSON format (no markdown, no code fences, just raw JSON):
{
  "coverTitle": "Bold title (max 8 words)",
  "coverSubtitle": "Hook that makes people swipe (max 15 words)",
  "slides": [
    {
      "heading": "Heading (max 6 words)",
      "body": "2-3 sentences with specific consequences and numbers. NEVER use vague phrases.",
      "stat": "Primary number",
      "statLabel": "What it represents",
      "secondaryStat": "Secondary number",
      "secondaryStatLabel": "What it means",
      "chartType": "one of: bars, donut, compare, ranked, trend, pictogram",
      "[chartType key]": "data array/object matching the chosen chartType",
      "source": "Specific data source (e.g., 'IPCC AR6, 2023')"
    }
  ],
  "ctaText": "",
  "source": "Overall sources",
  "caption": "Write this using the CAPTION STYLE instructions above. Do NOT include any hashtags — they will be added separately.",
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

  let parsed: GeneratedContent;
  try {
    parsed = JSON.parse(raw) as GeneratedContent;
    if (!parsed.coverTitle || !parsed.slides || !parsed.caption) {
      throw new Error('Missing required fields in GPT response');
    }
  } catch (err) {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]) as GeneratedContent;
    } else {
      throw new Error(`Failed to parse GPT-4o response: ${err}`);
    }
  }

  const captionWithoutTags = parsed.caption.replace(/#\w+/g, '').replace(/\s+/g, ' ').trim();
  const hashtagCount = 8 + Math.floor(Math.random() * 5); // 8-12 hashtags
  parsed.caption = `${captionWithoutTags}\n\n${pickRandomHashtags(hashtagCount)}`;

  return parsed;
}
