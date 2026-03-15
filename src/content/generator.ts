import OpenAI from 'openai';
import { config } from '../config';
import { ClimateTopic } from './topics';
import { ContentArchetype } from './archetypes';
import { CaptionStyle, pickCaptionStyle } from './caption-styles';
import { ResearchFact } from './researcher';

export interface BarDataItem {
  label: string;
  value: number;
  displayValue: string;
  factRef?: string;
}

export interface DonutSegment {
  label: string;
  percent: number;
  highlight?: boolean;
  factRef?: string;
}

export interface CompareItem {
  label: string;
  value: string;
  description: string;
  factRef?: string;
}

export interface RankedItem {
  rank: number;
  label: string;
  value: string;
  factRef?: string;
}

export interface TrendPoint {
  label: string;
  value: number;
  displayValue: string;
  factRef?: string;
}

export interface PictogramData {
  filled: number;
  total: number;
  filledLabel: string;
  emptyLabel: string;
  factRef?: string;
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
  facts: ResearchFact[] = [],
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

You have been provided with VERIFIED RESEARCH FACTS below. Use ONLY these facts for statistics, numbers, and sources. Every stat you use in a slide MUST come from one of the provided facts. Do NOT invent, round, or paraphrase any numbers. If a fact is listed, use its exact value and source.
${toneDirective}

CRITICAL WRITING RULES:

1. Every slide body MUST end with a SPECIFIC, VISCERAL, GUT-PUNCHING consequence — not corporate-speak.

BANNED PHRASES (NEVER use): "health issues", "long-term impacts", "disrupted education", "poor conditions", "environmental damage", "negative effects", "worsening situation", "sacrificing their future", "we need to act", "time is running out", "think about future generations", "make sustainable choices".

REQUIRED: Replace with BRUTAL SPECIFICS — concrete images of real suffering with numbers.

2. Use NUMBERS that SHOCK. Not "many people affected" but exact figures from the research facts.

3. Make every post feel like a WAKE-UP SLAP, not a lecture. The reader should feel uncomfortable, angry, and compelled to share.`;

  const highConfidence = facts.filter(f => f.confidence >= 7);
  const medConfidence = facts.filter(f => f.confidence >= 4 && f.confidence < 7);

  const researchSection = facts.length > 0
    ? `\n\n=== VERIFIED RESEARCH FACTS (sorted by confidence) ===
${highConfidence.length > 0 ? `--- HIGH CONFIDENCE (use these first) ---\n${highConfidence.map(f => `[${f.id}] ${f.claim} — ${f.value} (Source: ${f.source}, ${f.year}) [${f.category}] confidence:${f.confidence}/10${f.origin === 'both' ? ' ✓corroborated' : ''}${f.sourceUrl ? ` URL: ${f.sourceUrl}` : ''}`).join('\n')}` : ''}
${medConfidence.length > 0 ? `\n--- SUPPORTING FACTS (use if needed) ---\n${medConfidence.map(f => `[${f.id}] ${f.claim} — ${f.value} (Source: ${f.source}, ${f.year}) [${f.category}] confidence:${f.confidence}/10${f.sourceUrl ? ` URL: ${f.sourceUrl}` : ''}`).join('\n')}` : ''}
=== END FACTS ===

RULES FOR USING FACTS:
- PREFER high-confidence facts (confidence 7+) and corroborated facts for your main stats
- Every stat in your slides MUST come from one of the facts above
- The "source" field on each slide MUST match the source from the fact you are referencing
- Do NOT invent any numbers not listed above
- If you need a stat that isn't available, leave the stat field as a dash rather than making one up`
    : '';

  const recentSection = recentPosts.length > 0
    ? `\n\nDO NOT repeat any of these angles — they were already posted in the last 7 days:\n${recentPosts.map(p => `- "${p.title}"`).join('\n')}\n\nPick a COMPLETELY DIFFERENT angle, fact, or story.`
    : '';

  const anglesSection = topic.angles?.length > 0
    ? `\n\nPOSSIBLE ANGLES (pick the one best supported by the research facts above):\n${topic.angles.map((a, i) => `${i + 1}. ${a}`).join('\n')}`
    : '';

  const slideCount = archetype?.slideRange
    ? `${archetype.slideRange[0]}-${archetype.slideRange[1]}`
    : '4';

  const archetypeSection = archetype
    ? `\n\nCONTENT ARCHETYPE: "${archetype.name}" (Goal: ${archetype.goal})

COVER SLIDE:
${archetype.coverPrompt}

SLIDE STRUCTURE (follow this EXACTLY):
${archetype.slidePrompt}

BEFORE RESPONDING: Re-read each body. If any uses vague language — REWRITE with specific, quantified consequences.`
    : `\nUsing the research facts above, pick the most compelling angle — one surprising fact, scandal, comparison, or company/person. Be SPECIFIC, not generic. Use ONLY facts from the verified list.

FOR EVERY SLIDE BODY: Follow this structure — (1) state the fact with a specific number from the research, (2) explain why it's significant, (3) describe the real human/environmental cost.

BEFORE RESPONDING: Re-read each body. If any uses vague language — REWRITE with specific, quantified consequences.`;

  const userPrompt = `Create a ${slideCount}-slide Instagram carousel explainer.

Subject: ${topic.subject}
${anglesSection}
${researchSection}
${recentSection}
${archetypeSection}

IMPORTANT RULES:
1. Every slide MUST have a "source" field matching one of the verified research fact sources above.
2. Every slide MUST have a primary stat and a secondary stat — taken directly from the research facts.
3. Every slide MUST have exactly ONE chart. Use a DIFFERENT chart type for each slide. Pick from these 6 types.
4. CRITICAL — CHART DATA INTEGRITY: Every number displayed in a chart MUST come from a research fact above. Add a "factRef" field to EACH chart data point referencing the fact ID (e.g. "F1", "F3"). If you cannot find a research fact to back a chart data point, DO NOT include that data point. NEVER invent chart data.

CHART TYPES (use each at most once, vary across slides — you MUST use at least 3 different types):

A) "bars" — horizontal bar chart comparing entities:
   "chartType": "bars",
   "bars": [
     { "label": "ExxonMobil", "value": 95, "displayValue": "14.3%", "factRef": "F2" },
     { "label": "Shell", "value": 70, "displayValue": "10.6%", "factRef": "F5" }
   ]
   (value is 0-100 for bar width, displayValue is the real number shown, factRef is the fact ID)

B) "donut" — donut/pie chart showing proportions (segments must total ~100):
   "chartType": "donut",
   "donut": [
     { "label": "Fossil fuels", "percent": 73, "highlight": true, "factRef": "F1" },
     { "label": "Agriculture", "percent": 12, "factRef": "F3" },
     { "label": "Industry", "percent": 8, "factRef": "F4" },
     { "label": "Other", "percent": 7, "factRef": "F4" }
   ]

C) "compare" — side-by-side comparison (2 items, stark contrast):
   "chartType": "compare",
   "compare": [
     { "label": "Billionaire", "value": "8,190 tonnes", "description": "Average annual CO2", "factRef": "F6" },
     { "label": "Average person", "value": "4.6 tonnes", "description": "Average annual CO2", "factRef": "F7" }
   ]

D) "ranked" — numbered ranking list (3-5 items):
   "chartType": "ranked",
   "ranked": [
     { "rank": 1, "label": "Saudi Aramco", "value": "59.26 Gt CO2", "factRef": "F1" },
     { "rank": 2, "label": "Chevron", "value": "43.35 Gt CO2", "factRef": "F2" },
     { "rank": 3, "label": "Gazprom", "value": "43.23 Gt CO2", "factRef": "F3" }
   ]

E) "trend" — line/area chart showing change over time (3-5 data points):
   "chartType": "trend",
   "trendLabel": "Global Chemical Production (Million Tonnes)",
   "trend": [
     { "label": "2000", "value": 25, "displayValue": "1.2 Gt", "factRef": "F8" },
     { "label": "2010", "value": 40, "displayValue": "2.1 Gt", "factRef": "F9" },
     { "label": "2020", "value": 65, "displayValue": "3.4 Gt", "factRef": "F10" },
     { "label": "2030", "value": 85, "displayValue": "4.5 Gt", "factRef": "F11" }
   ]
   (value is 0-100 for Y-axis position. displayValue is the REAL number shown on each point. trendLabel is the chart title describing what the axis measures. GREAT for timeline archetypes.)

F) "pictogram" — icon grid showing proportion (e.g., 7 out of 10 people affected):
   "chartType": "pictogram",
   "pictogram": {
     "filled": 7,
     "total": 10,
     "filledLabel": "Affected by flooding",
     "emptyLabel": "Not affected",
     "factRef": "F12"
   }
   (filled/total MUST be derived from a real percentage or proportion in the research facts. E.g., if a fact says "73% of emissions", use filled:7 total:10. factRef is REQUIRED. NEVER guess proportions.)

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
      "source": "Specific data source from the verified facts"
    }
  ],
  "ctaText": "",
  "source": "Overall sources",
  "caption": "Write this using the CAPTION STYLE instructions above. Do NOT include any hashtags — they will be added separately.",
  "imagePrompt": ""
}`;

  const maxSlides = archetype?.slideRange?.[1] ?? 4;
  const maxTokens = 1800 + (maxSlides * 350);

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: maxTokens,
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

  if (facts.length > 0) {
    parsed = await validateChartData(parsed, facts);
  }

  const captionWithoutTags = parsed.caption.replace(/#\w+/g, '').replace(/\s+/g, ' ').trim();
  const hashtagCount = 8 + Math.floor(Math.random() * 5); // 8-12 hashtags
  parsed.caption = `${captionWithoutTags}\n\n${pickRandomHashtags(hashtagCount)}`;

  return parsed;
}

function extractChartClaims(slide: SlideContent): { description: string; factRef?: string }[] {
  const claims: { description: string; factRef?: string }[] = [];

  if (slide.pictogram) {
    claims.push({
      description: `Pictogram: ${slide.pictogram.filled}/${slide.pictogram.total} "${slide.pictogram.filledLabel}" vs "${slide.pictogram.emptyLabel}"`,
      factRef: slide.pictogram.factRef,
    });
  }
  if (slide.bars) {
    for (const bar of slide.bars) {
      claims.push({ description: `Bar: "${bar.label}" = ${bar.displayValue}`, factRef: bar.factRef });
    }
  }
  if (slide.donut) {
    for (const seg of slide.donut) {
      claims.push({ description: `Donut segment: "${seg.label}" = ${seg.percent}%`, factRef: seg.factRef });
    }
  }
  if (slide.compare) {
    for (const item of slide.compare) {
      claims.push({ description: `Compare: "${item.label}" = ${item.value} (${item.description})`, factRef: item.factRef });
    }
  }
  if (slide.ranked) {
    for (const item of slide.ranked) {
      claims.push({ description: `Ranked #${item.rank}: "${item.label}" = ${item.value}`, factRef: item.factRef });
    }
  }
  if (slide.trend) {
    for (const pt of slide.trend) {
      claims.push({ description: `Trend point: "${pt.label}" = ${pt.displayValue}`, factRef: pt.factRef });
    }
  }

  return claims;
}

async function validateChartData(content: GeneratedContent, facts: ResearchFact[]): Promise<GeneratedContent> {
  const factMap = new Map(facts.map(f => [f.id, f]));

  const allClaims: { slideIndex: number; description: string; factRef?: string }[] = [];
  for (let i = 0; i < content.slides.length; i++) {
    const claims = extractChartClaims(content.slides[i]);
    for (const c of claims) {
      allClaims.push({ slideIndex: i, ...c });
    }
  }

  if (allClaims.length === 0) {
    console.log('[validation] No chart data to validate');
    return content;
  }

  const claimsWithFacts = allClaims.map(c => {
    const fact = c.factRef ? factMap.get(c.factRef) : undefined;
    return {
      ...c,
      referencedFact: fact ? `[${fact.id}] ${fact.claim} — ${fact.value} (${fact.source}, ${fact.year})` : 'NO FACT REFERENCED',
    };
  });

  const validationPrompt = claimsWithFacts
    .map((c, i) => `${i + 1}. CHART: ${c.description}\n   FACT: ${c.referencedFact}`)
    .join('\n');

  const openai = getClient();
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You verify whether chart data accurately represents its referenced research fact.
For each pair, answer PASS or FAIL:
- PASS: The chart data point correctly represents what the fact says. The number and meaning match.
- FAIL: The number is misapplied (e.g. using a CO2 percentage as a poverty stat), the fact doesn't support the claim, or no fact is referenced.
Be STRICT. A number from one context applied to a different context is a FAIL.
Return ONLY a JSON array of verdicts, no markdown. Example: [{"index":1,"verdict":"PASS"},{"index":2,"verdict":"FAIL","reason":"fact is about CO2 not poverty"}]`,
      },
      {
        role: 'user',
        content: `Verify these chart data points against their referenced research facts:\n\n${validationPrompt}`,
      },
    ],
    temperature: 0,
    max_tokens: 1500,
  });

  const raw = response.choices[0]?.message?.content?.trim();
  if (!raw) {
    console.warn('[validation] Empty response from validator, keeping all charts');
    return content;
  }

  let verdicts: { index: number; verdict: string; reason?: string }[];
  try {
    verdicts = JSON.parse(raw);
  } catch {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      verdicts = JSON.parse(jsonMatch[0]);
    } else {
      console.warn('[validation] Failed to parse validation response, keeping all charts');
      return content;
    }
  }

  const failedIndices = new Set<number>();
  for (const v of verdicts) {
    const idx = v.index - 1;
    if (v.verdict === 'FAIL' && claimsWithFacts[idx]) {
      const claim = claimsWithFacts[idx];
      console.warn(`[validation] FAIL slide ${claim.slideIndex + 1}: ${claim.description} — ${v.reason || 'mismatched context'}`);
      failedIndices.add(idx);
    }
  }

  function toChartCategory(desc: string): string {
    const lower = desc.toLowerCase();
    if (lower.startsWith('pictogram')) return 'pictogram';
    if (lower.startsWith('bar')) return 'bars';
    if (lower.startsWith('donut')) return 'donut';
    if (lower.startsWith('compare')) return 'compare';
    if (lower.startsWith('ranked')) return 'ranked';
    if (lower.startsWith('trend')) return 'trend';
    return lower.split(':')[0].trim();
  }

  const failedSlideCharts = new Map<number, Set<string>>();
  for (const idx of failedIndices) {
    const claim = claimsWithFacts[idx];
    if (!failedSlideCharts.has(claim.slideIndex)) {
      failedSlideCharts.set(claim.slideIndex, new Set());
    }
    failedSlideCharts.get(claim.slideIndex)!.add(toChartCategory(claim.description));
  }

  let removedCount = 0;
  for (const [slideIdx, failedTypes] of failedSlideCharts) {
    const slide = content.slides[slideIdx];

    if (failedTypes.has('pictogram') && slide.pictogram) {
      console.log(`[validation] Removing pictogram from slide ${slideIdx + 1}`);
      delete slide.pictogram;
      if (slide.chartType === 'pictogram') delete slide.chartType;
      removedCount++;
    }
    if (failedTypes.has('bars') && slide.bars) {
      console.log(`[validation] Removing bars from slide ${slideIdx + 1}`);
      delete slide.bars;
      if (slide.chartType === 'bars') delete slide.chartType;
      removedCount++;
    }
    if (failedTypes.has('donut') && slide.donut) {
      console.log(`[validation] Removing donut from slide ${slideIdx + 1}`);
      delete slide.donut;
      if (slide.chartType === 'donut') delete slide.chartType;
      removedCount++;
    }
    if (failedTypes.has('compare') && slide.compare) {
      console.log(`[validation] Removing compare from slide ${slideIdx + 1}`);
      delete slide.compare;
      if (slide.chartType === 'compare') delete slide.chartType;
      removedCount++;
    }
    if (failedTypes.has('ranked') && slide.ranked) {
      console.log(`[validation] Removing ranked from slide ${slideIdx + 1}`);
      delete slide.ranked;
      if (slide.chartType === 'ranked') delete slide.chartType;
      removedCount++;
    }
    if (failedTypes.has('trend') && slide.trend) {
      console.log(`[validation] Removing trend from slide ${slideIdx + 1}`);
      delete slide.trend;
      delete slide.trendLabel;
      if (slide.chartType === 'trend') delete slide.chartType;
      removedCount++;
    }
  }

  const passCount = allClaims.length - failedIndices.size;
  console.log(`[validation] ${passCount}/${allClaims.length} chart data points verified (${removedCount} charts removed)`);

  return content;
}
