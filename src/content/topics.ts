export interface ClimateTopic {
  id: string;
  theme: string;
}

export const CLIMATE_TOPICS: ClimateTopic[] = [
  // === CORPORATE & ELITE ACCOUNTABILITY ===
  { id: 'fossil-fuel-giants', theme: 'Fossil fuel corporations and their role in global emissions — 30-35 companies responsible for majority of all emissions, yet face zero accountability' },
  { id: 'billionaire-carbon', theme: 'Billionaire lifestyles and their outsized carbon footprints — if every human consumed like a single billionaire, we would need 20,000 Earths' },
  { id: 'one-percent-destroyers', theme: 'The top 1% and 30-35 corporations are the real climate destroyers — income inequality and carbon emissions rise in perfect parallel, yet the poor are blamed' },
  { id: 'big-meat-industry', theme: 'The meat and dairy industry\'s climate impact — industrial animal agriculture as one of the largest sources of methane and deforestation' },
  { id: 'big-tech-energy', theme: 'Big tech companies and their massive energy consumption — data centers, AI training, and crypto mining consuming more electricity than entire nations' },
  { id: 'plastic-producers', theme: 'Corporations behind the global plastic crisis — producing billions of tonnes while pushing recycling propaganda onto consumers' },
  { id: 'greenwashing-exposed', theme: 'Corporate greenwashing and false climate promises — net-zero pledges without enforceable timelines are just press releases, not commitments' },
  { id: 'banking-fossil-fuels', theme: 'Banks and financial institutions have poured trillions into fossil fuels since the Paris Agreement — your deposits fund the destruction' },
  { id: 'lobbying-machine', theme: 'Fossil fuel lobbying and climate denial funding — billions spent to buy politicians, suppress science, and keep the public ignorant' },
  { id: 'ceo-vs-workers', theme: 'Executive profits at polluting companies vs workers dying from heat — CEOs earning millions while their emissions kill thousands' },
  { id: 'food-giants-deforestation', theme: 'Corporate-driven deforestation of tropical forests — every minute, 27 football fields of forest are destroyed for profit' },
  { id: 'auto-industry-delay', theme: 'How the auto industry deliberately delayed clean transportation for decades to protect profits' },
  { id: 'shipping-aviation-hidden', theme: 'Hidden emissions from shipping, aviation, and private jets — billionaires fly private while telling you to recycle' },
  { id: 'pharma-chemical-pollution', theme: 'Chemical industry contamination of water, soil, and bodies — forever chemicals found in every human tested' },
  { id: 'mining-destruction', theme: 'Mining industry destroying forests, hills, and indigenous land — Aravalli, Hasdeo, and Ladakh being sacrificed for minerals while locals starve' },

  // === INDIA-SPECIFIC CATASTROPHE ===
  { id: 'india-top5-vulnerable', theme: 'India is among the top 5 countries most vulnerable to climate change — alongside Pakistan and Bangladesh, facing complete agricultural collapse' },
  { id: 'india-monsoon-collapse', theme: 'India\'s monsoon system is breaking — the delicate land-sea temperature differential that drives 70% of India\'s agriculture is being destroyed' },
  { id: 'india-80crore-hungry', theme: '80 crore Indians need free food to survive — when climate change cuts crop yields by 25%, what happens to them? Nobody is asking this question' },
  { id: 'india-water-crisis-30cities', theme: '30 Indian cities face extreme water scarcity — Jaipur, Indore, Thane, Vadodara, Srinagar and more will run dry, and we are doing nothing' },
  { id: 'himalayan-glacier-meltdown', theme: 'Himalayan glaciers are melting at catastrophic rates — first comes flooding, then permanent drought. 75 crore Indians depend on these rivers' },
  { id: 'india-55-degree-future', theme: 'UP, Bihar, Rajasthan, Delhi, Haryana will see 55-60°C temperatures — your AC won\'t work, your power grid will collapse, your tires will melt on the road' },
  { id: 'aravalli-hasdeo-destruction', theme: 'Aravalli hills and Hasdeo forests being destroyed for mining — cutting the lungs of central India while calling it development' },
  { id: 'india-314-extreme-days', theme: '314 out of 365 days in India had extreme weather events — not a single day without disaster somewhere in the country, yet media shows cricket and politics' },
  { id: 'india-farm-crisis-climate', theme: 'Indian farmers are being destroyed by climate change — erratic monsoons, extreme heat burning standing crops, 30% yield drop coming in 20 years' },
  { id: 'india-informal-workers-death', theme: 'India\'s informal sector workers — rickshaw drivers, laborers, street vendors — will be the first to die from 50°C heat. They have no AC, no insurance, no voice' },

  // === DEVELOPMENT = SELF-DESTRUCTION ===
  { id: 'development-body-earth', theme: 'Development vs Environment is a false choice — your body IS Earth. Your lungs, blood pressure, heartbeat are all calibrated to this planet. Destroy Earth, destroy yourself' },
  { id: 'kidney-for-development', theme: 'Selling Earth\'s resources for GDP is like selling your kidney to get rich — you might get money but you destroyed the body that needs it' },
  { id: 'gdp-hides-destruction', theme: 'GDP growth hides climate destruction — India\'s GDP already lost 10% to climate change this year, heading to 30-40% loss. Nobody reports this number' },
  { id: 'degrowth-not-growth', theme: 'We don\'t need more development — we need de-growth. 800 crore humans cannot sustain current consumption levels. The math is simple and terrifying' },

  // === PARIS AGREEMENT & POLITICAL FAILURE ===
  { id: 'paris-agreement-dead', theme: 'The Paris Agreement is dead — emissions were supposed to drop 44% by 2030, instead they INCREASED by 3%. Every climate summit is theater' },
  { id: 'democracy-climate-failure', theme: 'Democracy is failing climate — no politician will win votes by telling truth about climate. They promise ₹100 in your pocket while the planet burns' },
  { id: 'trump-climate-denial', theme: 'The US pulled out of Paris, removed climate from school curricula, silenced scientists on social media — the richest nation choosing planetary suicide' },
  { id: 'election-manifestos-silent', theme: 'Climate change appears in ZERO election manifestos worldwide — the most existential threat in human history and no political party will even mention it' },
  { id: 'fossil-fuel-subsidies', theme: 'Governments subsidizing fossil fuels with taxpayer money — paying for your own destruction with your own taxes' },

  // === MASS EXTINCTION & SPECIES COLLAPSE ===
  { id: 'sixth-mass-extinction', theme: 'We are living through the 6th mass extinction — 100 to 1,000 species going extinct EVERY DAY. In the time you read this post, species vanished forever' },
  { id: 'biodiversity-collapse', theme: '70-80% of wildlife in forests wiped out in just 50 years — in one human lifetime, we destroyed what took millions of years to evolve' },
  { id: 'pollination-collapse', theme: 'Pollination is collapsing — the tiny insects that make your food possible cannot survive 3°C rise. No insects = no crops = no humans' },
  { id: 'ocean-boiling-acid', theme: 'Our oceans have become warming, acidifying death traps — coral reefs dying, 70% of marine life at risk, sea levels rising at accelerating pace' },
  { id: 'birds-dying-no-home', theme: 'Birds are being forced to fly in 50°C heat searching for food because we took their forests — then we call it a "bird strike" when they hit our planes' },

  // === POPULATION & CONSUMPTION ===
  { id: 'population-root-cause', theme: 'Population is THE root cause of climate crisis — carbon emission = population × per-capita consumption. Everything else (recycling, EVs) is a rounding error' },
  { id: 'one-child-58-tonnes', theme: 'Having one fewer child saves 58.6 tonnes of CO2 per year — more than going car-free, vegan, and flight-free COMBINED. But nobody will tell you this' },
  { id: 'bonded-customers', theme: 'We are bonded customers — corporations and media have turned us into mindless consumers who buy what we don\'t need with money we don\'t have, destroying a planet we can\'t replace' },
  { id: 'earth-overshoot', theme: 'Earth Overshoot Day — humanity currently needs 1.7 Earths. Americans need 10 Earths. A single billionaire needs 20,000 Earths. Where will we find them?' },

  // === BILLIONAIRE ESCAPE & SPACE COLONIZATION ===
  { id: 'mars-escape-plan', theme: 'Billionaires plan to escape to Mars while leaving 800 crore people to burn — space colonization is not progress, it\'s the rich abandoning the crime scene' },
  { id: 'elon-7-kids-hypocrisy', theme: 'Elon Musk has 7+ children and tells the world to breed more — while his companies profit from the same industrial system destroying the planet' },
  { id: 'billionaire-bunkers', theme: 'The ultra-rich are building bunkers and buying islands while funding climate denial — they know what\'s coming, they just don\'t care about you' },

  // === MEDIA & INFORMATION SUPPRESSION ===
  { id: 'media-blackout-climate', theme: 'TV channels spend ZERO minutes daily on climate change — the biggest crisis in human history gets less airtime than celebrity gossip and cricket' },
  { id: 'algorithm-suppression', theme: 'Social media algorithms are suppressing climate content — the same billionaires who cause emissions control what you see on your feed' },
  { id: 'climate-denial-industry', theme: 'Climate denial is an industry funded by the richest people on Earth — the richer someone is, the more likely they call climate change a hoax' },
  { id: 'entertainment-as-sedative', theme: 'Entertainment is a sedative — IPL, reality shows, political drama keep you distracted while the planet burns. You\'re being drugged into ignoring extinction' },

  // === HIDDEN CONSEQUENCES ===
  { id: 'climate-refugees-120cr', theme: '120 crore climate refugees coming — when 1.2 billion people have no water and no food, they will migrate, riot, and trigger wars. No country can absorb this' },
  { id: 'water-wars-coming', theme: 'The next World War will be over water — first two were for colonies, recent ones for oil. The coming one will be for drinking water' },
  { id: 'dormant-viruses-ice', theme: 'Millions of dormant viruses are frozen under melting ice — COVID was just one virus from one cave. Imagine thousands being released as glaciers melt' },
  { id: 'brain-heart-climate', theme: 'Climate change will make you go insane — your brain\'s blood vessels, heart rhythm, and mental health are calibrated to current atmospheric pressure. Change that, and young people drop dead' },
  { id: 'reproductive-crisis', theme: 'Climate change is destroying human fertility — in reptiles, 0.5°C shift changed 90% of offspring to female. Similar temperature-dependent effects are hitting human reproductive health' },
  { id: 'rivers-will-vanish', theme: 'Your rivers will vanish suddenly — glaciers are like a freezer being defrosted. Water flows until the ice is gone, then nothing. Ganga, Yamuna will become dry riverbeds' },
  { id: 'average-vs-extreme', theme: '2°C average hides 8-10°C extremes — average temperature rise of 2°C means peak days at 55-60°C. With humidity, felt temperature hits 15°C above normal' },
  { id: 'low-end-tech-fails', theme: 'Your bike, car, and AC will fail in extreme heat — cheap vehicles explode, ACs can\'t handle 50°C+, power grids collapse. India\'s low-end tech is a death trap' },

  // === SYSTEMIC & CONSCIOUSNESS ===
  { id: 'consumerism-crisis', theme: 'The climate crisis IS a consumption crisis — mass production created a glut, so corporations need you stupid enough to keep buying things you don\'t need' },
  { id: 'iq-declining-engineered', theme: 'Human IQ is measurably declining — the Flynn Effect has reversed. This is engineered: less educated people = easier propaganda targets = bigger consumers = more emissions' },
  { id: 'value-system-catastrophe', theme: 'This is a crisis of values — we worship wealth and condemn wisdom. The person destroying the planet is our role model. Until we fix what we worship, nothing changes' },
  { id: 'recycling-is-a-scam', theme: 'Recycling is corporate guilt-transfer — your 40W bulb and plastic straw are not causing climate change. 30 companies are. But you were told it\'s YOUR fault so you don\'t look at THEM' },
  { id: 'last-generation-to-act', theme: 'We are the last generation that can do anything — our children will inherit a burning planet and curse us for watching entertainment while their future was stolen' },

  // === EXISTING TOPICS (refined) ===
  { id: 'climate-refugees', theme: 'Climate refugees and forced displacement — millions already fleeing, billions to follow, borders will become war zones' },
  { id: 'economic-losses', theme: 'The staggering economic cost of climate change — trillions in losses that nobody reports because it would expose the lie of development' },
  { id: 'extreme-weather-cost', theme: 'Extreme weather events tripling in frequency — floods, heatwaves, cyclones destroying lives while media covers political theater' },
  { id: 'food-security-crisis', theme: 'Global food security is collapsing — major crop yields dropping 15-25% while population grows, creating a hunger catastrophe for the world\'s poorest' },
  { id: 'health-crisis', theme: 'Climate change as a public health emergency — heatstroke deaths, new diseases, mental health collapse, and rising cancer rates all traced to environmental destruction' },
  { id: 'arctic-ice-melt', theme: 'Arctic and Antarctic ice melt triggering irreversible feedback loops — exposed dark rock absorbs more heat, melting more ice, in a death spiral we cannot stop' },
  { id: 'tipping-points', theme: 'We have already crossed multiple climate tipping points — Amazon dieback, Arctic ice loss, permafrost thaw. The feedback loops are now self-sustaining. It\'s already irreversible' },
  { id: 'environmental-racism', theme: 'Environmental racism — polluting factories in poor neighborhoods, mining in indigenous land, toxic waste in the Global South while the Global North profits' },
  { id: 'coral-reef-death', theme: 'Coral reefs — the lungs of the ocean — are dying. Without them, 70% of marine life collapses and coastal communities lose their only food source' },
  { id: 'wildfires-dead-forests', theme: 'Megafires burning worldwide — dry soil releases stored carbon, fires spread across continents, the air you breathe is becoming poison' },
  { id: 'climate-lawsuits', theme: 'Climate lawsuits are the last legal weapon — but corporations have more lawyers than countries have prosecutors. Justice moves slower than extinction' },
  { id: 'renewables-cheaper', theme: 'Renewable energy is already cheaper than fossil fuels — so who is blocking it and why? Follow the money to fossil fuel lobbyists and captured politicians' },
  { id: 'carbon-capture-scam', theme: 'Carbon capture is a scam designed to let fossil fuel companies keep drilling — the machines need energy to run, creating more emissions than they capture' },
  { id: 'soil-degradation', theme: 'Soil degradation and farmland collapse — dry soil releases stored carbon AND catches fire. The ground beneath your feet is turning against you' },
  { id: 'child-labor-supply-chains', theme: 'Child labor in climate-linked supply chains — children mining cobalt for your phone battery while their village floods from your emissions' },
  { id: 'indigenous-land-defenders', theme: 'Indigenous land defenders murdered for protecting forests — killed by corporations and governments while the world scrolls past their deaths' },
  { id: 'women-and-climate', theme: 'Women and girls bear the heaviest burden of climate change — walking further for water, dying in floods, losing education to climate displacement' },
  { id: 'microplastics-in-humans', theme: 'Microplastics found in human blood, lungs, placentas, and brains — we are literally becoming plastic while corporations produce 400 million tonnes more each year' },
  { id: 'ocean-dead-zones', theme: 'Ocean dead zones spreading — oxygen-depleted waters where nothing can survive, growing every year, turning seas into graveyards' },
];
