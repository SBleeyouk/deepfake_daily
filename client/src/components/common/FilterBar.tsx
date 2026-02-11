import { colors, categoryColors } from '../../theme';

const CATEGORIES = ['Terminology', 'Incident', 'Law/Policy', 'Tech Research', 'Artwork', 'Other'] as const;

interface FilterBarProps {
  categoryFilter: string;
  tagFilter: string;
  availableTags: string[];
  onCategoryChange: (cat: string) => void;
  onTagChange: (tag: string) => void;
}

export default function FilterBar({ categoryFilter, tagFilter, availableTags, onCategoryChange, onTagChange }: FilterBarProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      padding: '12px 0',
      flexWrap: 'wrap',
      alignItems: 'center',
    }}>
      <span style={{ fontSize: '0.8rem', color: colors.textMuted }}>Filter:</span>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onCategoryChange('')}
          style={{
            padding: '4px 12px',
            borderRadius: '14px',
            border: `1px solid ${!categoryFilter ? colors.accentPrimary : colors.border}`,
            background: !categoryFilter ? colors.accentPrimary + '20' : 'transparent',
            color: !categoryFilter ? colors.accentPrimary : colors.textSecondary,
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(categoryFilter === cat ? '' : cat)}
            style={{
              padding: '4px 12px',
              borderRadius: '14px',
              border: `1px solid ${categoryFilter === cat ? categoryColors[cat] : colors.border}`,
              background: categoryFilter === cat ? categoryColors[cat] + '20' : 'transparent',
              color: categoryFilter === cat ? categoryColors[cat] : colors.textSecondary,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ width: '1px', height: '20px', background: colors.border }} />

      <select
        value={tagFilter}
        onChange={(e) => onTagChange(e.target.value)}
        style={{
          padding: '4px 10px',
          borderRadius: '8px',
          fontSize: '0.8rem',
          background: colors.bgTertiary,
          border: `1px solid ${colors.border}`,
          color: colors.textSecondary,
        }}
      >
        <option value="">All Tags</option>
        {availableTags.map((tag) => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>

      {(categoryFilter || tagFilter) && (
        <button
          onClick={() => { onCategoryChange(''); onTagChange(''); }}
          style={{
            padding: '4px 10px',
            borderRadius: '8px',
            border: 'none',
            background: colors.bgTertiary,
            color: colors.textMuted,
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
