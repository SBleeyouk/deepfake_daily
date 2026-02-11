import { useState, useEffect, useMemo } from 'react';
import { api } from '../api/client';
import { useEntries } from '../hooks/useEntries';
import type { Entry } from '../hooks/useEntries';
import { useGraphData } from '../hooks/useGraphData';
import ViewToggle from '../components/view/ViewToggle';
import FilterBar from '../components/common/FilterBar';
import FeedView from '../components/view/FeedView';
import NetworkGraph from '../components/view/NetworkGraph';
import DetailPanel from '../components/view/DetailPanel';

export default function ViewDataPage() {
  const [view, setView] = useState<'network' | 'feed'>('network');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const filters = useMemo(() => ({
    category: categoryFilter || undefined,
    tag: tagFilter || undefined,
  }), [categoryFilter, tagFilter]);

  const { entries, loading: entriesLoading, refetch: refetchEntries } = useEntries(filters);
  const { graphData, loading: graphLoading, refetch: refetchGraph } = useGraphData();

  useEffect(() => {
    api.getTags().then(setAvailableTags).catch(() => {});
  }, []);

  const handleNodeClick = (nodeId: string) => {
    const entry = entries.find((e) => e.id === nodeId);
    if (entry) {
      setSelectedEntry(entry);
    } else {
      api.getEntry(nodeId).then(setSelectedEntry).catch(() => {});
    }
  };

  const handleEntryUpdate = () => {
    refetchEntries();
    refetchGraph();
    if (selectedEntry) {
      api.getEntry(selectedEntry.id).then(setSelectedEntry).catch(() => {});
    }
  };

  // Filter graph data by category/tag on the client side
  const filteredGraphData = useMemo(() => {
    if (!categoryFilter && !tagFilter) return graphData;

    const filteredNodeIds = new Set(
      graphData.nodes
        .filter((n) => {
          if (categoryFilter && n.category !== categoryFilter) return false;
          if (tagFilter && !n.tags.includes(tagFilter)) return false;
          return true;
        })
        .map((n) => n.id)
    );

    return {
      nodes: graphData.nodes.filter((n) => filteredNodeIds.has(n.id)),
      links: graphData.links.filter((l) => {
        const src = typeof l.source === 'object' ? (l.source as any).id : l.source;
        const tgt = typeof l.target === 'object' ? (l.target as any).id : l.target;
        return filteredNodeIds.has(src) && filteredNodeIds.has(tgt);
      }),
    };
  }, [graphData, categoryFilter, tagFilter]);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <h2 style={{ fontSize: '1.3rem' }}>Research Data</h2>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <FilterBar
        categoryFilter={categoryFilter}
        tagFilter={tagFilter}
        availableTags={availableTags}
        onCategoryChange={setCategoryFilter}
        onTagChange={setTagFilter}
      />

      <div style={{ marginTop: '16px' }}>
        {view === 'network' ? (
          <NetworkGraph
            graphData={filteredGraphData}
            loading={graphLoading}
            onNodeClick={handleNodeClick}
          />
        ) : (
          <FeedView
            entries={entries}
            loading={entriesLoading}
            onSelect={setSelectedEntry}
          />
        )}
      </div>

      {selectedEntry && (
        <>
          <div
            onClick={() => setSelectedEntry(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 140,
            }}
          />
          <DetailPanel
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onUpdate={handleEntryUpdate}
          />
        </>
      )}
    </div>
  );
}
