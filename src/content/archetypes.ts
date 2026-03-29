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
    researchDirective: `Find the single MOST STRIKING statistic about this topic.
1. The one number that would stop someone mid-scroll — a percentage, a death toll, an economic figure, a comparison
2. Context for that number — what does it mean in measurable terms? Compare it to something relatable
3. A secondary stat that reinforces or contrasts with the main one
4. Geographic and demographic breakdown — which countries, populations, or regions are most affected, with numbers`,
    coverPrompt:
      'Cover MUST be a single massive statistic as the title — just the number (e.g. "77%") with a short subtitle explaining it (e.g. "of all emissions come from just 10% of the global population"). Make it impossible to scroll past.',
    slidePrompt: `Create 2-3 slides (not counting the cover). Structure:
- First slide: CONTEXT — explain where this number comes from. Use global data to show scale.
- Second slide: BREAKDOWN — compare across countries or regions with per-capita and total figures. Include measurable consequences — deaths, displacement, economic losses.
- Final slide (optional): Make the heading "The Full Picture." and write a 2-sentence data summary. Include a final powerful stat.

Use fewer slides if the stat hits harder with brevity. Not every post needs 3 slides.`,
    toneDirective: 'Cold, precise, no fluff. Short sentences. Let the numbers do the work. Every word earns its place through data.',
    lastSlideCta: 'The Full Picture.',
  },
  {
    id: 'this-affects-you',
    name: 'The Personal Impact',
    goal: 'Personal relevance + comments',
    preferredStyles: ['clean', 'editorial'],
    slideRange: [3, 4],
    researchMethod: 'tavily',
    researchDirective: `Find data showing how this topic DIRECTLY AFFECTS everyday life:
1. Consumer price impacts — food, energy, water, insurance costs linked to this topic, with specific figures
2. Health data — heat-related mortality, air quality measurements, disease incidence rates
3. Real examples from different countries where these effects are already measurable
4. Projections for the next 5-10 years from scientific models`,
    coverPrompt:
      'Cover title must use SECOND PERSON — address the reader directly. Format: "How [climate topic] affects your [everyday thing]" (e.g., "How Climate Change Raises Your Food Prices", "Why Your Water Bill Is Doubling", "What Global Warming Does to Your Health"). Make it universally relevant — not country-specific.',
    slidePrompt: `Create 3-4 slides (not counting the cover). Structure:
- First slide: Present data on everyday impacts WORLDWIDE — food prices, energy costs, water scarcity, extreme heat. Use data from multiple countries.
- Middle slides: Show the data with specific figures. Present real cases from different continents with measured impacts.
- Final slide: Present projections — what the data says about the next 10-20 years. End with the most significant projected number.`,
    toneDirective: 'Second person throughout. Factual, direct, data-anchored. A reader in India, Brazil, or Germany should see their reality reflected in the numbers.',
    lastSlideCta: '',
  },
  {
    id: 'myth-vs-reality',
    name: 'Myth vs Data',
    goal: 'Shareability',
    preferredStyles: ['editorial', 'clean'],
    slideRange: [3, 4],
    researchMethod: 'both',
    researchDirective: `Find data that CONTRADICTS a common assumption about this topic:
1. The most widely held assumption — what do most people believe?
2. The actual measured data that contradicts this assumption — peer-reviewed studies, government reports, scientific measurements
3. The scale of the gap between assumption and reality — quantify how far off the common belief is
4. Historical data showing when and how the assumption diverged from measured reality`,
    coverPrompt:
      'Cover title must start with "Assumption:" followed by a common climate misconception (e.g., "Assumption: Individual action can solve climate change", "Assumption: Renewable energy is too expensive"). Subtitle should tease the data.',
    slidePrompt: `Create 3-4 slides (not counting the cover). Structure:
- First slide: "The Data:" as the heading — state what the numbers actually show, directly contradicting the assumption.
- Middle slides: EVIDENCE — provide the strongest supporting data, studies, or measurements. Show the gap between the common assumption and measured reality with specific figures.
- Final slide: Summary with the single most powerful data point that settles the question.`,
    toneDirective: 'Precise, evidence-based, clinical. Present the data and let the contrast between assumption and measurement speak for itself.',
    lastSlideCta: '',
  },
  {
    id: 'inequality-contrast',
    name: 'The Disparity Data',
    goal: 'Engagement through stark contrasts',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [3, 4],
    researchMethod: 'tavily',
    researchDirective: `Find data showing GLOBAL CLIMATE DISPARITIES:
1. Per-capita emissions and consumption data across income groups and nations — with exact figures
2. Climate impact data for the most affected nations — measured deaths, GDP loss percentages, displacement figures
3. Climate finance data — amounts pledged vs amounts disbursed, with dates and figures
4. The numerical gap — per-capita emissions of top emitters vs per-capita climate damage costs in vulnerable nations`,
    coverPrompt:
      'Cover title must present a STARK DATA CONTRAST between two groups (e.g., "15 Tonnes vs 0.1 Tonnes", "USA vs Bangladesh: The Numbers", "Top 10% vs Bottom 50%"). Subtitle should state what the numbers represent.',
    slidePrompt: `Create 3-4 slides (not counting the cover). Structure:
- First slide: HIGH EMITTERS — emissions, consumption, and per-capita data for top-emitting nations. Name specific countries with exact figures.
- Middle slides: HIGH IMPACT — climate damage data for vulnerable nations. Deaths, GDP loss, displacement — all with numbers. Then present the per-capita comparison side by side.
- Final slide: Present climate finance data — what was pledged vs what was delivered. End with the single most striking disparity figure.`,
    toneDirective: 'Clinical, contrast-driven. Present both sides of the data with equal precision. The disparity is in the numbers — no commentary needed.',
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
1. The earliest relevant data point — when this was first measured, with exact year and numbers
2. Key milestone years between then and now — what changed, what was measured, what thresholds were crossed
3. The current state — most recent data from this year or last year
4. Scientific projections for 2030 and 2050 from IPCC, IEA, or equivalent bodies
5. Known thresholds — at what measured level do cascading effects begin`,
    coverPrompt:
      'Cover title must be a TIME RANGE (e.g., "Climate Data: 1990 → 2050", "The Next 25 Years in Numbers", "From 280 ppm to 420 ppm"). Subtitle should state the measured trend.',
    slidePrompt: `Create 4-6 slides (not counting the cover). Structure (CHRONOLOGICAL — each slide covers one time period):
- First slide: THE BASELINE — the earliest relevant measurement. What was the starting point?
- Middle slides: THE TRAJECTORY — each subsequent slide moves forward in time, showing measured changes. One specific year or period per slide with exact figures. Include trend data.
- Second-to-last slide: CURRENT STATE — the latest available measurements.
- Final slide: THE PROJECTION — what models project for 2050 under current trajectory. State the projected figures and their confidence intervals where available.

Use as many slides as needed to tell the chronological data story properly.`,
    toneDirective: 'Sequential, measured, building through data accumulation. Each slide adds another data point. The trajectory speaks for itself.',
    lastSlideCta: '',
  },
  {
    id: 'if-nothing-changes',
    name: 'The Projection',
    goal: 'Data-driven urgency',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [4, 6],
    researchMethod: 'tavily',
    researchDirective: `Find data showing PROJECTED CONSEQUENCES if current measured trends continue:
1. The most immediate projected consequence — what models predict will happen first, and when
2. Second-order effects — how the first consequence triggers measurable cascading impacts
3. Worst-case scenario projections from scientific models — what 2050 looks like under business-as-usual with specific figures
4. The alternative scenario — what models project if specific targets are met, with exact thresholds`,
    coverPrompt:
      'Cover title must start with "If" — a conditional future based on current data (e.g., "If Current Emissions Continue...", "If Arctic Ice Loss Accelerates...", "If Deforestation Rates Hold..."). Subtitle should state the key projected figure.',
    slidePrompt: `Create 4-6 slides (not counting the cover). Structure (ESCALATING projections):
- First slide: FIRST PROJECTION — the most immediate modeled consequence. What data says happens first?
- Middle slides: CASCADE — each slide presents the next projected consequence, showing how one measured effect triggers another. Build from near-term to long-term.
- Second-to-last slide: WORST-CASE MODEL — the most severe projected outcome under business-as-usual. Cite the model and its assumptions.
- Final slide: ALTERNATIVE MODEL — heading should state the alternative scenario. Present what models project if specific emission targets are met. State the exact targets needed.`,
    toneDirective: 'Projection-based, clinical. Present model outputs and their assumptions. The data trajectory tells the story without editorial commentary.',
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
2. One specific, concrete real-world example that illustrates the concept with measured data
3. The most important numbers that quantify this concept — scale, rate, trend
4. Primary sources and key reports that form the basis of understanding this topic`,
    coverPrompt:
      'Cover title must be a QUESTION starting with "What is" or "How does" (e.g., "What Is Climate Inequality?", "How Does Carbon Trading Work?", "What Are Scope 3 Emissions?"). Subtitle should promise a clear explanation.',
    slidePrompt: `Create 4-5 slides (not counting the cover). Structure (EDUCATIONAL — building understanding):
- First slide: DEFINITION — simple, jargon-free explanation. Define the concept in 2-3 sentences anyone can understand.
- Second slide: REAL-WORLD EXAMPLE — one specific, concrete example that illustrates the concept. Name places, entities, or events with measured data.
- Third slide: KEY DATA — the most important numbers that quantify this concept. Scale, rate, trend.
- Fourth slide: BROADER CONTEXT — connect this concept to the broader climate picture with data.
- Final slide (optional): SUMMARY — heading should state the key takeaway. Cite the primary sources used.`,
    toneDirective: 'Academic but accessible. Clean, structured, no opinions — just clear explanation backed by data.',
    lastSlideCta: '',
  },
  {
    id: 'localized-impact',
    name: 'The Country Data',
    goal: 'Shareability + saves',
    preferredStyles: ['editorial', 'clean'],
    slideRange: [4, 5],
    researchMethod: 'tavily',
    researchDirective: `Find COUNTRY-SPECIFIC climate data:
1. The primary climate threat this country faces — flooding, drought, heatwaves, cyclones, desertification — with national measurements
2. Scale of impact — population affected, GDP loss percentage, infrastructure damage costs, death toll
3. The country's per-capita emissions compared to global average and top emitters
4. Government reports, UN assessments, or World Bank data on this country's climate vulnerability index`,
    coverPrompt:
      'Cover title must mention a SPECIFIC COUNTRY with a data point (e.g., "India: 40°C+ Days Tripled Since 2000", "Pakistan: $30 Billion in Flood Damage", "Bangladesh: 17% of Land Area at Risk", "Nigeria: 75% Desertification Rate in the North"). Subtitle should state the data source.',
    slidePrompt: `Create 4-5 slides (not counting the cover). Structure (COUNTRY-LEVEL — all data about ONE country):
- First slide: THE PRIMARY THREAT — what climate data shows for this country. National measurements from government or UN reports.
- Second slide: THE SCALE — population affected, GDP impact, infrastructure damage. Country-wide numbers.
- Third slide: EMISSIONS CONTEXT — this country's per-capita emissions alongside global average and top emitters. Side-by-side comparison.
- Fourth slide: REGIONAL BREAKDOWN — specific communities, states, or regions within the country with the most extreme data.
- Final slide (optional): PROJECTIONS — what models forecast for this country by 2050.`,
    toneDirective: 'Country-specific, data-dense, precise. Every stat should be national-level with clear sourcing. Present the numbers and let them define the picture.',
    lastSlideCta: '',
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
2. Current progress data — where measurements actually stand vs what was committed
3. The gap between targets and current trajectory — quantified in specific units
4. Expert projections on whether current pace can meet the original goals, with probability estimates`,
    coverPrompt:
      'Cover title must reference a specific POLICY, AGREEMENT, or REGULATION (e.g., "Paris Agreement: The Numbers So Far", "EU Carbon Tax: Measured Impact", "COP30: Target vs Reality"). Subtitle should state the key gap figure.',
    slidePrompt: `Create 3-4 slides (not counting the cover). Structure (ANALYTICAL):
- First slide: THE TARGET — what the policy/agreement set as goals. Original numbers, commitments, deadlines.
- Second slide: CURRENT DATA — where measurements actually stand. Data showing progress or shortfall.
- Third slide: THE GAP — the quantified difference between target and trajectory. Which commitments are on track and which are not, with specific figures.
- Final slide (optional): PROJECTIONS — what current data says about whether targets will be met, with probability ranges from scientific assessments.`,
    toneDirective: 'Analytical, precise. Present targets alongside measured progress. The gap between commitment and data is the story.',
    lastSlideCta: '',
  },
  {
    id: 'the-record',
    name: 'The Record',
    goal: 'Data transparency + shares',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [4, 5],
    researchMethod: 'both',
    researchDirective: `Find DOCUMENTED HISTORICAL DATA about a specific entity's climate record:
1. The entity's measured emissions or environmental footprint over time — with specific figures and dates
2. What internal research or early data they had access to — with dates and document references
3. Revenue and production figures during the same period
4. Legal proceedings, regulatory filings, or audit data — documented facts from court records or public filings
5. Measured environmental and health outcomes in areas of their operations`,
    coverPrompt:
      'Cover title must NAME a specific entity and state a documented fact (e.g., "ExxonMobil\'s Internal Climate Models: 1977-2023", "The Carbon Majors: 71% of Emissions Traced to 100 Entities", "BP\'s Carbon Footprint Campaign: The Data"). Subtitle should state a key figure from the record.',
    slidePrompt: `Create 4-5 slides (not counting the cover). Structure (DOCUMENTED RECORD):
- First slide: THE DATA — what the numbers show. Emissions figures, production volumes, revenue figures. Exact amounts and dates.
- Second slide: THE INTERNAL DATA — what internal research showed, with document dates and findings. Cite specific studies or filings.
- Third slide: THE MEASURED IMPACT — environmental and health data from affected areas. Measured outcomes with figures.
- Fourth slide (optional): THE TRAJECTORY — how the numbers have changed over time. Current figures vs historical.
- Final slide: THE FULL RECORD — a data summary. Present the key figures side by side.`,
    toneDirective: 'Documentary, precise, archival. You are presenting a factual record. Dates, figures, sources. No commentary — the documented record is the content.',
    lastSlideCta: '',
  },
  {
    id: 'data-vs-narrative',
    name: 'Data vs Common Belief',
    goal: 'Engagement through surprise',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [3, 4],
    researchMethod: 'both',
    researchDirective: `Find data that CONTRADICTS a widely held assumption:
1. The common assumption most people hold about this topic — what is the default belief?
2. The measured data that directly contradicts this — from peer-reviewed studies, government statistics, or scientific measurements
3. The scale of the gap between what people believe and what the data shows
4. Historical data showing how this gap between belief and measurement developed over time`,
    coverPrompt:
      'Cover title must present a common belief followed by a contradicting data point (e.g., "Recycling Handles 9% of Plastic. Not 50%.", "Your Carbon Footprint Was Invented by BP in 2004.", "Electric Cars: The Full Lifecycle Numbers"). Subtitle should cite the source.',
    slidePrompt: `Create 3-4 slides (not counting the cover). Structure:
- First slide: THE COMMON BELIEF — what most people assume, and the data point that contradicts it.
- Second slide: THE FULL DATA — the measured reality in detail. Multiple data points that paint the complete picture.
- Third slide: THE GAP — quantify the difference between assumption and reality. Show how large the misconception is.
- Final slide (optional): CONTEXT — present the data that explains how and when the gap between belief and measurement developed.`,
    toneDirective: 'Measured, surprising, precise. Present the assumption, then present the data. The contrast between the two is the entire point. No editorializing.',
    lastSlideCta: '',
  },
  {
    id: 'india-data',
    name: 'India Data',
    goal: 'Hyper-local relevance for Indian audience',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [4, 5],
    researchMethod: 'tavily',
    researchDirective: `Find INDIA-SPECIFIC climate data:
1. The specific climate measurements for India — heatwave frequency, monsoon variability, water table levels, air quality indices — with data from Indian cities, states, and rivers
2. Affected population data — number of people in vulnerable categories, with demographic breakdowns
3. India's per-capita emissions alongside USA, EU, China, and Gulf states — exact figures
4. Indian government data (IMD, CPCB, CWC), IPCC South Asia assessments, or UN/World Bank reports on India`,
    coverPrompt:
      'Cover title must be INDIA-SPECIFIC with a data point (e.g., "Delhi AQI Exceeded 400 on 182 Days in 2025", "India Lost 14% of Its Glacier Mass Since 2000", "40 Crore Indians Face Water Stress", "India: 55°C Recorded in Rajasthan"). Subtitle should cite the data source.',
    slidePrompt: `Create 4-5 slides (not counting the cover). Structure (ALL DATA MUST BE INDIA-SPECIFIC):
- First slide: CURRENT MEASUREMENTS — what instruments and monitoring show RIGHT NOW. Name Indian cities, states, rivers. Use IMD, CPCB, IPCC, or UN data.
- Second slide: AFFECTED POPULATION — demographic and geographic breakdown. Use population figures in crores.
- Third slide: ECONOMIC AND AGRICULTURAL DATA — measured losses, yield changes, infrastructure costs with India-specific numbers.
- Fourth slide: EMISSIONS COMPARISON — India's per-capita emissions alongside global averages and top emitters. Present the numbers side by side.
- Final slide (optional): PROJECTIONS — what climate models project for India by 2050. State the model and its assumptions.`,
    toneDirective: 'India-focused, data-dense, precise. Every stat must be India-specific with clear sourcing. Present measurements, comparisons, and projections. The numbers define the story.',
    lastSlideCta: '',
  },
  {
    id: 'scale-comparison',
    name: 'The Scale Comparison',
    goal: 'Engagement through stark data contrasts',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [3, 4],
    researchMethod: 'both',
    researchDirective: `Find data showing SCALE CONTRASTS in emissions and climate impact:
1. Emissions data broken down by source — industrial, transport, agriculture, residential — with exact percentages
2. Per-capita data across income levels and nations — top 1% vs median vs bottom 50%
3. Historical cumulative emissions by nation or entity — total contributions over time
4. The measured gap between what individual behavior change can affect vs what systemic and industrial changes affect — with specific percentages`,
    coverPrompt:
      'Cover title must present a SCALE CONTRAST using data (e.g., "Top 1% Emit 100x the Bottom 50%", "Industrial Emissions: 73%. Household Choices: 4%.", "100 Entities. 71% of Emissions."). Subtitle should cite the data source.',
    slidePrompt: `Create 3-4 slides (not counting the cover). Structure:
- First slide: THE BREAKDOWN — emissions by source category with exact percentages. Show where the largest measured shares come from.
- Second slide: THE PER-CAPITA DATA — emissions across income groups and nations. Present the measured ratios.
- Third slide: THE SCALE — put individual action data alongside industrial and systemic data. Show the measured proportions.
- Final slide (optional): HISTORICAL CUMULATIVE — total emissions by entity or nation over time. The full ledger.`,
    toneDirective: 'Data-comparative, precise. Present measured proportions and let the scale speak. No editorial framing — the ratios are the content.',
    lastSlideCta: '',
  },
  {
    id: 'philosophical',
    name: 'The Philosophical Question',
    goal: 'Deep engagement + saves + comments',
    preferredStyles: ['noir', 'editorial'],
    slideRange: [4, 6],
    researchMethod: 'both',
    preferredTopicCategories: ['philosophical', 'population-consumption'],
    researchDirective: `Find data on humanity's aggregate impact on planetary systems:
1. The scale of human resource use — Earth Overshoot Day, ecological footprint vs biocapacity, total resource extraction rates, waste generation figures
2. Population and impact data — total humans alive now, growth rate, projections to 10 billion+, per-billion resource extraction and emissions increases
3. Consumption data — per-capita consumption trends, global GDP growth vs resource depletion, material throughput of the global economy
4. Psychological research data — measured hedonic adaptation, satisfaction indices vs consumption levels, material wealth vs reported wellbeing
5. Ecological measurements — species extinction rate vs background rate, habitat loss figures, deforestation rates, ocean biomass decline, atmospheric CO2 concentration trajectory`,
    coverPrompt:
      'Cover title must be a QUESTION about the data on human impact (e.g., "8 Billion People. 1.75 Planets of Resources.", "Can a Growing Species Shrink Its Footprint?", "Consumption Grows 3% Per Year. The Planet Doesn\'t.", "The Species With No Off Switch"). Subtitle should add a specific data point.',
    slidePrompt: `Create 4-6 slides (not counting the cover). Structure (DATA-DRIVEN reflection on aggregate human impact):
- First slide: RESOURCE DATA — what humans extract vs what the planet regenerates. Earth Overshoot Day. Extraction rates. The measured gap between consumption and regeneration.
- Second slide: POPULATION TRAJECTORY — the growth curve with data points. Each billion milestone and the corresponding measured increase in emissions, land use, and resource extraction.
- Third slide: CONSUMPTION DATA — per-capita consumption trends. GDP growth alongside resource depletion rates. The measured relationship between economic output and ecological cost.
- Fourth slide: ECOLOGICAL COST — measured species extinction rates, habitat loss, ocean biomass decline, atmospheric CO2 concentration. The quantified ecological price of current human activity.
- Fifth slide (optional): THE GROWTH QUESTION — present data on whether economic growth has ever been decoupled from resource use at global scale. What the measurements show.
- Final slide: THE DATA SUMMARY — heading should be a question (e.g., "What Do These Numbers Add Up To?"). Present the key figures. No answers — just the data, sitting with the reader.

TONE: This is quiet, data-heavy reflection. Use "we" — this is about the human species in aggregate. Every slide should present measured facts that raise uncomfortable questions on their own.`,
    toneDirective: 'Philosophical but data-anchored. Quietly precise. You are presenting the measured aggregate impact of the human species — not with rage, but with the cold clarity of data that speaks for itself. Use "we" throughout. Every sentence contains a number.',
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
2. How this event compares to historical records — is it the worst measured? Top 5? How does it compare to the same event last year?
3. Scientific attribution data — has any rapid attribution study quantified the climate change contribution? What probability or intensity increase was calculated?
4. Human impact data — population affected, infrastructure damage costs, agricultural losses
5. Government or international response data — aid figures, emergency declarations`,
    coverPrompt:
      'Cover title must state what happened with a specific measurement (e.g., "Antarctic Ice Sheet Lost 1 Trillion Tons This Month", "India Recorded 52.3°C — Highest Temperature in National History", "Category 5 Cyclone: 280 km/h Winds Hit Pacific Islands"). Subtitle should add a key data point.',
    slidePrompt: `Create 3-5 slides (not counting the cover). Structure:
- First slide: THE MEASUREMENTS — the event in exact figures. Location, date, recorded values. Present the raw data.
- Second slide: HISTORICAL COMPARISON — how this measurement compares to the historical record. Show the trend data.
- Third slide: ATTRIBUTION DATA — scientific attribution studies. The calculated probability increase or intensity change due to climate change.
- Fourth slide (optional): IMPACT DATA — population affected, displacement figures, economic damage. Measured costs.
- Final slide: TREND CONTEXT — where this event sits in the broader measured trend. Present the trajectory data.`,
    toneDirective: 'Reporting, precise, immediate. Present tense where possible. State what was measured, when, and how it compares. The data conveys the urgency.',
    lastSlideCta: '',
  },
];

const WEEKDAY_SCHEDULE: [string, string, string, string][] = [
  ['brutal-stat', 'data-vs-narrative', 'localized-impact', 'the-record'],            // Sunday
  ['the-record', 'explainer-stack', 'myth-vs-reality', 'if-nothing-changes'],        // Monday
  ['india-data', 'scale-comparison', 'policy-breakdown', 'brutal-stat'],             // Tuesday
  ['inequality-contrast', 'timeline', 'philosophical', 'myth-vs-reality'],           // Wednesday
  ['this-affects-you', 'localized-impact', 'scale-comparison', 'explainer-stack'],   // Thursday
  ['explainer-stack', 'brutal-stat', 'the-record', 'india-data'],                   // Friday
  ['myth-vs-reality', 'if-nothing-changes', 'inequality-contrast', 'timeline'],      // Saturday
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
