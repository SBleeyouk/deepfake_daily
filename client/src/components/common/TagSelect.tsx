import { useState, useEffect } from 'react';
import { colors } from '../../theme';
import { api } from '../../api/client';

interface TagSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

const DEFAULT_TAGS = [
  'AI-generated', 'Face-swap', 'Voice-clone', 'Legal',
  'Detection', 'Social Media', 'Political', 'Celebrity',
  'Academic', 'Tool/Software',
];

export default function TagSelect({ value, onChange, disabled }: TagSelectProps) {
  const [availableTags, setAvailableTags] = useState<string[]>(DEFAULT_TAGS);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    api.getTags().then((tags) => {
      if (tags.length > 0) {
        const merged = [...new Set([...DEFAULT_TAGS, ...tags])];
        setAvailableTags(merged);
      }
    }).catch(() => {});
  }, []);

  const toggleTag = (tag: string) => {
    if (disabled) return;
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  const addNewTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed || availableTags.includes(trimmed)) {
      setNewTag('');
      return;
    }
    setAvailableTags([...availableTags, trimmed]);
    onChange([...value, trimmed]);
    setNewTag('');
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
        {availableTags.map((tag) => {
          const isSelected = value.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              disabled={disabled}
              onClick={() => toggleTag(tag)}
              style={{
                padding: '5px 12px',
                borderRadius: '14px',
                border: `1px solid ${isSelected ? colors.accentPrimary : colors.border}`,
                background: isSelected ? colors.accentPrimary + '20' : 'transparent',
                color: isSelected ? colors.accentPrimary : colors.textSecondary,
                fontSize: '0.8rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>
      {!disabled && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Add custom tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNewTag())}
            style={{ flex: 1, padding: '6px 12px', fontSize: '0.85rem' }}
          />
          <button
            type="button"
            onClick={addNewTag}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              background: 'transparent',
              color: colors.textSecondary,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            + Add
          </button>
        </div>
      )}
    </div>
  );
}
