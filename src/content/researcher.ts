import OpenAI from 'openai';
import { tavily } from '@tavily/core';
import { config } from '../config';
import { ContentArchetype } from './archetypes';

export interface ResearchFact {
  id: string;
  claim: string;
  value: string;
  source: string;
  sourceUrl: string;
  year: number;
  category: 'statistic' | 'corporate' | 'human-cost' | 'comparison' | 'projection' | 'policy' | 'historical';
  confidence: number;
  origin: 'tavily' | 'perplexity' | 'both';
}

const AUTHORITATIVE_DOMAINS = [
  'ipcc.ch',
  'iea.org',
  'unep.org',
  'nature.com',
  'science.org',
  'carbonbrief.org',
  'globalcarbonproject.org',
  'worldbank.org',
  'climateactiontracker.org',
  'who.int',
  'un.org',
  'reuters.com',
  'bbc.com',
  'theguardian.com',
  'scientificamerican.com',
  'wri.org',
  'ourworldindata.org',
];

let perplexityClient: OpenAI | null = null;

function getPerplexityClient(): OpenAI {
  if (!perplexityClient) {
    if (!config.perplexityApiKey) {
      throw new Error('PERPLEXITY_API_KEY is not set in .env');
    }
    perplexityClient = new OpenAI({
      apiKey: config.perplexityApiKey,
      baseURL: 'https://api.perplexity.ai',
    });
  }
  return perplexityClient;
}

function getOpenAIClient(): OpenAI {
  if (!config.openaiApiKey) {
    throw new Error('OPENAI_API_KEY is not set in .env');
  }
  return new OpenAI({ apiKey: config.openaiApiKey });
}

function getTavilyClient() {
  if (!config.tavilyApiKey) {
    throw new Error('TAVILY_API_KEY is not set in .env');
  }
  return tavily({ apiKey: config.tavilyApiKey });
}

const DEFAULT_RESEARCH_DIRECTIVE = `Find:
1. The most recent statistics and data points with exact numbers and sources
2. Specific companies, people, or organizations involved
3. Key comparisons or contrasts that would be visually compelling
4. Source names and years for every fact`;

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

async function searchWithTavily(
  subject: string,
  directive: string
): Promise<TavilyResult[]> {
  const client = getTavilyClient();
  const currentYear = new Date().getFullYear();

  const query = `${subject} latest data statistics ${currentYear}`;

  const response = await client.search(query, {
    searchDepth: 'advanced',
    maxResults: 10,
    includeDomains: AUTHORITATIVE_DOMAINS,
    timeRange: 'year',
    includeAnswer: false,
  });

  console.log(`[researcher] Tavily returned ${response.results.length} results from authoritative sources`);
  return response.results;
}

interface PerplexityResult {
  content: string;
  citations: string[];
}

async function supplementWithPerplexity(
  subject: string,
  directive: string,
  tavilyContext: string
): Promise<PerplexityResult> {
  const client = getPerplexityClient();
  const currentYear = new Date().getFullYear();

  const response = await client.chat.completions.create({
    model: 'sonar-reasoning-pro',
    messages: [
      {
        role: 'system',
        content: `You are a climate research assistant specializing in investigative data — corporate evidence, court cases, leaked documents, internal memos, and financial records. Provide specific names, dates, dollar amounts, and document references. Focus on ${currentYear} and ${currentYear - 1} data. Always cite your sources with numbered references [1], [2], etc.`,
      },
      {
        role: 'user',
        content: `Topic: "${subject}"

We already have authoritative data from academic and institutional sources. Now we need INVESTIGATIVE supplementary data.

${directive}

Existing research context (do not repeat these facts, find NEW ones):
${tavilyContext.slice(0, 800)}...

Provide specific corporate evidence, court filings, leaked documents, whistleblower reports, or financial data not found in academic sources. Real names, real numbers, real documents. Use numbered citations [1], [2] etc.`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty response from Perplexity');

  const citations: string[] = (response as any).citations ?? [];

  console.log(`[researcher] Perplexity (sonar-reasoning-pro): ${content.length} chars, ${citations.length} citations`);
  return { content, citations };
}

export async function parseResearchIntoFacts(
  rawResearch: string,
  origin: 'tavily' | 'perplexity' = 'tavily'
): Promise<ResearchFact[]> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You extract individual facts from research text into structured JSON.
Rules:
- Each fact must have a specific number, percentage, or quantifiable claim
- Each fact must have a source name and year — look for citations, report names, or URLs in the text
- If a claim has no identifiable source, set source to "unverified"
- Discard vague claims without specific numbers
- Set sourceUrl to the URL if one is associated with the snippet, otherwise ""
- Categorize each fact: statistic, corporate, human-cost, comparison, projection, policy, or historical
- Rate each fact's confidence from 1-10:
  10 = exact number from a named report with year (e.g. "IPCC AR6 2023: 1.1°C warming")
  8 = specific number with a named source but no report name
  6 = number attributed to a general organization (e.g. "according to the UN")
  4 = number with vague attribution (e.g. "studies show", "researchers found")
  2 = number with no clear source
- Extract at most 20 facts, prioritizing the most specific and well-sourced ones
Return ONLY a JSON array, no markdown fences.`,
      },
      {
        role: 'user',
        content: `Extract all quantifiable facts from this research:

${rawResearch}

Return JSON array:
[{"claim":"...","value":"...","source":"...","sourceUrl":"...","year":2025,"category":"statistic","confidence":8}]`,
      },
    ],
    temperature: 0.1,
    max_tokens: 3000,
  });

  const raw = response.choices[0]?.message?.content?.trim();
  if (!raw) return [];

  let parsed: Omit<ResearchFact, 'id' | 'origin'>[];
  try {
    parsed = JSON.parse(raw);
  } catch {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      console.warn('[researcher] Failed to parse fact extraction response');
      return [];
    }
  }

  const verified = parsed
    .filter(f => f.source !== 'unverified' && f.value && f.claim && (f.confidence ?? 0) >= 4)
    .map((f, i) => ({
      ...f,
      id: `F${i + 1}`,
      confidence: f.confidence ?? 5,
      origin,
    }));

  console.log(`[researcher] Extracted ${verified.length} facts from ${origin} (filtered from ${parsed.length}, min confidence: 4)`);
  return verified;
}

function crossValidateAndMerge(
  tavilyFacts: ResearchFact[],
  perplexityFacts: ResearchFact[]
): ResearchFact[] {
  const merged: ResearchFact[] = [...tavilyFacts];
  let corroborated = 0;

  for (const pFact of perplexityFacts) {
    const match = tavilyFacts.find(tFact => {
      const valueOverlap = tFact.value === pFact.value
        || tFact.value.includes(pFact.value)
        || pFact.value.includes(tFact.value);
      const claimSimilar = tFact.claim.toLowerCase().includes(pFact.claim.toLowerCase().slice(0, 30))
        || pFact.claim.toLowerCase().includes(tFact.claim.toLowerCase().slice(0, 30));
      return valueOverlap || claimSimilar;
    });

    if (match) {
      match.confidence = Math.min(10, match.confidence + 2);
      match.origin = 'both';
      if (!match.sourceUrl && pFact.sourceUrl) {
        match.sourceUrl = pFact.sourceUrl;
      }
      corroborated++;
    } else {
      merged.push(pFact);
    }
  }

  console.log(`[researcher] Cross-validation: ${corroborated} facts corroborated across both sources`);

  merged.sort((a, b) => b.confidence - a.confidence);

  return merged.map((f, i) => ({ ...f, id: `F${i + 1}` }));
}

export async function researchTopic(
  subject: string,
  archetype: ContentArchetype
): Promise<ResearchFact[]> {
  const directive = archetype.researchDirective || DEFAULT_RESEARCH_DIRECTIVE;
  const method = archetype.researchMethod || 'tavily';

  console.log(`[researcher] Researching "${subject}" | Method: ${method}`);

  const tavilyResults = await searchWithTavily(subject, directive);

  const tavilyContext = tavilyResults
    .map((r, i) => `[Source ${i + 1}: ${r.title}] (${r.url})\n${r.content}`)
    .join('\n\n');

  const tavilyFacts = await parseResearchIntoFacts(tavilyContext, 'tavily');

  for (const fact of tavilyFacts) {
    if (!fact.sourceUrl) {
      const matchingResult = tavilyResults.find(r =>
        r.content.includes(fact.value) || r.title.toLowerCase().includes(fact.source.toLowerCase())
      );
      if (matchingResult) {
        fact.sourceUrl = matchingResult.url;
      }
    }
  }

  if (method === 'both' && config.perplexityApiKey) {
    try {
      const { content: pxContent, citations } = await supplementWithPerplexity(subject, directive, tavilyContext);

      const citationAnnotated = citations.length > 0
        ? `${pxContent}\n\n=== CITATION URLS ===\n${citations.map((url, i) => `[${i + 1}] ${url}`).join('\n')}`
        : pxContent;

      const perplexityFacts = await parseResearchIntoFacts(citationAnnotated, 'perplexity');

      for (const fact of perplexityFacts) {
        if (!fact.sourceUrl && citations.length > 0) {
          const refMatch = pxContent.match(new RegExp(`${fact.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\n]*\\[(\\d+)\\]`));
          if (refMatch) {
            const citIndex = parseInt(refMatch[1], 10) - 1;
            if (citations[citIndex]) {
              fact.sourceUrl = citations[citIndex];
            }
          }
        }
      }

      const merged = crossValidateAndMerge(tavilyFacts, perplexityFacts);
      console.log(`[researcher] Research complete: ${merged.length} facts (${merged.filter(f => f.origin === 'both').length} corroborated) for "${subject}"`);
      return merged;
    } catch (err: any) {
      console.warn(`[researcher] Perplexity supplement failed (${err.message}), continuing with Tavily data only`);
    }
  }

  console.log(`[researcher] Research complete: ${tavilyFacts.length} verified facts for "${subject}"`);
  return tavilyFacts;
}
