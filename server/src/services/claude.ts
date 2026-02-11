import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';
import type { ResearchEntry, CorrelationLink } from '../types/index.js';

const client = new Anthropic({ apiKey: config.anthropicApiKey });

export async function generateHeadline(data: {
  comments?: string;
  attachmentURL?: string;
  category: string;
  tags: string[];
}): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: `Generate a concise summary headline (max 15 words) for a research log entry about deepfakes.

Category: ${data.category}
Tags: ${data.tags.join(', ')}
${data.comments ? `Notes: ${data.comments}` : ''}
${data.attachmentURL ? `Source URL: ${data.attachmentURL}` : ''}

Return ONLY the headline text, nothing else.`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === 'text' ? block.text.trim() : 'Untitled Entry';
}

export async function analyzeCorrelations(entries: ResearchEntry[]): Promise<CorrelationLink[]> {
  if (entries.length < 2) return [];

  const entrySummaries = entries
    .map(
      (e, i) =>
        `[${i}] ID: ${e.id} | Title: ${e.title} | Category: ${e.category} | Tags: ${e.tags.join(', ')} | Comments: ${e.comments || 'none'}`
    )
    .join('\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are analyzing a research database about deepfakes. Each entry has an ID, headline, category, tags, and comments. Identify pairs of entries that are thematically connected.

Return ONLY a JSON array of objects with these fields:
- sourceId (string): the Notion page ID of source entry
- targetId (string): the Notion page ID of target entry
- label (string): brief description of connection (3-6 words)
- strength (number): 0.0 to 1.0

Only include connections with strength >= 0.3. Be selective — focus on meaningful thematic connections, not just shared categories.

Entries:
${entrySummaries}

Return ONLY the JSON array, no markdown fences or extra text.`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== 'text') return [];

  try {
    const links: CorrelationLink[] = JSON.parse(block.text);
    return links.filter((l) => l.strength >= 0.3);
  } catch {
    console.error('Failed to parse correlation response:', block.text);
    return [];
  }
}
