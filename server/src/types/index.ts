export interface ResearchEntry {
  id: string;
  title: string;
  category: 'Terminology' | 'Event' | 'Law/Policy' | 'Tech Research' | 'Other' ;
  tags: string[];
  comments: string;
  attachmentURL: string;
  attachmentFile: string;
  thumbnailURL: string;
  timeAdded: string;
  timeOccurred: string;
  submittedBy: string;
  correlationData: string;
  relatedEntries: string[];
}

export interface CreateEntryInput {
  title?: string;
  category: 'Terminology' | 'Event' | 'Law/Policy' | 'Tech Research' | 'Other' ;
  tags: string[];
  comments?: string;
  attachmentURL?: string;
  attachmentFile?: string;
  thumbnailURL?: string;
  timeOccurred?: string;
  submittedBy: string;
  relatedEntries?: string[];
}

export interface UpdateEntryInput {
  title?: string;
  category?: 'Terminology' | 'Event' | 'Law/Policy' | 'Tech Research' | 'Other' ;
  tags?: string[];
  comments?: string;
  attachmentURL?: string;
  attachmentFile?: string;
  thumbnailURL?: string;
  timeOccurred?: string;
  relatedEntries?: string[];
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
