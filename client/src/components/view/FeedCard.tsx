import { colors, categoryColors } from '../../theme';
import type { Entry } from '../../hooks/useEntries';

interface FeedCardProps {
  entry: Entry;
  onClick: () => void;
}

export default function FeedCard({ entry, onClick }: FeedCardProps) {
  const catColor = categoryColors[entry.category] || colors.accentPrimary;

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        gap: '16px',
        padding: '16px',
        background: colors.bgSecondary,
        border: `1px solid ${colors.border}`,
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.borderLight)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.border)}
    >
      {entry.thumbnailURL && (
        <img
          src={entry.thumbnailURL}
          alt=""
          style={{
            width: '80px',
            height: '60px',
            objectFit: 'cover',
            borderRadius: '6px',
            flexShrink: 0,
          }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: '0.95rem',
          marginBottom: '6px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {entry.title || 'Untitled'}
        </h4>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            padding: '2px 8px',
            borderRadius: '10px',
            background: catColor + '20',
            color: catColor,
            fontSize: '0.7rem',
            fontWeight: 600,
          }}>
            {entry.category}
          </span>

          {entry.tags.slice(0, 3).map((tag) => (
            <span key={tag} style={{
              padding: '2px 8px',
              borderRadius: '10px',
              background: colors.bgTertiary,
              color: colors.textMuted,
              fontSize: '0.7rem',
            }}>
              {tag}
            </span>
          ))}
          {entry.tags.length > 3 && (
            <span style={{ color: colors.textMuted, fontSize: '0.7rem' }}>
              +{entry.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      <div style={{
        textAlign: 'right',
        fontSize: '0.75rem',
        color: colors.textMuted,
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}>
        {entry.timeAdded ? new Date(entry.timeAdded).toLocaleDateString() : ''}
      </div>
    </div>
  );
}
