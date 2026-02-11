import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export interface GraphNode {
  id: string;
  title: string;
  category: string;
  tags: string[];
  val?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
  strength: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function useGraphData() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGraphData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCorrelations();
      // Set node size based on connection count
      const connectionCount: Record<string, number> = {};
      for (const link of data.links || []) {
        connectionCount[link.sourceId] = (connectionCount[link.sourceId] || 0) + 1;
        connectionCount[link.targetId] = (connectionCount[link.targetId] || 0) + 1;
      }

      const nodes = (data.nodes || []).map((n: any) => ({
        ...n,
        val: (connectionCount[n.id] || 0) + 1,
      }));

      const links = (data.links || []).map((l: any) => ({
        source: l.sourceId,
        target: l.targetId,
        label: l.label,
        strength: l.strength,
      }));

      setGraphData({ nodes, links });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  return { graphData, loading, error, refetch: fetchGraphData };
}
