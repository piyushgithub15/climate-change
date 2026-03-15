export interface CaptionStyle {
  id: string;
  name: string;
  purpose: string;
  prompt: string;
}

export const CAPTION_STYLES: CaptionStyle[] = [
  {
    id: 'debate-trigger',
    name: 'The Debate Trigger',
    purpose: 'Spark comments and grow through conversation',
    prompt: `Write a DEBATE TRIGGER caption. Structure:
1. Bold opening line — a provocative, confrontational statement (1 sentence).
2. Short context — 1-2 sentences adding data or framing the tension.
3. Direct question — pose a clear either/or or open question that forces people to pick a side.
4. End with a line like "I want your honest take." or "Drop your answer below." or "Tell me what you think."

Keep it 4-6 lines total. Tone: direct, slightly confrontational, inviting disagreement.

Example structure:
"100 companies are responsible for 71% of global emissions.
Yet the conversation keeps landing on individual choices.

Should we be recycling harder — or holding boardrooms accountable?

I want your honest take."`,
  },
  {
    id: 'you-framing',
    name: 'The "You" Framing',
    purpose: 'Increase relatability and personal connection',
    prompt: `Write a "YOU" FRAMING caption. Structure:
1. Personal impact — list 2-3 ways this directly affects the reader's daily life (use "your/you").
2. Clear implication — 1 sentence connecting it to climate change as the cause.
3. Reflective question — end with a personal question the reader can answer from their own experience.

Keep it 4-6 lines total. Use second person throughout. Make it feel like their problem, not an abstract issue.

Example structure:
"Your grocery bill is up 23% in three years.
Your insurance premiums are climbing.
Your summers are getting longer and more dangerous.

Climate change isn't a future problem — it's already in your budget.

Have you noticed it where you live?"`,
  },
  {
    id: 'save-optimized',
    name: 'The Save-Optimized',
    purpose: 'Drive saves — powerful in educational niches',
    prompt: `Write a SAVE-OPTIMIZED caption. Structure:
1. Summary — 1-2 sentences highlighting the most important data from the post.
2. Future value — explain why this information will matter later (upcoming policy changes, worsening trends, rebranding cycles).
3. Explicit save cue — end with a direct line telling people to save/bookmark this post.

Keep it 3-5 lines total. Tone: informative, urgent, practical. Make the reader feel they'll need this data again.

Example structure:
"5 fossil fuel companies made $200 billion in profit last year.
Their combined climate pledges cover less than 12% of their emissions.

These numbers will age badly for them. Keep this for when they rebrand again."`,
  },
  {
    id: 'opinion-authority',
    name: 'The Opinion Authority',
    purpose: 'Build brand positioning and credibility',
    prompt: `Write an OPINION AUTHORITY caption. Structure:
1. Clear stance — state a position confidently in 1-2 sentences. Challenge a common assumption.
2. Justification — 1-2 sentences backing it with data or logic. Reference "the data shows" or "the numbers don't support."
3. Closing line — calm, firm, final. No question. Just a statement that lands.

Keep it 4-6 lines total. Tone: confident, calm, slightly contrarian. Not angry — authoritative. You're stating facts others won't.

Example structure:
"Net-zero pledges without enforceable timelines aren't commitments.
They're press releases.

The data shows most corporate climate targets are structurally designed to fail.

Calling it ambition doesn't make it real."`,
  },
  {
    id: 'future-projection',
    name: 'The Future Projection',
    purpose: 'Increase engagement through speculation and urgency',
    prompt: `Write a FUTURE PROJECTION caption. Structure:
1. Scenario framing — start with "If" or "At this pace" followed by a current trend and its trajectory.
2. Conditional logic — 1-2 sentences projecting consequences with specific numbers and dates (2030, 2040, 2050).
3. Open-ended question — end with a question about which direction things are heading (reform vs resistance, change vs collapse, stability vs scarcity).

Keep it 4-6 lines total. Tone: analytical, forward-looking, creating urgency without panic.

Example structure:
"If fossil fuel expansion continues at this pace, the burden won't be shared equally.

By 2050, 1.2 billion people could be displaced.

Are we heading toward a managed transition — or a managed collapse?"`,
  },
  {
    id: 'minimal',
    name: 'The Minimal',
    purpose: 'Stop the scroll — clean, direct, provokes curiosity',
    prompt: `Write a MINIMAL caption. Rules:
- Maximum 2-3 SHORT lines. Each line should be its own paragraph.
- No questions, no calls to action, no explanation.
- Just state the most powerful fact or contrast from the post in the fewest possible words.
- The brevity itself should provoke curiosity and force people to look at the slides.

Keep it under 20 words total. Tone: stark, clean, haunting.

Example structures:
"71% of emissions.
100 companies.

That's it. That's the post."

Or:

"They knew.
They profited anyway.

And they still are."

Or:

"The gap is widening.
The clock is ticking.
The boardrooms are silent."`,
  },
  {
    id: 'rage-fuel',
    name: 'The Rage Fuel',
    purpose: 'Maximum outrage — drives shares and angry comments',
    prompt: `Write a RAGE FUEL caption. Structure:
1. Open with the most infuriating contrast or fact — something that makes people's blood boil (1 sentence).
2. Follow up with WHO is responsible — name a corporation, billionaire, or system (1-2 sentences).
3. Then flip it — what YOU are told to do instead (recycle, use metal straws, save water) while they destroy everything.
4. End with a furious line that demands sharing. Something like "If this doesn't make you angry, you're not paying attention." or "Share this. Tag them. Make them answer."

Keep it 5-7 lines total. Tone: FURIOUS, righteous anger, class-conscious. You're speaking for the 99% against the 1%.

Example structure:
"A single billionaire's jet burns more fuel in one weekend than your entire lifetime of car travel.

But YOU were told to carpool.

30 companies produce 71% of global emissions.
But YOU were told to carry a cloth bag.

Stop feeling guilty. Start feeling angry.

Share this. Tag them. Make them answer."`,
  },
  {
    id: 'wake-up-call',
    name: 'The Wake-Up Call',
    purpose: 'Shake passive followers into action — urgency + alarm',
    prompt: `Write a WAKE-UP CALL caption. Structure:
1. Open with a SHOCKING fact the reader probably doesn't know (1 sentence).
2. Explain why NO ONE is talking about this — media blackout, corporate suppression, political convenience (1-2 sentences).
3. Make it PERSONAL — how this will hit the reader's life, family, city, or country within years, not decades (1-2 sentences).
4. End with a line that makes NOT sharing feel like complicity. Something like "Every person who sees this and does nothing is part of the problem." or "Your silence is their shield."

Keep it 5-7 lines total. Tone: alarm, disbelief, like you just found out something horrifying and you're telling your closest friend.

Example structure:
"100 to 1,000 species go extinct every single day.

Not a single TV channel in India spent a minute covering this today. Not one.

By the time your child is 30, they'll live in a world with half the species you grew up with.

Your silence is their shield. Share this."`,
  },
  {
    id: 'india-direct',
    name: 'The India Direct',
    purpose: 'Hyper-targeted for Indian audience — drives comments and saves',
    prompt: `Write an INDIA DIRECT caption. Structure:
1. Open with an India-specific stat or fact that hits home — name Indian cities, states, or realities (1 sentence). Use crores, not millions.
2. Connect it to the global system — how the West/billionaires/corporations caused this while India pays the price (1-2 sentences).
3. Make it about the reader's daily life in India — their water, their food, their city, their children's future (1 sentence).
4. End with a provocative question or call to share — something that an Indian reader MUST respond to.

Keep it 5-7 lines total. Tone: patriotic anger, protective fury. You're an Indian who is tired of India being exploited.

Example structure:
"30 Indian cities will run out of drinking water in the next 10 years. Jaipur, Indore, Srinagar — your city might be next.

The US emits 15x more CO2 per person than India. But WE get the floods, the heatwaves, and the droughts.

Your kids will pay for their pollution with their lives.

Tag someone who needs to see this."`,
  },
];

const ARCHETYPE_CAPTION_MAP: Record<string, string[]> = {
  'brutal-stat': ['rage-fuel', 'minimal', 'wake-up-call'],
  'this-affects-you': ['you-framing', 'india-direct', 'wake-up-call'],
  'myth-vs-reality': ['rage-fuel', 'opinion-authority', 'debate-trigger'],
  'inequality-contrast': ['rage-fuel', 'india-direct', 'debate-trigger'],
  'timeline': ['future-projection', 'wake-up-call', 'minimal'],
  'if-nothing-changes': ['wake-up-call', 'rage-fuel', 'minimal'],
  'explainer-stack': ['save-optimized', 'wake-up-call', 'opinion-authority'],
  'localized-impact': ['india-direct', 'rage-fuel', 'wake-up-call'],
  'policy-breakdown': ['rage-fuel', 'opinion-authority', 'debate-trigger'],
  'the-indictment': ['rage-fuel', 'wake-up-call', 'minimal'],
  'uncomfortable-truth': ['wake-up-call', 'rage-fuel', 'opinion-authority'],
  'india-on-fire': ['india-direct', 'rage-fuel', 'wake-up-call'],
  'system-vs-you': ['rage-fuel', 'debate-trigger', 'india-direct'],
  'philosophical': ['wake-up-call', 'opinion-authority', 'debate-trigger'],
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
