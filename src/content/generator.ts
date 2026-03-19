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

export type ChartType = 'bars' | 'donut' | 'compare' | 'ranked' | 'trend';

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
  source: string;
  sourceUrl?: string;
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

  const systemPrompt = `You are a data-driven climate journalist. Your carousels are fact-heavy, number-dense, and evidence-based — like investigative reports compressed into Instagram slides. Every slide must teach the reader something concrete they didn't know before, backed by hard data.

EDITORIAL PRINCIPLES:
- LEAD WITH DATA — every slide opens with a specific number, percentage, dollar amount, or measurable claim. No slide should start with a generic statement.
- NAME THE GUILTY — but ONLY if the research facts mention specific corporations, people, or entities.
- FOLLOW THE MONEY — expose profiteers using data from the research facts.
- SHOW CAUSE AND EFFECT — connect facts to consequences with specific numbers on both sides.
- GLOBAL AUDIENCE WITH LOCAL DEPTH — use whatever geography the research facts support.

STRICT DATA RULE: Use ONLY the VERIFIED RESEARCH FACTS provided below. Every number, stat, company name, and comparison MUST come from the provided facts. Do NOT use your own knowledge for data. If a fact isn't in the research, don't use it.
${toneDirective}

WRITING QUALITY — THIS IS NON-NEGOTIABLE:

1. Each slide body must be 3-5 sentences. EVERY sentence must contain at least one specific number, name, or measurable claim from the research. Sentences without data are filler — remove them.

2. DATA DENSITY over commentary. Pack each slide with facts. A great slide has 3-4 different data points woven into a tight narrative. Don't waste sentences on opinions, rhetorical questions, or moralizing — let the numbers speak.

3. SPECIFIC CONSEQUENCES — every slide must end with a concrete, quantified consequence from the research. Not "this causes problems" but "this killed 1,200 people in Karachi in 2023."

4. LOGICAL FLOW — slides must build on each other. Each slide adds a new dimension of evidence. The carousel should feel like layers of proof stacking up.

BANNED PHRASES (instant quality failure):
"health issues", "long-term impacts", "disrupted education", "poor conditions", "environmental damage", "negative effects", "worsening situation", "sacrificing their future", "we need to act", "time is running out", "think about future generations", "make sustainable choices", "devastating consequences", "alarming rate", "wake-up call", "raises serious concerns", "it remains to be seen", "only time will tell", "food for thought", "let that sink in", "read that again", "pause and think".

5. Use EXACT NUMBERS from the research facts. Never "many people" — always the specific figure.

6. NEVER recycle generic stats. Every statistic must come from the VERIFIED RESEARCH FACTS and must be relevant to the specific topic.`;

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
2. Every slide MUST have a primary stat taken directly from the research facts. Secondary stat is optional — only include if a second number genuinely strengthens the slide.
3. Charts are OPTIONAL — only include a chart when the data naturally lends itself to visual comparison (rankings, proportions, trends over time, stark contrasts). A slide with powerful writing and a strong stat is BETTER than a slide with a forced chart. If you do include charts, use at most 2-3 across the entire carousel, not on every slide.
4. CRITICAL — CHART DATA INTEGRITY: Every number displayed in a chart MUST come from a research fact above. Add a "factRef" field to EACH chart data point referencing the fact ID (e.g. "F1", "F3"). If you cannot find a research fact to back a chart data point, DO NOT include that data point. NEVER invent chart data.
5. BODY TEXT QUALITY: Each slide body must be 4-6 sentences of analytical writing. Connect facts to causes, explain mechanisms, quantify consequences. Every sentence must earn its place.

CHART TYPES (vary across slides — you MUST use at least 3 different types):

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

CAPTION STYLE FOR THIS POST: "${selectedCaptionStyle.name}" — ${selectedCaptionStyle.purpose}
${selectedCaptionStyle.prompt}

Respond in this exact JSON format (no markdown, no code fences, just raw JSON):
{
  "coverTitle": "Bold title (max 8 words)",
  "coverSubtitle": "Hook that makes people swipe (max 15 words)",
  "slides": [
    {
      "heading": "Heading (max 6 words, punchy)",
      "body": "4-6 sentences of substantive analysis. State the fact, explain WHY it matters, connect it to the system, and end with a specific quantified consequence. Each sentence must add new information.",
      "stat": "Primary number from research facts",
      "statLabel": "What it represents (concise)",
      "secondaryStat": "Optional secondary number — only if it genuinely strengthens the slide",
      "secondaryStatLabel": "What it means",
      "chartType": "OPTIONAL — only include if data naturally suits visualization. One of: bars, donut, compare, ranked, trend",
      "[chartType key]": "data array/object matching the chosen chartType — only if chartType is included",
      "source": "Specific data source from the verified facts",
      "sourceUrl": "URL of the source (from the research fact's URL field). If no URL available, leave empty string."
    }
  ],
  "ctaText": "",
  "source": "Overall sources",
  "caption": "Write this using the CAPTION STYLE instructions above. Do NOT include any hashtags — they will be added separately.",
  "imagePrompt": ""
}`;

  const maxSlides = archetype?.slideRange?.[1] ?? 4;
  const maxTokens = 2800 + (maxSlides * 500);

  const response = await client.chat.completions.create({
    model: 'gpt-5.4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.5,
    max_completion_tokens: maxTokens,
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
    patchEmptyStats(parsed, facts);
  }

  const captionWithoutTags = parsed.caption.replace(/#\w+/g, '').replace(/\s+/g, ' ').trim();

  const sourceUrls = new Map<string, string>();
  for (const slide of parsed.slides) {
    if (slide.sourceUrl && slide.sourceUrl.trim()) {
      sourceUrls.set(slide.source, slide.sourceUrl.trim());
    }
  }
  for (const f of facts) {
    if (f.sourceUrl && f.sourceUrl.trim() && !sourceUrls.has(f.source)) {
      const usedInSlide = parsed.slides.some(s => s.source === f.source);
      if (usedInSlide) sourceUrls.set(f.source, f.sourceUrl.trim());
    }
  }

  const sourcesBlock = sourceUrls.size > 0
    ? `\n\n📎 Sources:\n${[...sourceUrls.entries()].map(([name, url]) => `• ${name}: ${url}`).join('\n')}`
    : '';

  const hashtagCount = 8 + Math.floor(Math.random() * 5);
  parsed.caption = `${captionWithoutTags}${sourcesBlock}\n\n${pickRandomHashtags(hashtagCount)}`;

  return parsed;
}

function isDash(val: string | undefined): boolean {
  return !val || val === '-' || val === '–' || val === '—' || val.trim() === '';
}

function patchEmptyStats(content: GeneratedContent, facts: ResearchFact[]): void {
  const usedFactIds = new Set<string>();

  for (const slide of content.slides) {
    if (!isDash(slide.stat)) {
      const match = facts.find(f => slide.stat.includes(f.value) || f.value.includes(slide.stat));
      if (match) usedFactIds.add(match.id);
    }
  }

  for (const slide of content.slides) {
    if (isDash(slide.stat)) {
      const available = facts.filter(f => !usedFactIds.has(f.id));
      const pick = available[0] || facts[0];
      if (pick) {
        slide.stat = pick.value;
        slide.statLabel = pick.claim.length > 60 ? pick.claim.slice(0, 57) + '...' : pick.claim;
        usedFactIds.add(pick.id);
        console.log(`[patch-stats] Filled empty stat on "${slide.heading}" with [${pick.id}] ${pick.value}`);
      }
    }

    if (isDash(slide.secondaryStat)) {
      slide.secondaryStat = undefined;
      slide.secondaryStatLabel = undefined;
    }
  }
}

function extractChartClaims(slide: SlideContent): { description: string; factRef?: string }[] {
  const claims: { description: string; factRef?: string }[] = [];

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
    model: 'gpt-4.1-mini',
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
