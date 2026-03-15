import { TemplateStyle } from '../infographic/renderer';

export const SLOT_TEMPLATES: TemplateStyle[] = ['clean', 'noir', 'editorial', 'brutalist'];

export interface ContentArchetype {
  id: string;
  name: string;
  goal: string;
  preferredStyles: TemplateStyle[];
  slideRange: [number, number];
  coverPrompt: string;
  slidePrompt: string;
  toneDirective: string;
  lastSlideCta: string;
  researchDirective: string;
  researchMethod: 'tavily' | 'both';
  preferredTopicCategories?: string[];
}

export const ARCHETYPES: ContentArchetype[] = [
  {
    id: 'brutal-stat',
    name: 'The Brutal Stat',
    goal: 'Saves + shares',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [2, 3],
    researchMethod: 'tavily',
    researchDirective: `Find the single MOST SHOCKING statistic about this topic.
1. The one number that would stop someone mid-scroll — a percentage, a body count, an economic figure, a comparison
2. Context for that number — what does it mean in human terms? Compare it to something relatable
3. Who is responsible — name the corporations, countries, or systems behind this number
4. A secondary stat that reinforces or contrasts with the main one
5. Who suffers the most — name specific countries, populations, or communities`,
    coverPrompt:
      'Cover MUST be a single massive statistic as the title — just the number (e.g. "77%") with a short subtitle explaining it (e.g. "of all emissions come from just 10% of people"). Make it punchy and impossible to scroll past.',
    slidePrompt: `Create 2-3 slides (not counting the cover). Structure:
- First slide: CONTEXT — explain where this number comes from and why most people don't know it. Use global data.
- Second slide: COMPARISON — compare between countries or regions. Think Global North vs Global South. Include who suffers because of this number — name specific countries, deaths, displacement, economic losses.
- Final slide (optional, use if the data supports it): Make the heading "Save This." and write a 2-sentence summary of why this matters. Include a final powerful stat.

Use fewer slides if the stat hits harder with brevity. Not every post needs 3 slides.`,
    toneDirective: 'Bold, punchy, no fluff. Short sentences. Oversized impact. Every word must hit hard.',
    lastSlideCta: 'Save This.',
  },
  {
    id: 'this-affects-you',
    name: 'The "This Affects You"',
    goal: 'Personal relevance + comments',
    preferredStyles: ['clean', 'editorial'],
    slideRange: [3, 4],
    researchMethod: 'tavily',
    researchDirective: `Find data showing how this topic DIRECTLY AFFECTS everyday life:
1. Consumer price impacts — food, energy, water, insurance costs linked to this topic
2. Health impacts on ordinary people — heat-related illness, air quality, disease spread
3. Real examples from different countries where people are already experiencing these effects
4. Projections for the next 5-10 years that show worsening personal impact`,
    coverPrompt:
      'Cover title must use SECOND PERSON — address the reader directly. Format: "How [climate topic] will affect your [everyday thing]" (e.g., "How Climate Change Will Raise Your Food Prices", "Why Your Water Bill Will Double by 2040", "How Global Warming Affects Your Health"). Make it universally relevant — not country-specific.',
    slidePrompt: `Create 3-4 slides (not counting the cover). Structure (use "you/your" throughout):
- First slide: Explain how this impacts everyday life WORLDWIDE — food prices, energy costs, water scarcity, extreme heat. Use data from multiple countries.
- Middle slides: Show the data — frame it as "This means you will..." with global examples. Show what's already happening with real cases from different continents.
- Final slide: End with a provocative QUESTION as the heading (e.g., "Are You Prepared?"). The body should challenge the reader to think or act.`,
    toneDirective: 'Second person throughout. Personal, relatable, conversational. Globally relevant — a reader in India, Brazil, or Germany should all feel this is about THEIR life.',
    lastSlideCta: '',
  },
  {
    id: 'myth-vs-reality',
    name: 'Myth vs Reality',
    goal: 'Shareability',
    preferredStyles: ['editorial', 'clean'],
    slideRange: [3, 4],
    researchMethod: 'both',
    researchDirective: `Find data to DEBUNK a common misconception about this topic:
1. The most widely believed misconception or myth — what do most people think?
2. Who propagates this myth — which corporations, politicians, industry groups, or media?
3. Any advertising campaigns, PR efforts, or lobbying that created or sustains this myth
4. How much money has been spent promoting this false narrative`,
    coverPrompt:
      'Cover title must start with "Myth:" followed by a common climate misconception (e.g., "Myth: Individual action can solve climate change", "Myth: Renewable energy is too expensive"). Subtitle should hint at the reality.',
    slidePrompt: `Create 3-4 slides (not counting the cover). Structure:
- First slide: "Reality:" as the heading — state the truth clearly and directly with data that demolishes the myth.
- Middle slides: EVIDENCE — provide the strongest supporting data, studies, or examples. Explain WHO benefits from this misconception (corporations, industries, lobbyists) and how much they spend maintaining it.
- Final slide: Heading should be "Share This With Someone Who Needs To Know." Brief summary + the single most powerful counter-stat.`,
    toneDirective: 'Myth-busting, authoritative, slightly confrontational. The tone should make the reader feel smart for knowing the truth.',
    lastSlideCta: 'Share This.',
  },
  {
    id: 'inequality-contrast',
    name: 'The Inequality Contrast',
    goal: 'Emotional reaction',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [3, 4],
    researchMethod: 'tavily',
    researchDirective: `Find data showing GLOBAL CLIMATE INEQUALITY:
1. Per-capita emissions and consumption data for the top polluting nations (USA, EU, China, Gulf states)
2. Climate damage data for the most affected nations — deaths, GDP loss, displacement numbers
3. Climate finance promises vs actual delivery — how much was pledged vs paid
4. The stark contrast: who caused the problem vs who pays the price, with specific per-capita and total numbers`,
    coverPrompt:
      'Cover title must present a STARK CONTRAST between two sides of the world (e.g., "Global North vs Global South", "USA vs Bangladesh", "Europe vs Sub-Saharan Africa", "G7 vs Small Island Nations"). Use "vs" in the title. Subtitle should hint at the injustice.',
    slidePrompt: `Create 3-4 slides (not counting the cover). Structure (GLOBAL INEQUALITY — compare countries/regions):
- First slide: THE POLLUTERS — emissions, consumption, and wealth data for rich nations. Name specific countries. Use per-capita and total numbers.
- Middle slides: THE VICTIMS — climate damage in vulnerable nations. Name specific countries. Then explain the structural inequality: who created the problem vs who pays.
- Final slide: DISCUSSION PROMPT — heading should be a globally relevant question (e.g., "Is This Climate Justice?"). Body should challenge the international status quo.`,
    toneDirective: 'Emotionally charged, stark contrasts between nations. Use compare charts. Make global inequality feel visceral and unfair.',
    lastSlideCta: '',
  },
  {
    id: 'timeline',
    name: 'The Timeline',
    goal: 'Carousel completion (full swipe-through)',
    preferredStyles: ['clean', 'noir'],
    slideRange: [4, 6],
    researchMethod: 'tavily',
    researchDirective: `Find CHRONOLOGICAL data for a timeline visualization:
1. The earliest relevant data point — when this problem started, with exact year and numbers
2. Key milestone years between then and now — what changed, what got worse, what policy was passed or failed
3. The current state — most recent data from this year or last year
4. Scientific projections for 2030 and 2050 from IPCC, IEA, or equivalent bodies
5. Tipping points or thresholds — at what level does the damage become irreversible`,
    coverPrompt:
      'Cover title must be a TIME RANGE (e.g., "Climate Timeline: 1990 → 2050", "The Next 25 Years of Climate Change", "From Paris 2015 to Crisis 2050"). Subtitle should create curiosity about the future.',
    slidePrompt: `Create 4-6 slides (not counting the cover). Structure (CHRONOLOGICAL — each slide covers one time period):
- First slide: THE ORIGINS — the earliest relevant data point or event. When did this begin?
- Middle slides: ESCALATION — each subsequent slide moves forward in time, showing how the situation worsened. Use one specific year or period per slide. Include trend data.
- Second-to-last slide: RIGHT NOW — the current state with the latest available data.
- Final slide: THE PROJECTION — what happens by 2050 if the trajectory continues. Make the heading year-based (e.g., "2050"). Paint a vivid picture of consequences.

Use as many slides as needed to tell the chronological story properly.`,
    toneDirective: 'Sequential narrative building tension. Each slide should feel like turning a page. The future slides should create urgency.',
    lastSlideCta: '',
  },
  {
    id: 'if-nothing-changes',
    name: 'The "If Nothing Changes"',
    goal: 'Emotional tension + urgency',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [4, 6],
    researchMethod: 'tavily',
    researchDirective: `Find data showing CASCADING CONSEQUENCES if current trends continue:
1. The most immediate consequence — what happens first and when
2. Second-order effects — how the first consequence triggers more damage
3. Worst-case projections from scientific models — what 2050 looks like under business-as-usual
4. The alternative scenario — what changes if corrective action is taken now, with specific targets`,
    coverPrompt:
      'Cover title must start with "If" — a conditional future scenario (e.g., "If Fossil Fuel Expansion Continues...", "If We Lose the Amazon...", "If Arctic Ice Disappears..."). Subtitle should hint at devastating consequences.',
    slidePrompt: `Create 4-6 slides (not counting the cover). Structure (ESCALATING consequences):
- First slide: FIRST CONSEQUENCE — the most immediate and tangible impact. What happens first?
- Middle slides: CHAIN REACTION — each slide escalates, showing how one consequence triggers the next. Build from tangible to systemic to catastrophic.
- Second-to-last slide: WORST CASE — the most severe long-term outcome. Paint a vivid, data-backed picture.
- Final slide: Heading must be "What Should Happen Instead?" — present the alternative path, what needs to change, and who needs to act.`,
    toneDirective: 'Warning tone, building dread. Each slide should feel heavier than the last. The final slide should feel like relief — the way out.',
    lastSlideCta: '',
  },
  {
    id: 'explainer-stack',
    name: 'The Explainer Stack',
    goal: 'Authority building',
    preferredStyles: ['clean'],
    slideRange: [4, 5],
    researchMethod: 'tavily',
    researchDirective: `Find EDUCATIONAL data to explain this topic clearly:
1. A clear, jargon-free definition of the concept from authoritative sources
2. One specific, concrete real-world example that illustrates the concept
3. The most important numbers that quantify this concept — scale, impact, trend
4. Primary sources and key reports that form the basis of understanding this topic`,
    coverPrompt:
      'Cover title must be a QUESTION starting with "What is" or "How does" (e.g., "What Is Climate Inequality?", "How Does Carbon Trading Work?", "What Are Scope 3 Emissions?"). Subtitle should promise a clear explanation.',
    slidePrompt: `Create 4-5 slides (not counting the cover). Structure (EDUCATIONAL — building understanding):
- First slide: DEFINITION — simple, jargon-free explanation. Define the concept in 2-3 sentences anyone can understand.
- Second slide: REAL-WORLD EXAMPLE — one specific, concrete example that illustrates the concept. Name companies, places, or events.
- Third slide: KEY DATA — the most important numbers that quantify this concept. Make the data tell the story.
- Fourth slide: DEEPER CONTEXT — connect this concept to the broader climate picture. Why does understanding this matter?
- Final slide (optional): SOURCES & SIGNIFICANCE — heading should summarize why this matters. Cite the primary sources used.`,
    toneDirective: 'Academic but accessible. Clean, structured, no opinions — just clear explanation. Think "mini-lecture" not "rant."',
    lastSlideCta: '',
  },
  {
    id: 'localized-impact',
    name: 'The Country Spotlight',
    goal: 'Shareability + saves',
    preferredStyles: ['editorial', 'clean'],
    slideRange: [4, 5],
    researchMethod: 'tavily',
    researchDirective: `Find COUNTRY-SPECIFIC climate data for a Global South nation:
1. The primary climate threat this country faces — flooding, drought, heatwaves, cyclones, desertification — with national data
2. Scale of impact — millions affected, GDP losses, infrastructure damage, deaths
3. The country's per-capita emissions compared to major Global North emitters
4. Government reports, UN assessments, or World Bank data on this country's climate vulnerability`,
    coverPrompt:
      'Cover title must mention a SPECIFIC COUNTRY facing major climate impacts (e.g., "India\'s Water Crisis", "Pakistan\'s Flood Nightmare", "Brazil\'s Amazon Emergency", "Bangladesh: Drowning Nation", "Nigeria\'s Desert Advance"). Pick a Global South country currently experiencing severe climate consequences. Subtitle should name the specific threat.',
    slidePrompt: `Create 4-5 slides (not counting the cover). Structure (COUNTRY-LEVEL — all data about ONE country):
- First slide: THE THREAT — what climate danger this country faces. Use national-level data and government/UN reports.
- Second slide: THE SCALE — how many millions are affected, GDP losses, infrastructure damage. Use country-wide numbers.
- Third slide: THE CONTRAST — compare this country's emissions per capita to the Global North nations causing the crisis. Show the injustice.
- Fourth slide: THE HUMAN STORIES — specific communities, regions, or populations within the country bearing the worst impact.
- Final slide (optional): Heading should be "Tag Someone From [Country Name]." Body should summarize urgency and connect to global climate justice.`,
    toneDirective: 'Country-specific, data-driven, globally conscious. Every stat should be national-level. Connect local suffering to global causes.',
    lastSlideCta: 'Tag Someone From Here.',
  },
  {
    id: 'policy-breakdown',
    name: 'The Policy Breakdown',
    goal: 'Intelligent discussion',
    preferredStyles: ['clean', 'editorial'],
    slideRange: [3, 4],
    researchMethod: 'tavily',
    researchDirective: `Find POLICY AND AGREEMENT data for analysis:
1. The specific policy, agreement, or regulation related to this topic — original targets, commitments, deadlines
2. Current progress data — where we actually stand vs what was promised
3. Which countries or entities are falling short and by how much
4. Expert analysis on whether current pace can meet the original goals`,
    coverPrompt:
      'Cover title must reference a specific POLICY, AGREEMENT, or REGULATION (e.g., "Paris Agreement: Are We On Track?", "EU Carbon Tax: What It Really Does", "COP30: What to Expect"). Subtitle should pose the key question.',
    slidePrompt: `Create 3-4 slides (not counting the cover). Structure (ANALYTICAL):
- First slide: THE GOAL — what the policy/agreement aims to achieve. Original targets, commitments, deadlines.
- Second slide: CURRENT PROGRESS — where we actually stand. Data showing progress (or lack thereof).
- Third slide: THE GAP — the difference between what was promised and what's happening. Who's falling short and why?
- Final slide (optional): DISCUSSION QUESTION — heading should be a thought-provoking question (e.g., "Can We Still Make It?"). Body should present both sides.`,
    toneDirective: 'Analytical, balanced, intelligent. Present facts without preaching. Let the data speak. This is for a thoughtful audience.',
    lastSlideCta: '',
  },
  {
    id: 'the-indictment',
    name: 'The Indictment',
    goal: 'Outrage + shares + comments',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [4, 5],
    researchMethod: 'both',
    researchDirective: `Find PROSECUTORIAL EVIDENCE for an accusation-style post:
1. The single most responsible entity (corporation, executive, or institution) — name them explicitly
2. When they KNEW about the damage — internal documents, leaked memos, early research they funded or suppressed
3. How much they PROFITED during the period of knowingly causing damage — revenue, profit figures, executive compensation
4. Legal actions: lawsuits filed, fines paid, settlements, court rulings
5. Deaths, displacement, and economic damage directly attributable to their actions`,
    coverPrompt:
      'Cover title must NAME a specific entity and accuse them directly (e.g., "ExxonMobil Knew Since 1977", "The 1% Are Killing You", "Your Bank Funds Your Destruction", "Modi/Trump/Politicians Won\'t Say This"). Subtitle should be a damning fact. Make it read like a courtroom verdict.',
    slidePrompt: `Create 4-5 slides (not counting the cover). Structure (PROSECUTION — building a legal case):
- First slide: THE CRIME — what they did, when they knew, and how much they profited. Name the entity explicitly. Use exact dollar amounts and dates.
- Second slide: THE EVIDENCE — the smoking gun. Internal memos, leaked reports, court filings, data that proves intent.
- Third slide: THE VICTIMS — who paid the price while they profited. Name countries, communities. Body count, displacement numbers, economic ruin.
- Fourth slide (optional): THE COVER-UP — how they tried to hide it, suppress research, or fund denial.
- Final slide: THE VERDICT — heading must be "Guilty." Body should be a 2-sentence summary. End with: "Share this before they bury it."`,
    toneDirective: 'Prosecutorial, furious, factual. You are a prosecutor delivering a closing argument. Every sentence is an accusation backed by data. No hedging, no "may have" — they DID.',
    lastSlideCta: 'Share this before they bury it.',
  },
  {
    id: 'uncomfortable-truth',
    name: 'The Uncomfortable Truth',
    goal: 'Viral controversy + saves',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [3, 4],
    researchMethod: 'both',
    researchDirective: `Find data that DEBUNKS a comfortable mainstream narrative:
1. The mainstream narrative or "comfortable lie" most people believe about this topic
2. The actual data that directly contradicts the mainstream narrative — the starker the contrast, the better
3. Who benefits from maintaining the false narrative — follow the money to corporations, politicians, industries
4. Evidence of deliberate misinformation campaigns or PR efforts to sustain the lie`,
    coverPrompt:
      'Cover title must start with "Nobody Will Tell You This" or "The Truth About" or "What They Don\'t Want You To Know" (e.g., "Nobody Will Tell You This About Population", "The Truth About Your Carbon Footprint", "What They Don\'t Want You To Know About Recycling"). Subtitle should hint at the taboo truth.',
    slidePrompt: `Create 3-4 slides (not counting the cover). Structure (TABOO-BREAKING):
- First slide: THE LIE — the comfortable mainstream narrative everyone believes. Quote politicians, brands, or media. Show how soothing and false it is.
- Second slide: THE REAL DATA — the actual numbers that demolish the lie. Make the contrast between narrative and reality STARK.
- Third slide: WHY THEY LIE — follow the money. Who profits? Which corporations, politicians, or industries benefit? Name them.
- Final slide (optional): WHAT NOW — heading must be "Now You Know." Body should be a gut-punch summary.`,
    toneDirective: 'Whistle-blower energy. You know something dangerous and you\'re telling the world despite pressure not to. Calm fury. Every word is a reveal.',
    lastSlideCta: 'Now You Know.',
  },
  {
    id: 'india-on-fire',
    name: 'India On Fire',
    goal: 'Hyper-local relevance for Indian audience',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [4, 5],
    researchMethod: 'tavily',
    researchDirective: `Find INDIA-SPECIFIC climate data:
1. The specific climate threat facing India RIGHT NOW — heatwaves, monsoon disruption, water scarcity, air pollution — with data from Indian cities, states, and rivers
2. Who is most vulnerable — informal workers, small farmers, slum dwellers — with population numbers
3. India's per-capita emissions compared to USA, EU, China, and Gulf states
4. Indian government data, IPCC South Asia assessments, or UN reports on India's climate vulnerability`,
    coverPrompt:
      'Cover title must be INDIA-SPECIFIC and alarming (e.g., "Delhi Will Be Unlivable by 2040", "80 Crore Indians Can\'t Feed Themselves — Now Add Climate Change", "India\'s Rivers Are Dying", "Your City Is Running Out of Water", "55°C Is Coming to Your State"). Subtitle should name specific Indian states or cities at risk.',
    slidePrompt: `Create 4-5 slides (not counting the cover). Structure (ALL DATA MUST BE INDIA-SPECIFIC):
- First slide: THE CRISIS IN INDIA — what is happening RIGHT NOW. Name Indian cities, states, rivers. Use Indian government data, IPCC data for South Asia, or UN data.
- Second slide: WHO GETS HIT — India's most vulnerable populations. Use population numbers in crores.
- Third slide: THE SCALE — economic damage, agricultural losses, health impacts with India-specific numbers.
- Fourth slide: THE GLOBAL INJUSTICE — India's per-capita emissions vs the USA/EU. Show that India emits a fraction but suffers disproportionately.
- Final slide (optional): THE QUESTION — heading should directly challenge Indian readers (e.g., "Will You Stay Silent?"). Body should make climate personal for every Indian.`,
    toneDirective: 'Urgent, patriotic rage. You love India and you\'re watching it burn while its people are kept distracted by cricket and elections. Speak like someone shaking a sleeping person awake.',
    lastSlideCta: '',
  },
  {
    id: 'system-vs-you',
    name: 'The System vs You',
    goal: 'Class consciousness + viral shares',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [3, 4],
    researchMethod: 'both',
    researchDirective: `Find data showing the CONTRAST between corporate and individual responsibility:
1. The share of global emissions from corporate/industrial decisions vs individual consumer choices — with specific percentages
2. Specific corporate carbon footprints compared to what individuals are told to reduce
3. The history of how "personal carbon footprint" was created as a PR concept — by which company and when
4. What percentage of emission reduction is achievable through individual behavior change vs systemic policy`,
    coverPrompt:
      'Cover title must contrast what the SYSTEM does vs what YOU are told to do (e.g., "They Fly Private. You\'re Told to Recycle.", "They Burn the Planet. You\'re Told to Use Metal Straws.", "30 Companies Cause 71% of Emissions. You\'re Blamed for Not Composting."). Make the hypocrisy the title.',
    slidePrompt: `Create 3-4 slides (not counting the cover). Structure (EXPOSE THE HYPOCRISY):
- First slide: WHAT YOU'RE TOLD — the mainstream narrative that blames individuals. List the things regular people are shamed for.
- Second slide: WHAT THEY DO — the reality of corporate and billionaire behavior. Use specific names, numbers, carbon footprints.
- Third slide: THE MATH — show that individual action changes less than 5-10% of emissions. The rest comes from corporate and systemic decisions. Prove individual guilt is manufactured.
- Final slide (optional): THE REAL FIGHT — heading must be "Stop Blaming Yourself." Redirect anger toward the real culprits.`,
    toneDirective: 'Righteous anger on behalf of ordinary people. You are defending the common person against a system designed to exploit and blame them. Class-conscious, anti-corporate, empowering.',
    lastSlideCta: 'Stop Blaming Yourself.',
  },
  {
    id: 'philosophical',
    name: 'The Philosophical Question',
    goal: 'Deep engagement + saves + comments',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [4, 6],
    researchMethod: 'both',
    preferredTopicCategories: ['philosophical', 'population-consumption'],
    researchDirective: `Find data that exposes humanity's FUNDAMENTAL GREED — the lust to consume more, produce more, and multiply endlessly:
1. The scale of human overshoot — Earth Overshoot Day, how many planets we'd need, resource extraction vs regeneration rates, total waste generated
2. Population as a multiplier — total humans alive now vs any point in history, projections to 10 billion+, how every new billion accelerates extraction, emissions, habitat destruction, and species extinction
3. The consumption machine — per-capita consumption growth, advertising spend that fuels desire, planned obsolescence, how GDP ideology treats "more" as sacred
4. The psychological disease — hedonic adaptation research, why humans are never satisfied, status competition, the gap between material wealth and happiness
5. The ecological price — species extinction rates caused by human expansion, habitat destroyed for agriculture and cities, forests cleared, oceans emptied, carbon emitted — the direct cost of human greed`,
    coverPrompt:
      'Cover title must be a DARK PHILOSOPHICAL QUESTION about human nature itself — questioning why we can never stop wanting more (e.g., "Why Can\'t We Stop?", "Are Humans a Plague?", "What If We Are the Extinction Event?", "8 Billion Appetites. One Planet.", "The Species That Ate Its Own Home"). Subtitle should add a devastating data point. This must feel like an uncomfortable truth about what we are.',
    slidePrompt: `Create 4-6 slides (not counting the cover). Structure (PHILOSOPHICAL — questioning human nature itself):
- First slide: THE APPETITE — humans take more than they need. Always have, always will. Use data on how much we extract vs what the planet can regenerate. Earth Overshoot Day. Resource extraction rates. The sheer volume of what 8 billion humans consume, discard, and destroy every single day.
- Second slide: THE MULTIPLICATION — more people means more destruction. Period. Show the population curve from 1 billion to 8 billion. Each billion arrived faster. Every new billion means more land cleared, more species killed, more carbon dumped. Population is not neutral — it is a direct multiplier of ecological damage.
- Third slide: THE LUST — why do we want more? Question the fundamental human drive. Hedonic treadmill — we buy, feel nothing, buy again. Status competition — we consume to signal worth. Advertising spends hundreds of billions to manufacture desire we never naturally had. We are not consuming to live. We are living to consume.
- Fourth slide: THE WRECKAGE — translate human greed into numbers. Species gone. Forests erased. Oceans acidified. Ice melted. All so one species could have more than it needs and still feel empty.
- Fifth slide (optional): THE QUESTION NOBODY ASKS — if more people and more consumption have only accelerated destruction, why does every government, religion, and economic system still worship growth? Why is "have more children, buy more things, grow the economy" still the default? Who benefits from this?
- Final slide: THE MIRROR — heading should be brutally personal (e.g., "What Are You Really Hungry For?", "Will You Ever Have Enough?", "How Much Is Enough?"). No comforting answers. Just the question, sitting with the reader.

CRITICAL TONE: This is quiet devastation, not shouting. Write like a philosopher who has seen too much. Use "we" — this is about the human species, not "them." Every slide should make the reader feel the weight of being part of a species that cannot stop.`,
    toneDirective: 'Dark philosophical. Quietly devastating. You are questioning the nature of the human species itself — our bottomless hunger for more people, more things, more growth on a finite planet. No rage, no shouting — just the cold clarity of someone who sees what we are and cannot look away. Use "we" throughout. Every sentence should land like a stone dropped into still water.',
    lastSlideCta: '',
  },
  {
    id: 'current-event',
    name: 'Breaking Climate Event',
    goal: 'Timeliness + relevance + shares',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [3, 5],
    researchMethod: 'tavily',
    researchDirective: `Find the LATEST DATA about this specific event:
1. Exact measurements — temperatures, rainfall amounts, wind speeds, area affected, death toll, displacement numbers
2. How this event compares to historical records — is it the worst ever? Top 5? How does it compare to the same event last year?
3. Scientific attribution — has any rapid attribution study linked this to climate change? What do climate scientists say?
4. Human impact — how many people affected, infrastructure damage in dollars, agricultural losses
5. Any government or international response so far`,
    coverPrompt:
      'Cover title must be URGENT and NEWS-LIKE — state what just happened with specifics (e.g., "Antarctic Ice Sheet Lost 1 Trillion Tons This Month", "India Hits 52°C — Hottest Day Ever Recorded", "Category 5 Cyclone Devastates Pacific Islands"). Subtitle should add a shocking data point. This must feel like BREAKING NEWS.',
    slidePrompt: `Create 3-5 slides (not counting the cover). Structure (BREAKING NEWS — react to a current event):
- First slide: WHAT HAPPENED — the event in detail. Exact numbers, location, date. Make it feel immediate and urgent.
- Second slide: THE CONTEXT — how this compares to historical records. Is this unprecedented? Show the trend.
- Third slide: THE CLIMATE CONNECTION — scientific attribution. How climate change made this event more likely or severe.
- Fourth slide (optional): THE HUMAN COST — people affected, displacement, economic damage. Name specific communities.
- Final slide: WHY THIS MATTERS — heading should be "This Is Climate Change. Right Now." Connect the event to the bigger picture.`,
    toneDirective: 'Breaking news urgency. You are reporting from the front lines. Present tense where possible. Every sentence should convey immediacy — this is happening NOW.',
    lastSlideCta: 'This Is Climate Change. Right Now.',
  },
];

const WEEKDAY_SCHEDULE: [string, string, string, string][] = [
  ['brutal-stat', 'uncomfortable-truth', 'localized-impact', 'philosophical'],       // Sunday
  ['the-indictment', 'explainer-stack', 'myth-vs-reality', 'if-nothing-changes'],   // Monday
  ['india-on-fire', 'system-vs-you', 'policy-breakdown', 'the-indictment'],         // Tuesday
  ['inequality-contrast', 'timeline', 'philosophical', 'brutal-stat'],              // Wednesday
  ['this-affects-you', 'localized-impact', 'system-vs-you', 'myth-vs-reality'],     // Thursday
  ['explainer-stack', 'brutal-stat', 'the-indictment', 'india-on-fire'],            // Friday
  ['myth-vs-reality', 'if-nothing-changes', 'inequality-contrast', 'timeline'],     // Saturday
];

export function pickArchetype(slotIndex = 0): ContentArchetype {
  const dayOfWeek = new Date().getDay(); // 0=Sun, 6=Sat
  const slot = Math.min(slotIndex, 3);
  const archetypeId = WEEKDAY_SCHEDULE[dayOfWeek][slot];
  return ARCHETYPES.find(a => a.id === archetypeId) || ARCHETYPES[0];
}

export function getSlotTemplate(slotIndex: number): TemplateStyle {
  return SLOT_TEMPLATES[Math.min(slotIndex, SLOT_TEMPLATES.length - 1)];
}

export function getArchetypeById(id: string): ContentArchetype | undefined {
  return ARCHETYPES.find(a => a.id === id);
}
