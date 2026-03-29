export interface CaptionStyle {
  id: string;
  name: string;
  purpose: string;
  prompt: string;
}

export const CAPTION_STYLES: CaptionStyle[] = [
  {
    id: 'data-question',
    name: 'The Data Question',
    purpose: 'Spark comments through data-driven questions',
    prompt: `Write a DATA QUESTION caption. Structure:
1. Opening line — state the most striking data point from the post (1 sentence).
2. Context — 1-2 sentences adding a second data point or comparison that creates tension.
3. Direct question — pose a clear question that the data raises naturally.

Keep it 4-6 lines total. Tone: direct, curious, data-grounded. The question should emerge from the numbers, not from opinion.

Example structure:
"The top 10% of earners produce 50% of global emissions.
The bottom 50% produce 12%.

Per-capita emissions in Qatar are 70x higher than in Malawi.

What does equitable mean in a system shaped like this?"`,
  },
  {
    id: 'you-framing',
    name: 'The "You" Framing',
    purpose: 'Increase relatability through personal data',
    prompt: `Write a "YOU" FRAMING caption. Structure:
1. Personal data — list 2-3 measured impacts that affect the reader's daily life (use "your/you") with specific figures.
2. Causal link — 1 sentence connecting it to a measured climate trend.
3. Reflective question — end with a question the reader can answer from their own experience.

Keep it 4-6 lines total. Use second person throughout. Every line must contain a number.

Example structure:
"Your grocery bill is up 23% in three years.
Your city recorded 47 days above 40°C last year.
Your insurance premiums rose 18% since 2020.

Global average temperature is 1.3°C above pre-industrial baseline.

What does 2°C look like in your budget?"`,
  },
  {
    id: 'save-optimized',
    name: 'The Save-Optimized',
    purpose: 'Drive saves through reference-worthy data',
    prompt: `Write a SAVE-OPTIMIZED caption. Structure:
1. Summary — 1-2 sentences stating the most important data points from the post.
2. Future relevance — explain why these numbers will be worth comparing to future data.
3. Save prompt — end with a line suggesting the reader bookmark this as a data reference.

Keep it 3-5 lines total. Tone: informative, precise, practical. Make the reader feel this data will be useful to revisit.

Example structure:
"As of 2025, atmospheric CO2 is at 427 ppm. Pre-industrial was 280 ppm.
The last time it was this high was 4.3 million years ago.

These numbers will keep climbing. Worth having the baseline."`,
  },
  {
    id: 'data-authority',
    name: 'The Data Authority',
    purpose: 'Build credibility through precision',
    prompt: `Write a DATA AUTHORITY caption. Structure:
1. Clear statement — state what the data shows in 1-2 precise sentences.
2. Supporting evidence — 1-2 sentences with additional data points or source references.
3. Closing statement — a calm, factual closing line that summarizes the data's implication.

Keep it 4-6 lines total. Tone: confident, precise, authoritative. Not opinionated — just clear about what the numbers say.

Example structure:
"Net-zero pledges cover 91% of global GDP.
Implemented policies cover 17% of the reduction needed.

The gap between commitment and measurement is 74 percentage points.

That is the current state of global climate policy."`,
  },
  {
    id: 'future-projection',
    name: 'The Future Projection',
    purpose: 'Engagement through data-based projections',
    prompt: `Write a FUTURE PROJECTION caption. Structure:
1. Current trajectory — start with a measured trend and its current rate.
2. Projection — 1-2 sentences stating what models project at specific dates (2030, 2040, 2050) with figures.
3. Open question — end with a question about the trajectory, grounded in the data.

Keep it 4-6 lines total. Tone: analytical, forward-looking. Let the projected numbers create the urgency.

Example structure:
"Sea level rose 3.7mm per year from 2006-2018. The rate is accelerating.

At current trajectory, IPCC projects 0.3-1.0m rise by 2100.

That range covers everything from manageable to catastrophic. Which end of the range are we tracking toward?"`,
  },
  {
    id: 'minimal',
    name: 'The Minimal',
    purpose: 'Stop the scroll with raw data',
    prompt: `Write a MINIMAL caption. Rules:
- Maximum 2-3 SHORT lines. Each line should be its own paragraph.
- No questions, no calls to action, no commentary.
- Just state the most powerful data point or contrast from the post.
- The brevity and the numbers should force people to look at the slides.

Keep it under 20 words total. Tone: stark, clean, precise.

Example structures:
"71% of emissions.
100 entities.
Since 1988."

Or:

"427 ppm.
Pre-industrial: 280 ppm.
+53% and climbing."

Or:

"1.3°C above baseline.
Hottest year on record.
Every year since 2015."`,
  },
  {
    id: 'contrast-data',
    name: 'The Contrast',
    purpose: 'Engagement through stark numerical contrasts',
    prompt: `Write a CONTRAST DATA caption. Structure:
1. Open with the starkest data contrast from the post — two numbers side by side (1-2 sentences).
2. Add one more data point that deepens the contrast (1 sentence).
3. End with the comparison ratio or percentage gap — just the math.

Keep it 4-5 lines total. Tone: measured, precise. Present two sets of numbers and let the gap between them be the entire message.

Example structure:
"Average American: 14.7 tonnes CO2 per year.
Average Indian: 1.9 tonnes CO2 per year.

The US has 4.2% of the world's population and 13.5% of cumulative emissions.

7.7x the per-capita footprint. 3.2x the cumulative share."`,
  },
  {
    id: 'india-data',
    name: 'The India Data',
    purpose: 'Hyper-targeted for Indian audience with India-specific data',
    prompt: `Write an INDIA DATA caption. Structure:
1. Open with an India-specific measurement — name Indian cities, states, or monitoring data (1 sentence). Use crores for population figures.
2. Add comparative data — India's figures alongside global averages or other nations (1-2 sentences).
3. End with the key India-specific projection or trend figure.

Keep it 4-6 lines total. Tone: precise, India-focused. Every line must contain a specific number or measurement.

Example structure:
"22 of the world's 30 most polluted cities are in India. Delhi's average AQI in winter: 347.

India's per-capita CO2: 1.9 tonnes. USA: 14.7 tonnes. EU: 6.1 tonnes.

By 2050, 40 crore Indians face high water stress — more than the population of the US."`,
  },
];

const ARCHETYPE_CAPTION_MAP: Record<string, string[]> = {
  'brutal-stat': ['minimal', 'contrast-data', 'save-optimized'],
  'this-affects-you': ['you-framing', 'data-question', 'save-optimized'],
  'myth-vs-reality': ['data-authority', 'contrast-data', 'data-question'],
  'inequality-contrast': ['contrast-data', 'data-question', 'minimal'],
  'timeline': ['future-projection', 'save-optimized', 'minimal'],
  'if-nothing-changes': ['future-projection', 'data-authority', 'minimal'],
  'explainer-stack': ['save-optimized', 'data-authority', 'data-question'],
  'localized-impact': ['india-data', 'contrast-data', 'save-optimized'],
  'policy-breakdown': ['data-authority', 'data-question', 'contrast-data'],
  'the-record': ['minimal', 'save-optimized', 'data-authority'],
  'data-vs-narrative': ['contrast-data', 'data-authority', 'data-question'],
  'india-data': ['india-data', 'contrast-data', 'save-optimized'],
  'scale-comparison': ['contrast-data', 'data-question', 'minimal'],
  'philosophical': ['data-question', 'data-authority', 'minimal'],
  'current-event': ['minimal', 'save-optimized', 'future-projection'],
};

export function pickCaptionStyle(archetypeId?: string): CaptionStyle {
  if (archetypeId && ARCHETYPE_CAPTION_MAP[archetypeId]) {
    const preferred = ARCHETYPE_CAPTION_MAP[archetypeId];
    const picked = preferred[Math.floor(Math.random() * preferred.length)];
    const style = CAPTION_STYLES.find(s => s.id === picked);
    if (style) return style;
  }

  return CAPTION_STYLES[Math.floor(Math.random() * CAPTION_STYLES.length)];
}
