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
];

const ARCHETYPE_CAPTION_MAP: Record<string, string[]> = {
  'brutal-stat': ['save-optimized', 'minimal', 'debate-trigger'],
  'this-affects-you': ['you-framing', 'debate-trigger', 'you-framing'],
  'myth-vs-reality': ['opinion-authority', 'debate-trigger', 'opinion-authority'],
  'inequality-contrast': ['debate-trigger', 'you-framing', 'opinion-authority'],
  'timeline': ['future-projection', 'save-optimized', 'future-projection'],
  'if-nothing-changes': ['future-projection', 'opinion-authority', 'minimal'],
  'explainer-stack': ['save-optimized', 'minimal', 'save-optimized'],
  'localized-impact': ['you-framing', 'debate-trigger', 'minimal'],
  'policy-breakdown': ['opinion-authority', 'future-projection', 'debate-trigger'],
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
