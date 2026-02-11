export interface ResearchEntry {
  id: string;
  title: string;
  category: 'Terminology' | 'Incident' | 'Law/Policy';
  tags: string[];
  comments: string;
  attachmentURL: string;
  attachmentFile: string;
  thumbnailURL: string;
  timeAdded: string;
  timeOccurred: string;
  submittedBy: string;
  correlationData: string;
}

export interface CreateEntryInput {
  title?: string;
  category: 'Terminology' | 'Incident' | 'Law/Policy';
  tags: string[];
  comments?: string;
  attachmentURL?: string;
  attachmentFile?: string;
  thumbnailURL?: string;
  timeOccurred?: string;
  submittedBy: string;
}

export interface UpdateEntryInput {
  title?: string;
  category?: 'Terminology' | 'Incident' | 'Law/Policy';
  tags?: string[];
  comments?: string;
  attachmentURL?: string;
  attachmentFile?: string;
  thumbnailURL?: string;
  timeOccurred?: string;
}

export interface CorrelationLink {
  sourceId: string;
  targetId: string;
  label: string;
  strength: number;
}

export interface GraphData {
  nodes: { id: string; title: string; category: string; tags: string[] }[];
  links: CorrelationLink[];
}
