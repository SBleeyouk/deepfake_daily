import { colors, categoryColors } from '../../theme';

const CATEGORIES = ['Terminology', 'Incident', 'Law/Policy', 'Tech Research', 'Artwork', 'Other'] as const;

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function CategorySelect({ value, onChange, disabled }: CategorySelectProps) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {CATEGORIES.map((cat) => {
        const isSelected = value === cat;
        const catColor = categoryColors[cat];
        return (
          <button
            key={cat}
            type="button"
            disabled={disabled}
            onClick={() => onChange(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: `1px solid ${isSelected ? catColor : colors.border}`,
              background: isSelected ? catColor + '20' : 'transparent',
              color: isSelected ? catColor : colors.textSecondary,
              fontWeight: isSelected ? 600 : 400,
              fontSize: '0.85rem',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
