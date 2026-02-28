import { TemplateStyle } from '../infographic/renderer';

export interface ContentArchetype {
  id: string;
  name: string;
  goal: string;
  preferredStyles: TemplateStyle[];
  coverPrompt: string;
  slidePrompt: string;
  toneDirective: string;
  lastSlideCta: string;
}

export const ARCHETYPES: ContentArchetype[] = [
  {
    id: 'brutal-stat',
    name: 'The Brutal Stat',
    goal: 'Saves + shares',
    preferredStyles: ['noir', 'editorial'],
    coverPrompt:
      'Cover MUST be a single massive statistic as the title — just the number (e.g. "77%") with a short subtitle explaining it (e.g. "of all emissions come from just 10% of people"). Make it punchy and impossible to scroll past.',
    slidePrompt: `Structure:
- Slide 1: CONTEXT — explain where this number comes from and why most people don't know it. Use global data.
- Slide 2: COMPARISON — compare between countries or regions (e.g., "That's more than the entire continent of Africa emits" or "X times more than India's per-capita emissions"). Think Global North vs Global South.
- Slide 3: HUMAN COST — who suffers globally because of this. Name specific countries in the Global South bearing the consequences. Use numbers: deaths, displacement, economic losses.
- Slide 4: Make the heading "Save This." and write a 2-sentence summary of why this matters for the world. Include a final powerful stat.`,
    toneDirective: 'Bold, punchy, no fluff. Short sentences. Oversized impact. Every word must hit hard.',
    lastSlideCta: 'Save This.',
  },
  {
    id: 'this-affects-you',
    name: 'The "This Affects You"',
    goal: 'Personal relevance + comments',
    preferredStyles: ['clean', 'editorial'],
    coverPrompt:
      'Cover title must use SECOND PERSON — address the reader directly. Format: "How [climate topic] will affect your [everyday thing]" (e.g., "How Climate Change Will Raise Your Food Prices", "Why Your Water Bill Will Double by 2040", "How Global Warming Affects Your Health"). Make it universally relevant — not country-specific.',
    slidePrompt: `Structure (use "you/your" throughout — speak to a GLOBAL audience):
- Slide 1: Explain how this impacts everyday life WORLDWIDE — food prices rising globally, energy costs, water scarcity, extreme heat. Use data from multiple countries.
- Slide 2: Show the data — frame it as "This means you will..." but with global examples (wheat prices in Asia, water rationing in Southern Europe, heatwave deaths across India and the Middle East).
- Slide 3: What's already happening — real examples from different continents that readers worldwide can relate to.
- Slide 4: End with a provocative QUESTION as the heading (e.g., "Are You Prepared?" or "What Will You Do?"). The body should challenge the reader to think or act.`,
    toneDirective: 'Second person throughout. Personal, relatable, conversational. Globally relevant — a reader in India, Brazil, or Germany should all feel this is about THEIR life.',
    lastSlideCta: '',
  },
  {
    id: 'myth-vs-reality',
    name: 'Myth vs Reality',
    goal: 'Shareability',
    preferredStyles: ['editorial', 'clean'],
    coverPrompt:
      'Cover title must start with "Myth:" followed by a common climate misconception (e.g., "Myth: Individual action can solve climate change", "Myth: Renewable energy is too expensive"). Subtitle should hint at the reality.',
    slidePrompt: `Structure:
- Slide 1: "Reality:" as the heading — state the truth clearly and directly with data that demolishes the myth.
- Slide 2: EVIDENCE — provide the strongest supporting data, studies, or examples that prove the reality.
- Slide 3: WHY THE MYTH EXISTS — explain who benefits from this misconception (corporations, industries, lobbyists).
- Slide 4: Heading should be "Share This With Someone Who Needs To Know." Brief summary + the single most powerful counter-stat.`,
    toneDirective: 'Myth-busting, authoritative, slightly confrontational. The tone should make the reader feel smart for knowing the truth.',
    lastSlideCta: 'Share This.',
  },
  {
    id: 'inequality-contrast',
    name: 'The Inequality Contrast',
    goal: 'Emotional reaction',
    preferredStyles: ['noir', 'editorial'],
    coverPrompt:
      'Cover title must present a STARK CONTRAST between two sides of the world (e.g., "Global North vs Global South", "USA vs Bangladesh", "Europe vs Sub-Saharan Africa", "G7 vs Small Island Nations"). Use "vs" in the title. Subtitle should hint at the injustice.',
    slidePrompt: `Structure (GLOBAL INEQUALITY — compare countries/regions, NOT communities):
- Slide 1: THE POLLUTERS — emissions, consumption, and wealth data for the Global North / rich nations. Name specific countries (USA, EU, China, Japan). Use per-capita and total numbers.
- Slide 2: THE VICTIMS — climate damage, GDP losses, displacement, and deaths in the Global South / vulnerable nations. Name specific countries (Bangladesh, Pakistan, Mozambique, Tuvalu). Use specific numbers.
- Slide 3: THE INJUSTICE — explain the structural inequality: who created the problem vs who pays the price. Mention climate finance gaps, broken promises, loss & damage debates.
- Slide 4: DISCUSSION PROMPT — heading should be a globally relevant question (e.g., "Is This Climate Justice?", "Who Should Pay?"). Body should challenge the international status quo.`,
    toneDirective: 'Emotionally charged, stark contrasts between nations. Use compare charts. Make global inequality feel visceral and unfair.',
    lastSlideCta: '',
  },
  {
    id: 'timeline',
    name: 'The Timeline',
    goal: 'Carousel completion (full swipe-through)',
    preferredStyles: ['clean', 'noir'],
    coverPrompt:
      'Cover title must be a TIME RANGE (e.g., "Climate Timeline: 1990 → 2050", "The Next 25 Years of Climate Change", "From Paris 2015 to Crisis 2050"). Subtitle should create curiosity about the future.',
    slidePrompt: `Structure (CHRONOLOGICAL — each slide is a time period):
- Slide 1: THE PAST — what happened in the earlier period. Key events, emissions levels, decisions made. Use a specific year or decade.
- Slide 2: THE PRESENT — where we are right now. Current data, ongoing crises, what's changed.
- Slide 3: NEAR FUTURE (2030-2035) — what projections show. Tipping points approaching. What scientists predict.
- Slide 4: FAR FUTURE (2050) — what happens if current trends continue. Make the heading year-based (e.g., "2050"). Paint a vivid picture of consequences.`,
    toneDirective: 'Sequential narrative building tension. Each slide should feel like turning a page. The future slides should create urgency.',
    lastSlideCta: '',
  },
  {
    id: 'if-nothing-changes',
    name: 'The "If Nothing Changes"',
    goal: 'Emotional tension + urgency',
    preferredStyles: ['noir', 'editorial'],
    coverPrompt:
      'Cover title must start with "If" — a conditional future scenario (e.g., "If Fossil Fuel Expansion Continues...", "If We Lose the Amazon...", "If Arctic Ice Disappears..."). Subtitle should hint at devastating consequences.',
    slidePrompt: `Structure (ESCALATING consequences):
- Slide 1: FIRST CONSEQUENCE — the most immediate and tangible impact. What happens first?
- Slide 2: CHAIN REACTION — how the first consequence triggers more damage. Cascading effects.
- Slide 3: WORST CASE — the most severe long-term outcome. Paint a vivid, data-backed picture of the worst scenario.
- Slide 4: Heading must be "What Should Happen Instead?" — present the alternative path, what needs to change, and who needs to act.`,
    toneDirective: 'Warning tone, building dread. Each slide should feel heavier than the last. The final slide should feel like relief — the way out.',
    lastSlideCta: '',
  },
  {
    id: 'explainer-stack',
    name: 'The Explainer Stack',
    goal: 'Authority building',
    preferredStyles: ['clean'],
    coverPrompt:
      'Cover title must be a QUESTION starting with "What is" or "How does" (e.g., "What Is Climate Inequality?", "How Does Carbon Trading Work?", "What Are Scope 3 Emissions?"). Subtitle should promise a clear explanation.',
    slidePrompt: `Structure (EDUCATIONAL — building understanding):
- Slide 1: DEFINITION — simple, jargon-free explanation. Define the concept in 2-3 sentences anyone can understand.
- Slide 2: REAL-WORLD EXAMPLE — one specific, concrete example that illustrates the concept. Name companies, places, or events.
- Slide 3: KEY DATA — the most important numbers that quantify this concept. Make the data tell the story.
- Slide 4: SOURCES & SIGNIFICANCE — heading should summarize why this matters. Cite the primary sources used.`,
    toneDirective: 'Academic but accessible. Clean, structured, no opinions — just clear explanation. Think "mini-lecture" not "rant."',
    lastSlideCta: '',
  },
  {
    id: 'localized-impact',
    name: 'The Country Spotlight',
    goal: 'Shareability + saves',
    preferredStyles: ['editorial', 'clean'],
    coverPrompt:
      'Cover title must mention a SPECIFIC COUNTRY facing major climate impacts (e.g., "India\'s Water Crisis", "Pakistan\'s Flood Nightmare", "Brazil\'s Amazon Emergency", "Bangladesh: Drowning Nation", "Nigeria\'s Desert Advance"). Pick a Global South country currently experiencing severe climate consequences. Subtitle should name the specific threat.',
    slidePrompt: `Structure (COUNTRY-LEVEL — all data must be about this ONE country):
- Slide 1: THE THREAT — what climate danger this country faces (flooding, drought, heatwaves, cyclones, desertification). Use national-level data and government/UN reports.
- Slide 2: THE SCALE — how many millions of people are affected, GDP losses, infrastructure damage. Use country-wide numbers, not neighborhood-level.
- Slide 3: THE CONTRAST — compare this country's emissions per capita to the Global North nations causing the crisis. Show the injustice: they pollute little but suffer most.
- Slide 4: Heading should be "Tag Someone From [Country Name]." Body should summarize the urgency and connect it to global climate justice.`,
    toneDirective: 'Country-specific, data-driven, globally conscious. Every stat should be national-level. Connect local suffering to global causes — the rich nations that drive emissions vs the poor nations that pay the price.',
    lastSlideCta: 'Tag Someone From Here.',
  },
  {
    id: 'policy-breakdown',
    name: 'The Policy Breakdown',
    goal: 'Intelligent discussion',
    preferredStyles: ['clean', 'editorial'],
    coverPrompt:
      'Cover title must reference a specific POLICY, AGREEMENT, or REGULATION (e.g., "Paris Agreement: Are We On Track?", "EU Carbon Tax: What It Really Does", "COP30: What to Expect"). Subtitle should pose the key question.',
    slidePrompt: `Structure (ANALYTICAL):
- Slide 1: THE GOAL — what the policy/agreement aims to achieve. Original targets, commitments, deadlines.
- Slide 2: CURRENT PROGRESS — where we actually stand. Data showing progress (or lack thereof).
- Slide 3: THE GAP — the difference between what was promised and what's happening. Who's falling short and why?
- Slide 4: DISCUSSION QUESTION — heading should be a thought-provoking question (e.g., "Can We Still Make It?"). Body should present both sides briefly.`,
    toneDirective: 'Analytical, balanced, intelligent. Present facts without preaching. Let the data speak. This is for a thoughtful audience.',
    lastSlideCta: '',
  },
];

const WEEKDAY_SCHEDULE: [string, string][] = [
  ['localized-impact', 'this-affects-you'],    // Sunday
  ['brutal-stat', 'timeline'],                 // Monday
  ['explainer-stack', 'policy-breakdown'],      // Tuesday
  ['inequality-contrast', 'myth-vs-reality'],  // Wednesday
  ['localized-impact', 'this-affects-you'],    // Thursday
  ['if-nothing-changes', 'brutal-stat'],       // Friday
  ['myth-vs-reality', 'timeline'],             // Saturday
];

export function pickArchetype(forEvening = false): ContentArchetype {
  const dayOfWeek = new Date().getDay(); // 0=Sun, 6=Sat
  const slot = forEvening ? 1 : 0;
  const archetypeId = WEEKDAY_SCHEDULE[dayOfWeek][slot];
  return ARCHETYPES.find(a => a.id === archetypeId) || ARCHETYPES[0];
}

export function getArchetypeById(id: string): ContentArchetype | undefined {
  return ARCHETYPES.find(a => a.id === id);
}
