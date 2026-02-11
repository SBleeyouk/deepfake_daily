import { colors } from '../../theme';

interface ViewToggleProps {
  view: 'network' | 'feed';
  onChange: (view: 'network' | 'feed') => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  const btnStyle = (active: boolean) => ({
    padding: '8px 20px',
    borderRadius: '6px',
    border: 'none',
    background: active ? colors.accentPrimary : 'transparent',
    color: active ? colors.bgPrimary : colors.textSecondary,
    fontWeight: active ? 600 : 400,
    fontSize: '0.85rem',
    cursor: 'pointer' as const,
    transition: 'all 0.2s',
  });

  return (
    <div style={{
      display: 'inline-flex',
      background: colors.bgTertiary,
      borderRadius: '8px',
      padding: '3px',
    }}>
      <button style={btnStyle(view === 'network')} onClick={() => onChange('network')}>
        Network Graph
      </button>
      <button style={btnStyle(view === 'feed')} onClick={() => onChange('feed')}>
        Feed View
      </button>
    </div>
  );
}
