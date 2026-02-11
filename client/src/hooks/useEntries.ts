import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export interface Entry {
  id: string;
  title: string;
  category: string;
  tags: string[];
  comments: string;
  attachmentURL: string;
  attachmentFile: string;
  thumbnailURL: string;
  timeAdded: string;
  timeOccurred: string;
  submittedBy: string;
}

export function useEntries(filters?: { category?: string; tag?: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEntries(filters);
      setEntries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters?.category, filters?.tag]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { entries, loading, error, refetch: fetchEntries };
}
