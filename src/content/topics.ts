export interface ClimateTopic {
  id: string;
  subject: string;
  category: string;
  angles: string[];
}

export const CLIMATE_TOPICS: ClimateTopic[] = [
  // === CORPORATE & ELITE ACCOUNTABILITY ===
  {
    id: 'fossil-fuel-giants',
    subject: 'Fossil fuel corporations and global carbon emissions',
    category: 'corporate-accountability',
    angles: [
      'Which specific companies emit the most and how their output compares to entire nations',
      'How fossil fuel company profits correlate with rising emission levels over the last decade',
      'Regulatory and legal accountability gaps for the largest corporate emitters',
    ],
  },
  {
    id: 'billionaire-carbon',
    subject: 'Billionaire carbon footprints and lifestyle emissions',
    category: 'corporate-accountability',
    angles: [
      'Per-capita carbon footprints of the ultra-wealthy compared to average citizens globally',
      'Private jet usage, superyacht emissions, and luxury consumption data of specific billionaires',
      'How many Earths would be needed if everyone consumed at billionaire levels',
    ],
  },
  {
    id: 'one-percent-destroyers',
    subject: 'Income inequality and carbon emission distribution',
    category: 'corporate-accountability',
    angles: [
      'What share of global emissions the top 1% and top 10% of earners produce',
      'The correlation between wealth concentration and per-capita carbon output',
      'How responsibility for emissions is distributed vs how blame is assigned publicly',
    ],
  },
  {
    id: 'big-meat-industry',
    subject: 'Meat and dairy industry climate impact',
    category: 'corporate-accountability',
    angles: [
      'Methane emissions from industrial animal agriculture compared to other sectors',
      'Deforestation driven by cattle ranching and feed crop production',
      'The largest meat and dairy corporations and their emission profiles',
    ],
  },
  {
    id: 'big-tech-energy',
    subject: 'Big tech energy consumption and data center emissions',
    category: 'corporate-accountability',
    angles: [
      'Energy consumption of data centers, AI training, and cryptocurrency mining by company',
      'How tech company energy usage compares to entire countries',
      'The gap between tech companies\' green pledges and their actual energy sourcing',
    ],
  },
  {
    id: 'plastic-producers',
    subject: 'Corporate plastic production and pollution',
    category: 'corporate-accountability',
    angles: [
      'Which corporations produce the most single-use plastic globally',
      'The actual recycling rate vs what the plastics industry claims',
      'How the concept of consumer recycling was created by plastic manufacturers',
    ],
  },
  {
    id: 'greenwashing-exposed',
    subject: 'Corporate greenwashing and climate pledges',
    category: 'corporate-accountability',
    angles: [
      'Net-zero pledges by major corporations vs their actual emission trajectories',
      'Specific examples of greenwashing campaigns exposed by regulators or journalists',
      'How much corporations spend on green marketing vs actual emission reduction',
    ],
  },
  {
    id: 'banking-fossil-fuels',
    subject: 'Financial institutions funding fossil fuels',
    category: 'corporate-accountability',
    angles: [
      'Total fossil fuel financing by major banks since the Paris Agreement',
      'Which specific banks are the largest funders of oil, gas, and coal projects',
      'The contradiction between bank ESG commitments and their lending portfolios',
    ],
  },
  {
    id: 'lobbying-machine',
    subject: 'Fossil fuel lobbying and climate policy influence',
    category: 'corporate-accountability',
    angles: [
      'Annual spending on fossil fuel lobbying by company and industry total',
      'How lobbying spending correlates with weakened climate legislation',
      'The history of fossil fuel industry funding for climate denial research',
    ],
  },
  {
    id: 'ceo-vs-workers',
    subject: 'Executive compensation at polluting companies vs worker conditions',
    category: 'corporate-accountability',
    angles: [
      'CEO pay at the top polluting corporations compared to average worker wages',
      'Worker deaths and injuries from heat exposure at fossil fuel and industrial companies',
      'How executive bonuses are tied to production targets that increase emissions',
    ],
  },
  {
    id: 'food-giants-deforestation',
    subject: 'Corporate-driven tropical deforestation',
    category: 'corporate-accountability',
    angles: [
      'Which food and commodity companies are linked to the most deforestation',
      'Rate of tropical forest loss and its contribution to global emissions',
      'Supply chain tracing from consumer brands back to deforestation hotspots',
    ],
  },
  {
    id: 'auto-industry-delay',
    subject: 'Auto industry and clean transportation delays',
    category: 'corporate-accountability',
    angles: [
      'The history of auto industry lobbying against electric vehicles and public transit',
      'Internal documents showing automakers knew about emissions risks decades ago',
      'How much earlier EV adoption could have occurred without industry opposition',
    ],
  },
  {
    id: 'shipping-aviation-hidden',
    subject: 'Shipping and aviation emissions',
    category: 'corporate-accountability',
    angles: [
      'Total emissions from global shipping and aviation and why they are excluded from national targets',
      'Private jet emissions of specific individuals compared to average annual per-capita output',
      'The regulatory gap that allows international transport to avoid emission accountability',
    ],
  },
  {
    id: 'pharma-chemical-pollution',
    subject: 'Chemical industry pollution and forever chemicals',
    category: 'corporate-accountability',
    angles: [
      'The prevalence of PFAS and forever chemicals in human blood, water, and soil globally',
      'Which chemical companies are responsible for the most contamination',
      'Health outcomes in communities near chemical manufacturing plants',
    ],
  },
  {
    id: 'mining-destruction',
    subject: 'Mining industry environmental destruction',
    category: 'corporate-accountability',
    angles: [
      'Environmental and community impact of mining operations in ecologically sensitive areas',
      'Specific mining projects destroying forests, hills, and indigenous land in India and globally',
      'The minerals-for-development trade-off and who actually benefits from extraction',
    ],
  },

  // === INDIA-SPECIFIC CATASTROPHE ===
  {
    id: 'india-top5-vulnerable',
    subject: 'India\'s climate vulnerability ranking and risks',
    category: 'india-specific',
    angles: [
      'Where India ranks among the most climate-vulnerable nations and what metrics drive that ranking',
      'Projected agricultural yield losses in India under different warming scenarios',
      'How India\'s vulnerability compares to its per-capita contribution to global emissions',
    ],
  },
  {
    id: 'india-monsoon-collapse',
    subject: 'Indian monsoon system disruption and climate change',
    category: 'india-specific',
    angles: [
      'How rising temperatures are altering the monsoon\'s timing, intensity, and reliability',
      'The share of Indian agriculture dependent on monsoon rainfall and projected disruption',
      'Historical monsoon pattern data vs recent anomalies and scientific projections',
    ],
  },
  {
    id: 'india-80crore-hungry',
    subject: 'India food security and climate change intersection',
    category: 'india-specific',
    angles: [
      'How many Indians depend on government food programs and projected crop yield declines',
      'The economic cost of climate-driven food insecurity in India',
      'Which Indian states face the highest risk of agricultural collapse from climate change',
    ],
  },
  {
    id: 'india-water-crisis-30cities',
    subject: 'Indian cities facing water scarcity',
    category: 'india-specific',
    angles: [
      'Which Indian cities are projected to face severe water shortages and by when',
      'Groundwater depletion rates across Indian states and climate amplification',
      'The gap between water infrastructure investment and rising demand in Indian metros',
    ],
  },
  {
    id: 'himalayan-glacier-meltdown',
    subject: 'Himalayan glacier retreat and downstream consequences',
    category: 'india-specific',
    angles: [
      'Rate of Himalayan glacier retreat and what the latest satellite data shows',
      'How many people in India depend on glacier-fed river systems for water',
      'The two-phase impact: near-term flooding followed by long-term water scarcity',
    ],
  },
  {
    id: 'india-55-degree-future',
    subject: 'Extreme heat projections for Indian states',
    category: 'india-specific',
    angles: [
      'Which Indian states will experience the highest peak temperatures under current projections',
      'Wet-bulb temperature thresholds and which Indian regions will cross survivability limits',
      'Infrastructure failure risks — power grids, roads, vehicles — under extreme heat scenarios',
    ],
  },
  {
    id: 'aravalli-hasdeo-destruction',
    subject: 'Aravalli and Hasdeo forest destruction',
    category: 'india-specific',
    angles: [
      'The ecological role of Aravalli hills and Hasdeo forests and what their loss means for the region',
      'Mining and development projects approved in these areas and their environmental impact assessments',
      'Community resistance and legal battles to protect these ecosystems',
    ],
  },
  {
    id: 'india-314-extreme-days',
    subject: 'Extreme weather event frequency in India',
    category: 'india-specific',
    angles: [
      'How many days per year India experiences extreme weather events and the trend over the past decade',
      'Economic and human cost of extreme weather in India annually',
      'How media coverage of extreme weather compares to its actual frequency and severity',
    ],
  },
  {
    id: 'india-farm-crisis-climate',
    subject: 'Indian agriculture and climate change impacts',
    category: 'india-specific',
    angles: [
      'Projected crop yield declines for major Indian crops under warming scenarios',
      'How erratic monsoons and extreme heat events are already affecting harvests',
      'The economic toll on Indian farmers from climate-driven agricultural disruption',
    ],
  },
  {
    id: 'india-informal-workers-death',
    subject: 'India\'s informal workers and extreme heat exposure',
    category: 'india-specific',
    angles: [
      'How many informal workers in India are exposed to dangerous heat with no protection',
      'Heat-related deaths and hospitalizations among outdoor laborers in Indian cities',
      'The policy gap in heat action plans for informal sector workers',
    ],
  },

  // === DEVELOPMENT = SELF-DESTRUCTION ===
  {
    id: 'development-body-earth',
    subject: 'Human physiological dependence on planetary systems',
    category: 'development-vs-environment',
    angles: [
      'How human biology is calibrated to current atmospheric and temperature conditions',
      'Health impacts when environmental parameters shift beyond human tolerance',
      'The scientific case that environmental health and human health are inseparable',
    ],
  },
  {
    id: 'kidney-for-development',
    subject: 'Natural resource depletion for economic growth',
    category: 'development-vs-environment',
    angles: [
      'Countries that depleted natural resources for GDP growth and the long-term economic consequences',
      'The economic value of ecosystem services vs GDP from resource extraction',
      'Case studies where resource extraction created short-term wealth but long-term collapse',
    ],
  },
  {
    id: 'gdp-hides-destruction',
    subject: 'GDP measurement and hidden climate costs',
    category: 'development-vs-environment',
    angles: [
      'How much GDP growth is offset by unreported climate damage in major economies',
      'Alternative economic metrics that account for environmental destruction',
      'India\'s estimated GDP losses from climate change — current and projected',
    ],
  },
  {
    id: 'degrowth-not-growth',
    subject: 'Degrowth economics and planetary boundaries',
    category: 'development-vs-environment',
    angles: [
      'The mathematical relationship between global consumption levels and planetary carrying capacity',
      'Countries or regions experimenting with degrowth or post-growth economic models',
      'Which planetary boundaries have been crossed and what the data shows about consumption trajectories',
    ],
  },

  // === PARIS AGREEMENT & POLITICAL FAILURE ===
  {
    id: 'paris-agreement-dead',
    subject: 'Paris Agreement progress and emission reduction targets',
    category: 'political-failure',
    angles: [
      'How current global emissions compare to the Paris Agreement reduction targets',
      'Which countries are on track and which are failing their NDC commitments',
      'The history of climate summit pledges vs actual emission trajectories',
    ],
  },
  {
    id: 'democracy-climate-failure',
    subject: 'Democratic politics and long-term climate policy',
    category: 'political-failure',
    angles: [
      'Why election cycles create structural barriers to long-term climate policy',
      'How climate policy ranks as a voter priority across different democracies',
      'Examples of politicians who won or lost elections based on climate positions',
    ],
  },
  {
    id: 'trump-climate-denial',
    subject: 'United States climate policy reversals',
    category: 'political-failure',
    angles: [
      'The impact of US withdrawal from Paris and rollback of climate regulations on global emissions',
      'How US climate science funding and communication has been affected by political changes',
      'The global ripple effect when the largest historical emitter weakens climate commitments',
    ],
  },
  {
    id: 'election-manifestos-silent',
    subject: 'Climate change in political party platforms worldwide',
    category: 'political-failure',
    angles: [
      'How much space climate change gets in major party manifestos across democracies',
      'The gap between climate threat severity and political attention across countries',
      'Why climate change remains politically invisible despite polling as a top concern',
    ],
  },
  {
    id: 'fossil-fuel-subsidies',
    subject: 'Government fossil fuel subsidies',
    category: 'political-failure',
    angles: [
      'Total global fossil fuel subsidies by country and how they compare to clean energy spending',
      'How taxpayer money flows to fossil fuel companies through direct and indirect subsidies',
      'The IMF and IEA data on what ending fossil fuel subsidies would mean for emissions',
    ],
  },

  // === MASS EXTINCTION & SPECIES COLLAPSE ===
  {
    id: 'sixth-mass-extinction',
    subject: 'Current species extinction rates',
    category: 'extinction',
    angles: [
      'How current extinction rates compare to the natural background rate',
      'Which taxonomic groups are declining fastest and the latest IUCN Red List data',
      'The historical comparison between the current extinction event and the previous five',
    ],
  },
  {
    id: 'biodiversity-collapse',
    subject: 'Global wildlife population decline',
    category: 'extinction',
    angles: [
      'The Living Planet Index data on wildlife population decline over the past 50 years',
      'Which biomes and regions have lost the most wildlife and why',
      'The cascading ecosystem effects when keystone species populations collapse',
    ],
  },
  {
    id: 'pollination-collapse',
    subject: 'Pollinator decline and food system risks',
    category: 'extinction',
    angles: [
      'Global pollinator population decline data and the main drivers',
      'Which crops depend on pollinators and the economic value of pollination services',
      'Temperature thresholds beyond which pollinator populations cannot survive',
    ],
  },
  {
    id: 'ocean-boiling-acid',
    subject: 'Ocean warming, acidification, and marine ecosystem decline',
    category: 'extinction',
    angles: [
      'Ocean temperature and acidification trends from the latest oceanographic data',
      'Coral reef bleaching rates and projections under current warming trajectories',
      'Sea level rise acceleration data and coastal population exposure',
    ],
  },
  {
    id: 'birds-dying-no-home',
    subject: 'Bird population decline and habitat loss',
    category: 'extinction',
    angles: [
      'Global bird population decline data and which species are most affected',
      'How deforestation and urbanization are eliminating bird habitats',
      'The impact of extreme heat on bird survival and migration patterns',
    ],
  },

  // === POPULATION & CONSUMPTION ===
  {
    id: 'population-root-cause',
    subject: 'Population growth and total carbon emissions',
    category: 'population-consumption',
    angles: [
      'The mathematical relationship between population, per-capita consumption, and total emissions',
      'How population growth projections affect emission reduction feasibility',
      'The relative impact of population reduction vs per-capita consumption reduction on total emissions',
    ],
  },
  {
    id: 'one-child-58-tonnes',
    subject: 'Carbon impact of family size decisions',
    category: 'population-consumption',
    angles: [
      'CO2 savings from having fewer children compared to other individual lifestyle changes',
      'The research behind per-child emission estimates and its methodology',
      'Why population discussions remain taboo in mainstream climate discourse',
    ],
  },
  {
    id: 'bonded-customers',
    subject: 'Consumer culture and manufactured demand',
    category: 'population-consumption',
    angles: [
      'How advertising spending by polluting industries correlates with consumption patterns',
      'Planned obsolescence data and its contribution to resource extraction and waste',
      'The gap between what people need and what they consume in high-income countries',
    ],
  },
  {
    id: 'earth-overshoot',
    subject: 'Earth Overshoot Day and ecological footprint',
    category: 'population-consumption',
    angles: [
      'When Earth Overshoot Day falls each year and how the trend is moving',
      'How many Earths different countries would need if everyone lived like their citizens',
      'Which resources are being consumed fastest beyond regeneration rates',
    ],
  },

  // === BILLIONAIRE ESCAPE & SPACE COLONIZATION ===
  {
    id: 'mars-escape-plan',
    subject: 'Billionaire space ventures and climate responsibility',
    category: 'billionaire-escape',
    angles: [
      'The carbon footprint of space launches by private companies',
      'How much billionaires spend on space ventures vs climate solutions',
      'The narrative of space colonization as an alternative to fixing Earth',
    ],
  },
  {
    id: 'elon-7-kids-hypocrisy',
    subject: 'Tech billionaire climate contradictions',
    category: 'billionaire-escape',
    angles: [
      'The personal carbon footprints of prominent tech billionaires who advocate for population growth',
      'The environmental impact of companies owned by billionaires who publicly discuss climate',
      'The contradiction between pro-natalist messaging and planetary resource constraints',
    ],
  },
  {
    id: 'billionaire-bunkers',
    subject: 'Ultra-wealthy climate disaster preparation',
    category: 'billionaire-escape',
    angles: [
      'The doomsday bunker and safe-haven real estate market among the ultra-wealthy',
      'How much the ultra-rich are spending on climate adaptation for themselves',
      'The overlap between climate denial funding and personal disaster preparation by the same individuals',
    ],
  },

  // === MEDIA & INFORMATION SUPPRESSION ===
  {
    id: 'media-blackout-climate',
    subject: 'Media coverage of climate change',
    category: 'media-suppression',
    angles: [
      'How many minutes per day major TV networks dedicate to climate coverage',
      'Climate coverage as a share of total news airtime compared to other topics',
      'The trend in climate media coverage over the past decade across countries',
    ],
  },
  {
    id: 'algorithm-suppression',
    subject: 'Social media algorithms and climate content visibility',
    category: 'media-suppression',
    angles: [
      'Research on how social media algorithms rank climate content vs other categories',
      'Platform policies that affect the reach of environmental content',
      'The ownership overlap between social media platforms and fossil fuel investment',
    ],
  },
  {
    id: 'climate-denial-industry',
    subject: 'Organized climate denial funding and networks',
    category: 'media-suppression',
    angles: [
      'How much money has been spent funding climate denial research and media',
      'The network of think tanks, foundations, and organizations behind climate denial',
      'The correlation between wealth levels and climate skepticism across demographics',
    ],
  },
  {
    id: 'entertainment-as-sedative',
    subject: 'Entertainment industry and public attention displacement',
    category: 'media-suppression',
    angles: [
      'How public attention is distributed between entertainment and existential issues',
      'The economics of attention: how much is spent capturing attention for entertainment vs awareness',
      'Research on information overload and its effect on public engagement with climate issues',
    ],
  },

  // === HIDDEN CONSEQUENCES ===
  {
    id: 'climate-refugees-120cr',
    subject: 'Climate-driven displacement and migration projections',
    category: 'hidden-consequences',
    angles: [
      'World Bank and UNHCR projections for climate refugees by 2050',
      'Which regions will produce the most climate migrants and where they will go',
      'The geopolitical and conflict risks of mass climate-driven migration',
    ],
  },
  {
    id: 'water-wars-coming',
    subject: 'Water scarcity and geopolitical conflict risk',
    category: 'hidden-consequences',
    angles: [
      'Transboundary water disputes and how climate change is intensifying them',
      'Which shared river basins and aquifers are at highest risk of conflict',
      'Historical examples of water scarcity contributing to social unrest and state failure',
    ],
  },
  {
    id: 'dormant-viruses-ice',
    subject: 'Permafrost thaw and ancient pathogen release',
    category: 'hidden-consequences',
    angles: [
      'What scientists have found frozen in permafrost and the viability of ancient pathogens',
      'The rate of permafrost thaw and which regions are most affected',
      'The pandemic risk assessment from pathogen release as ice melts',
    ],
  },
  {
    id: 'brain-heart-climate',
    subject: 'Climate change effects on human cardiovascular and neurological health',
    category: 'hidden-consequences',
    angles: [
      'Research linking extreme heat to cardiovascular events, strokes, and mortality',
      'How atmospheric and temperature changes affect neurological function and mental health',
      'Heat-related mortality data among young and working-age populations',
    ],
  },
  {
    id: 'reproductive-crisis',
    subject: 'Climate change and human reproductive health',
    category: 'hidden-consequences',
    angles: [
      'Research on temperature effects on fertility, sperm quality, and reproductive outcomes',
      'How endocrine-disrupting pollutants linked to fossil fuels affect reproduction',
      'Comparative data on temperature-dependent reproductive effects across species',
    ],
  },
  {
    id: 'rivers-will-vanish',
    subject: 'Glacier-fed river systems and water supply collapse',
    category: 'hidden-consequences',
    angles: [
      'Which major river systems depend on glaciers and how fast those glaciers are retreating',
      'The timeline: when glacier-fed rivers will shift from flood risk to permanent low flow',
      'How many people depend on glacier-fed rivers for drinking water and agriculture',
    ],
  },
  {
    id: 'average-vs-extreme',
    subject: 'Average temperature rise vs peak extreme temperatures',
    category: 'hidden-consequences',
    angles: [
      'How a 2C average global rise translates to peak temperatures in specific regions',
      'Wet-bulb temperature data and human survivability thresholds',
      'The difference between reported average warming and what people actually experience on extreme days',
    ],
  },
  {
    id: 'low-end-tech-fails',
    subject: 'Infrastructure and technology failure under extreme heat',
    category: 'hidden-consequences',
    angles: [
      'Temperature thresholds at which common vehicles, AC units, and electronics fail',
      'Power grid failure data during heatwaves and capacity limitations in developing countries',
      'The cost of infrastructure not designed for extreme heat scenarios',
    ],
  },

  // === SYSTEMIC & CONSCIOUSNESS ===
  {
    id: 'consumerism-crisis',
    subject: 'Consumerism, mass production, and emissions',
    category: 'systemic',
    angles: [
      'How consumer spending growth tracks with global emission increases',
      'The advertising-to-consumption pipeline and its carbon footprint',
      'Which consumer product categories contribute most to emissions and waste',
    ],
  },
  {
    id: 'iq-declining-engineered',
    subject: 'Declining cognitive metrics and environmental factors',
    category: 'systemic',
    angles: [
      'Research on the reversal of the Flynn Effect and potential environmental causes',
      'How air pollution, lead exposure, and microplastics are linked to cognitive decline',
      'The relationship between education access, information quality, and environmental awareness',
    ],
  },
  {
    id: 'value-system-catastrophe',
    subject: 'Cultural values, wealth worship, and environmental destruction',
    category: 'systemic',
    angles: [
      'Research on how societies that prioritize material wealth treat environmental issues',
      'The correlation between materialism metrics and per-capita emissions across cultures',
      'How cultural role models and aspirational figures shape consumption patterns',
    ],
  },
  {
    id: 'recycling-is-a-scam',
    subject: 'Individual vs corporate responsibility for emissions',
    category: 'systemic',
    angles: [
      'The share of global emissions attributable to individual consumer choices vs corporate decisions',
      'The history of how "personal carbon footprint" was created by fossil fuel industry PR',
      'What proportion of emission reduction can come from individual behavior change vs systemic policy',
    ],
  },
  {
    id: 'last-generation-to-act',
    subject: 'Climate action window and generational responsibility',
    category: 'systemic',
    angles: [
      'The scientific timeline for when climate intervention becomes ineffective',
      'What the current generation\'s inaction costs the next generation economically',
      'Tipping point timelines and the narrowing window for meaningful emission reduction',
    ],
  },

  // === EXISTING TOPICS (refined) ===
  {
    id: 'climate-refugees',
    subject: 'Climate refugees and forced displacement',
    category: 'hidden-consequences',
    angles: [
      'Current numbers of climate-displaced people and year-over-year trends',
      'Which countries and regions are producing the most climate migrants',
      'Legal and political status of climate refugees under international law',
    ],
  },
  {
    id: 'economic-losses',
    subject: 'Economic cost of climate change',
    category: 'hidden-consequences',
    angles: [
      'Total global economic losses attributed to climate change in recent years',
      'How climate-related economic damage is distributed between rich and poor nations',
      'Projected GDP losses under different warming scenarios by region',
    ],
  },
  {
    id: 'extreme-weather-cost',
    subject: 'Extreme weather event frequency and economic damage',
    category: 'hidden-consequences',
    angles: [
      'How extreme weather event frequency has changed over the past 30 years',
      'The annual economic cost of floods, heatwaves, and cyclones globally',
      'Insurance industry data on climate-related claims and uninsurable risk zones',
    ],
  },
  {
    id: 'food-security-crisis',
    subject: 'Global food security and climate-driven crop yield decline',
    category: 'hidden-consequences',
    angles: [
      'Projected yield declines for staple crops (wheat, rice, maize) under warming scenarios',
      'How many additional people face hunger due to climate-driven food disruption',
      'The intersection of population growth and declining agricultural productivity',
    ],
  },
  {
    id: 'health-crisis',
    subject: 'Climate change as a public health emergency',
    category: 'hidden-consequences',
    angles: [
      'Heat-related deaths and hospitalizations globally and the trend over the past decade',
      'How climate change is expanding the range of vector-borne diseases',
      'The mental health impacts of climate disasters, displacement, and eco-anxiety',
    ],
  },
  {
    id: 'arctic-ice-melt',
    subject: 'Arctic and Antarctic ice loss and feedback loops',
    category: 'extinction',
    angles: [
      'The rate of Arctic and Antarctic ice loss from the latest satellite data',
      'How ice-albedo feedback accelerates warming once ice cover is lost',
      'Projected timelines for ice-free Arctic summers under current emission trajectories',
    ],
  },
  {
    id: 'tipping-points',
    subject: 'Climate tipping points and irreversible feedback loops',
    category: 'extinction',
    angles: [
      'Which climate tipping points have already been crossed according to latest research',
      'The cascading effects when one tipping point triggers another',
      'What the latest science says about reversibility once tipping points are passed',
    ],
  },
  {
    id: 'environmental-racism',
    subject: 'Environmental racism and pollution distribution',
    category: 'systemic',
    angles: [
      'Data on how polluting facilities are distributed relative to income and race demographics',
      'Health outcome disparities between communities near industrial pollution vs affluent areas',
      'How the Global South bears disproportionate toxic waste and pollution from the Global North',
    ],
  },
  {
    id: 'coral-reef-death',
    subject: 'Coral reef decline and marine ecosystem collapse',
    category: 'extinction',
    angles: [
      'Percentage of global coral reefs that have bleached or died in recent years',
      'What marine biodiversity and coastal communities lose when reefs collapse',
      'Temperature thresholds for coral survival and projected timelines for mass die-off',
    ],
  },
  {
    id: 'wildfires-dead-forests',
    subject: 'Megafires and forest carbon release',
    category: 'hidden-consequences',
    angles: [
      'How wildfire frequency, intensity, and area burned have changed over the past two decades',
      'Carbon released by wildfires and how it compares to country-level emissions',
      'The feedback loop: dry soil releases carbon, fires spread, air quality collapses',
    ],
  },
  {
    id: 'climate-lawsuits',
    subject: 'Climate litigation against corporations and governments',
    category: 'political-failure',
    angles: [
      'The number and outcomes of climate lawsuits filed globally in recent years',
      'Landmark court rulings holding corporations or governments accountable for climate damage',
      'The resource asymmetry between corporate legal teams and public interest litigants',
    ],
  },
  {
    id: 'renewables-cheaper',
    subject: 'Renewable energy cost competitiveness',
    category: 'political-failure',
    angles: [
      'Current levelized cost of solar and wind vs fossil fuels across regions',
      'What is blocking faster renewable adoption despite cost advantages',
      'Fossil fuel lobbying spending vs renewable energy subsidies by country',
    ],
  },
  {
    id: 'carbon-capture-scam',
    subject: 'Carbon capture technology effectiveness',
    category: 'political-failure',
    angles: [
      'How much CO2 current carbon capture facilities actually remove vs their targets',
      'The energy cost of running carbon capture and whether it creates net positive removal',
      'How fossil fuel companies use carbon capture promises to justify continued extraction',
    ],
  },
  {
    id: 'soil-degradation',
    subject: 'Soil degradation and farmland loss',
    category: 'hidden-consequences',
    angles: [
      'How much arable land is being lost to degradation annually and the causes',
      'The carbon stored in soil and how degradation releases it',
      'How soil health decline compounds food security risks from climate change',
    ],
  },
  {
    id: 'child-labor-supply-chains',
    subject: 'Child labor in climate-linked supply chains',
    category: 'systemic',
    angles: [
      'The number of children working in mining and agriculture linked to climate-relevant industries',
      'Specific supply chains (cobalt, palm oil, cocoa) where child labor and environmental damage intersect',
      'How climate displacement pushes more children into exploitative labor',
    ],
  },
  {
    id: 'indigenous-land-defenders',
    subject: 'Threats to indigenous environmental defenders',
    category: 'systemic',
    angles: [
      'How many environmental and indigenous land defenders are killed or threatened annually',
      'Which countries and industries are most dangerous for environmental activists',
      'The role indigenous land management plays in carbon sequestration and biodiversity',
    ],
  },
  {
    id: 'women-and-climate',
    subject: 'Gender and climate change vulnerability',
    category: 'systemic',
    angles: [
      'How climate disasters disproportionately affect women and girls with specific data',
      'The additional labor burden on women from water scarcity and resource depletion',
      'How climate displacement affects girls\' education access and outcomes',
    ],
  },
  {
    id: 'microplastics-in-humans',
    subject: 'Microplastic contamination in human bodies',
    category: 'hidden-consequences',
    angles: [
      'Where microplastics have been found in the human body and at what concentrations',
      'Annual plastic production volumes and the share that enters the environment',
      'The latest research on health effects of microplastic accumulation in organs',
    ],
  },
  {
    id: 'ocean-dead-zones',
    subject: 'Ocean dead zones and oxygen depletion',
    category: 'extinction',
    angles: [
      'How many ocean dead zones exist and how fast they are growing',
      'The causes of ocean deoxygenation and its link to warming and nutrient runoff',
      'What happens to marine ecosystems and fishing communities when dead zones expand',
    ],
  },
];
