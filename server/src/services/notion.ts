import { Client } from '@notionhq/client';
import { config } from '../config.js';
import type { ResearchEntry, CreateEntryInput, UpdateEntryInput } from '../types/index.js';

const notion = new Client({ auth: config.notionApiKey });
const databaseId = config.notionDatabaseId;
const NOTION_TEXT_LIMIT = 2000;

function toRichTextBlocks(text: string) {
  const blocks = [];
  for (let i = 0; i < text.length; i += NOTION_TEXT_LIMIT) {
    blocks.push({ text: { content: text.slice(i, i + NOTION_TEXT_LIMIT) } });
  }
  return blocks;
}

function fromRichText(richText: any[]): string {
  return (richText || []).map((t: any) => t.plain_text).join('');
}

function parseEntry(page: any): ResearchEntry {
  const props = page.properties;
  return {
    id: page.id,
    title: props.Title?.title?.[0]?.plain_text || '',
    category: props.Category?.select?.name || '',
    tags: (props.Tags?.multi_select || []).map((t: any) => t.name),
    comments: fromRichText(props.Comments?.rich_text),
    attachmentURL: props.AttachmentURL?.url || '',
    attachmentFile: props.AttachmentFile?.files?.[0]?.external?.url || props.AttachmentFile?.files?.[0]?.file?.url || '',
    thumbnailURL: props.ThumbnailURL?.url || '',
    timeAdded: props.TimeAdded?.date?.start || '',
    timeOccurred: props.TimeOccurred?.date?.start || '',
    submittedBy: props.SubmittedBy?.email || props.SubmittedBy?.rich_text?.[0]?.plain_text || '',
    correlationData: props.CorrelationData?.rich_text?.[0]?.plain_text || '',
  };
}

export async function listEntries(filters?: { category?: string; tag?: string }): Promise<ResearchEntry[]> {
  const filterConditions: any[] = [];

  if (filters?.category) {
    filterConditions.push({
      property: 'Category',
      select: { equals: filters.category },
    });
  }
  if (filters?.tag) {
    filterConditions.push({
      property: 'Tags',
      multi_select: { contains: filters.tag },
    });
  }

  let filter: any = undefined;
  if (filterConditions.length === 1) {
    filter = filterConditions[0];
  } else if (filterConditions.length > 1) {
    filter = { and: filterConditions };
  }

  const entries: ResearchEntry[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response: any = await notion.databases.query({
      database_id: databaseId,
      filter,
      sorts: [{ property: 'TimeAdded', direction: 'descending' }],
      start_cursor: cursor,
    });

    for (const page of response.results) {
      entries.push(parseEntry(page));
    }

    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return entries;
}

export async function getEntry(id: string): Promise<ResearchEntry> {
  const page = await notion.pages.retrieve({ page_id: id });
  return parseEntry(page);
}

export async function createEntry(input: CreateEntryInput): Promise<ResearchEntry> {
  const tags = Array.isArray(input.tags) ? input.tags : [];

  const properties: any = {
    Title: {
      title: [{ text: { content: input.title || 'Untitled' } }],
    },
    Category: {
      select: { name: input.category },
    },
    Tags: {
      multi_select: tags.map((t) => ({ name: t })),
    },
    TimeAdded: {
      date: { start: new Date().toISOString() },
    },
  };

  if (input.comments) {
    properties.Comments = { rich_text: toRichTextBlocks(input.comments) };
  }
  if (input.attachmentURL) {
    properties.AttachmentURL = { url: input.attachmentURL };
  }
  if (input.attachmentFile) {
    properties.AttachmentFile = {
      files: [{ name: 'attachment', external: { url: input.attachmentFile } }],
    };
  }
  if (input.thumbnailURL) {
    properties.ThumbnailURL = { url: input.thumbnailURL };
  }
  if (input.timeOccurred) {
    properties.TimeOccurred = { date: { start: input.timeOccurred } };
  }
  if (input.submittedBy) {
    properties.SubmittedBy = {
      rich_text: [{ text: { content: input.submittedBy } }],
    };
  }
  const page = await notion.pages.create({
    parent: { database_id: databaseId },
    properties,
  });

  return parseEntry(page);
}

export async function updateEntry(id: string, input: UpdateEntryInput): Promise<ResearchEntry> {
  const properties: any = {};

  if (input.title !== undefined) {
    properties.Title = {
      title: [{ text: { content: input.title } }],
    };
  }
  if (input.category !== undefined) {
    properties.Category = { select: { name: input.category } };
  }
  if (input.tags !== undefined) {
    properties.Tags = {
      multi_select: input.tags.map((t) => ({ name: t })),
    };
  }
  if (input.comments !== undefined) {
    properties.Comments = {
      rich_text: input.comments ? toRichTextBlocks(input.comments) : [],
    };
  }
  if (input.attachmentURL !== undefined) {
    properties.AttachmentURL = { url: input.attachmentURL || null };
  }
  if (input.thumbnailURL !== undefined) {
    properties.ThumbnailURL = { url: input.thumbnailURL || null };
  }
  if (input.timeOccurred !== undefined) {
    properties.TimeOccurred = input.timeOccurred
      ? { date: { start: input.timeOccurred } }
      : { date: null };
  }
  const page = await notion.pages.update({
    page_id: id,
    properties,
  });

  return parseEntry(page);
}

export async function getAllTags(): Promise<string[]> {
  const db = await notion.databases.retrieve({ database_id: databaseId });
  const tagsProperty = (db as any).properties?.Tags;
  if (tagsProperty?.multi_select?.options) {
    return tagsProperty.multi_select.options.map((o: any) => o.name);
  }
  return [];
}
