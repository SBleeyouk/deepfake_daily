import { colors } from '../../theme';
import type { Entry } from '../../hooks/useEntries';
import FeedCard from './FeedCard';

interface FeedViewProps {
  entries: Entry[];
  loading: boolean;
  onSelect: (entry: Entry) => void;
}

export default function FeedView({ entries, loading, onSelect }: FeedViewProps) {
  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: colors.textMuted }}>
        Loading entries...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: colors.textMuted }}>
        No entries found. Add some data to get started.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {entries.map((entry) => (
        <FeedCard key={entry.id} entry={entry} onClick={() => onSelect(entry)} />
      ))}
    </div>
  );
}
