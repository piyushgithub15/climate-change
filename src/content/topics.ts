export interface ClimateTopic {
  id: string;
  theme: string;
  description: string;
}

export const CLIMATE_TOPICS: ClimateTopic[] = [
  {
    id: 'fossil-fuel-giants',
    theme: 'Fossil fuel corporations and their role in global emissions',
    description: 'ExxonMobil, Shell, BP, Chevron, Saudi Aramco, ConocoPhillips, TotalEnergies — who profits, who knew, who lied',
  },
  {
    id: 'billionaire-carbon',
    theme: 'Billionaire lifestyles and their outsized carbon footprints',
    description: 'Private jets, superyachts, luxury real estate, space tourism — the ultra-wealthy vs the average person',
  },
  {
    id: 'water-privatization',
    theme: 'Corporate water privatization and freshwater depletion',
    description: 'Nestlé, Coca-Cola, Danone, industrial agriculture draining aquifers and bottling public water for profit',
  },
  {
    id: 'big-meat-industry',
    theme: 'The meat and dairy industry\'s climate impact',
    description: 'JBS, Tyson, Cargill, Dairy Farmers of America — emissions, deforestation, methane, lobbying',
  },
  {
    id: 'big-tech-energy',
    theme: 'Big tech companies and their massive energy consumption',
    description: 'Google, Microsoft, Amazon, Meta — data centers, AI training, crypto mining, carbon offset games',
  },
  {
    id: 'plastic-producers',
    theme: 'Corporations behind the global plastic crisis',
    description: 'Coca-Cola, PepsiCo, Nestlé, Unilever, petrochemical companies — production, pollution, recycling myth',
  },
  {
    id: 'greenwashing-exposed',
    theme: 'Corporate greenwashing and false climate promises',
    description: 'Shell, BP, TotalEnergies, airlines, car companies — green marketing vs actual climate action',
  },
  {
    id: 'banking-fossil-fuels',
    theme: 'Banks and financial institutions funding fossil fuels',
    description: 'JPMorgan Chase, Citi, Bank of America, HSBC, BlackRock, Vanguard — trillions flowing into fossil fuels',
  },
  {
    id: 'lobbying-machine',
    theme: 'Fossil fuel lobbying and climate denial funding',
    description: 'Koch network, ExxonMobil, API, dark money think tanks — blocking climate policy for decades',
  },
  {
    id: 'ceo-vs-workers',
    theme: 'Executive profits at polluting companies vs community impact',
    description: 'CEO pay, shareholder dividends, health costs in frontline communities, environmental justice',
  },
  {
    id: 'food-giants-deforestation',
    theme: 'Corporate-driven deforestation of tropical forests',
    description: 'Cargill, JBS, Bunge, Wilmar, palm oil, soy, cattle — Amazon, Congo Basin, Southeast Asia',
  },
  {
    id: 'auto-industry-delay',
    theme: 'How the auto industry delayed clean transportation',
    description: 'GM, Toyota, Volkswagen — killed EVs, rigged emissions, lobbied against efficiency standards',
  },
  {
    id: 'shipping-aviation-hidden',
    theme: 'Hidden emissions from shipping, aviation, and cruise industries',
    description: 'Maersk, Carnival, major airlines — exempt from regulation, massive unaccounted pollution',
  },
  {
    id: 'pharma-chemical-pollution',
    theme: 'Chemical industry contamination of water, soil, and health',
    description: 'DuPont, Dow, BASF, Bayer, 3M — PFAS forever chemicals, pesticides, Cancer Alley',
  },
  {
    id: 'mining-destruction',
    theme: 'Environmental and human cost of the mining industry',
    description: 'Glencore, BHP, Rio Tinto, Vale — dam collapses, toxic tailings, destroyed ecosystems and communities',
  },
  {
    id: 'climate-refugees',
    theme: 'Climate refugees and forced displacement',
    description: 'Rising seas, droughts, extreme weather forcing millions from their homes — Bangladesh, Pacific Islands, Sub-Saharan Africa, Central America',
  },
  {
    id: 'economic-losses',
    theme: 'The staggering economic cost of climate change',
    description: 'Trillions in disaster damage, crop failures, insurance collapse, GDP losses — who pays and who profits from climate disasters',
  },
  {
    id: 'biodiversity-collapse',
    theme: 'Mass extinction and biodiversity collapse driven by corporations',
    description: 'Pollinator decline, coral reef death, deforestation, ocean dead zones — species disappearing at 1,000x natural rate',
  },
  {
    id: 'extreme-weather-cost',
    theme: 'Extreme weather events and their growing human toll',
    description: 'Hurricanes, wildfires, floods, heatwaves — frequency, death toll, damage costs, and who is most vulnerable',
  },
  {
    id: 'food-security-crisis',
    theme: 'Climate change threatening global food security',
    description: 'Crop failures, fishery collapse, rising food prices, famine risk — how warming reshapes what and where we can grow',
  },
  {
    id: 'health-crisis',
    theme: 'Climate change as a public health emergency',
    description: 'Heat deaths, air pollution, new disease vectors, mental health toll — WHO calls it the biggest health threat of the century',
  },
  {
    id: 'arctic-ice-melt',
    theme: 'Arctic and Antarctic ice melt and sea level rise',
    description: 'Greenland, West Antarctic ice sheet, permafrost thaw, methane bombs — tipping points that could reshape coastlines',
  },
  {
    id: 'ocean-acidification',
    theme: 'Ocean acidification and marine ecosystem collapse',
    description: 'CO2 absorption turning oceans acidic, coral bleaching, shellfish die-offs, fishing industry collapse',
  },
  {
    id: 'insurance-retreat',
    theme: 'The insurance industry retreating from climate risk',
    description: 'Insurers pulling out of wildfire zones, flood plains, hurricane coasts — homeowners left unprotected, property values crashing',
  },
  {
    id: 'climate-inequality',
    theme: 'Climate inequality — who pollutes vs who suffers',
    description: 'Global North emissions vs Global South consequences, per-capita disparities, climate debt, loss and damage',
  },
  {
    id: 'fossil-fuel-subsidies',
    theme: 'Governments subsidizing fossil fuels with taxpayer money',
    description: '$7 trillion in annual fossil fuel subsidies globally — IMF data, G20 broken promises, clean energy underfunding',
  },
  {
    id: 'child-labor-supply-chains',
    theme: 'Child labor in climate-linked supply chains',
    description: 'Cobalt mining, palm oil plantations, cocoa farms, fast fashion — children exploited in supply chains of major corporations',
  },
  {
    id: 'water-crisis',
    theme: 'The global freshwater crisis accelerated by climate change',
    description: 'Aquifer depletion, glacier melt, drought intensification — billions facing water scarcity by 2050',
  },
  {
    id: 'tipping-points',
    theme: 'Climate tipping points we may have already crossed',
    description: 'Amazon dieback, permafrost thaw, AMOC slowdown, ice sheet collapse — irreversible changes already underway',
  },
  {
    id: 'environmental-racism',
    theme: 'Environmental racism and pollution in marginalized communities',
    description: 'Flint water crisis, Cancer Alley, sacrifice zones — pollution disproportionately in Black, Indigenous, and low-income communities',
  },
  {
    id: 'climate-migration-internal',
    theme: 'Climate migration and displacement within countries',
    description: 'Internal displacement in India, US, China due to floods, heat, drought — people forced to move but with nowhere to go',
  },
  {
    id: 'climate-anxiety',
    theme: 'Mental health and climate anxiety',
    description: 'Eco-grief, solastalgia, youth climate anxiety — the psychological toll of watching the planet unravel',
  },
  {
    id: 'indigenous-land-defenders',
    theme: 'Indigenous land defenders killed for protecting forests',
    description: 'Activists murdered for resisting mining, logging, and agribusiness — who is killing them and which corporations benefit',
  },
  {
    id: 'women-and-climate',
    theme: 'Women bearing the brunt of climate change',
    description: 'Disproportionate impact on women in the Global South — unpaid labor increases during disasters, water collection, food insecurity',
  },
  {
    id: 'soil-degradation',
    theme: 'Soil degradation and the collapse of farmland',
    description: '60 harvests left in topsoil, industrial farming destroying earth\'s largest carbon sink, desertification spreading',
  },
  {
    id: 'coral-reef-death',
    theme: 'Coral reef death and what we lose at each degree of warming',
    description: 'What dies at 1.5C vs 2C vs 3C — Great Barrier Reef, Caribbean reefs, the timeline of collapse',
  },
  {
    id: 'microplastics-in-humans',
    theme: 'Microplastics found inside the human body',
    description: 'Detected in blood, lungs, brain, placenta — health consequences only now emerging, where they come from',
  },
  {
    id: 'ocean-dead-zones',
    theme: 'Ocean dead zones spreading across the world',
    description: 'Over 400 oxygen-depleted areas, fertilizer runoff from industrial farming, marine life suffocating',
  },
  {
    id: 'light-noise-pollution',
    theme: 'Light and noise pollution disrupting ecosystems',
    description: 'Bird migration thrown off, insect populations crashing, marine life disoriented — the invisible pollution crisis',
  },
  {
    id: 'wildfires-dead-forests',
    theme: 'Megafires and dying forests in a warming world',
    description: 'Record wildfires, bark beetle outbreaks, forests turning from carbon sinks to carbon sources — feedback loops accelerating',
  },
  {
    id: 'climate-lawsuits',
    theme: 'Climate lawsuits holding corporations and governments accountable',
    description: 'Courts ordering Shell to cut emissions, youth-led cases, governments found in violation of climate duties',
  },
  {
    id: 'renewables-cheaper',
    theme: 'Renewable energy is already cheaper — so who is blocking it',
    description: 'Solar and wind cost curves plummeting, fossil fuel lobbying blocking adoption, grid access denied to clean energy',
  },
  {
    id: 'carbon-capture-scam',
    theme: 'The carbon capture scam propping up fossil fuels',
    description: 'CCS as excuse to keep drilling, billions in subsidies, actual capture rates vs industry claims — a fraction of what is promised',
  },
  {
    id: 'ewaste-right-to-repair',
    theme: 'E-waste mountains and the fight for right to repair',
    description: 'Apple, Samsung, planned obsolescence — 50 million tonnes of e-waste annually, toxic dumps in Ghana and India',
  },
];
