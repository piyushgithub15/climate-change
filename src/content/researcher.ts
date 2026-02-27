import OpenAI from 'openai';
import { config } from '../config';

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

export async function researchTopic(theme: string): Promise<string> {
  const client = getPerplexityClient();
  const currentYear = new Date().getFullYear();

  const response = await client.chat.completions.create({
    model: 'sonar',
    messages: [
      {
        role: 'system',
        content: `You are a climate research assistant. Provide factual, data-rich research briefs with specific numbers, company names, and citations. Focus on the most recent data (${currentYear} and ${currentYear - 1}). Always include the source and year for every statistic.`,
      },
      {
        role: 'user',
        content: `Research the latest data, news, and statistics on this climate topic: "${theme}"

Provide:
1. The most recent statistics and data points (with exact numbers and sources)
2. Specific companies, people, or organizations involved
3. Any recent news, reports, or scandals from ${currentYear} or ${currentYear - 1}
4. Key comparisons or contrasts that would be visually compelling
5. Source names and years for every fact

Be specific — real names, real numbers, real sources. No vague claims.`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty response from Perplexity');

  console.log(`[researcher] Gathered ${content.length} chars of research data`);
  return content;
}
