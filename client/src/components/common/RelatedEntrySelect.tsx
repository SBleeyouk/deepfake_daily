import { useState, useEffect, useRef } from 'react';
import { colors, categoryColors } from '../../theme';
import { api } from '../../api/client';

interface EntryOption {
  id: string;
  title: string;
  category: string;
}

interface RelatedEntrySelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export default function RelatedEntrySelect({ value, onChange, disabled }: RelatedEntrySelectProps) {
  const [entries, setEntries] = useState<EntryOption[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    api.getEntries().then((data) => {
      setEntries(data.map((e: any) => ({ id: e.id, title: e.title, category: e.category })));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = entries.filter(
    (e) =>
      !value.includes(e.id) &&
      (e.title.toLowerCase().includes(search.toLowerCase()) ||
       e.category.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedEntries = entries.filter((e) => value.includes(e.id));

  const toggle = (id: string) => {
    if (disabled) return;
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
      setSearch('');
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {/* Selected entries as chips */}
      {selectedEntries.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
          {selectedEntries.map((e) => {
            const catColor = categoryColors[e.category] || colors.accentPrimary;
            return (
              <span
                key={e.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '14px',
                  background: catColor + '20',
                  color: catColor,
                  fontSize: '0.8rem',
                }}
              >
                {e.title.length > 30 ? e.title.substring(0, 30) + '...' : e.title}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => toggle(e.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: catColor,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    x
                  </button>
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* Search input */}
      {!disabled && (
        <input
          type="text"
          placeholder={loading ? 'Loading entries...' : 'Search existing entries to link...'}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          style={{ width: '100%' }}
        />
      )}

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          background: colors.bgTertiary,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          maxHeight: '240px',
          overflowY: 'auto',
          zIndex: 50,
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '12px 14px', color: colors.textMuted, fontSize: '0.85rem' }}>
              {loading ? 'Loading...' : 'No matching entries found'}
            </div>
          ) : (
            filtered.map((e) => {
              const catColor = categoryColors[e.category] || colors.accentPrimary;
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => toggle(e.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 14px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(ev) => (ev.currentTarget.style.background = colors.bgSecondary)}
                  onMouseLeave={(ev) => (ev.currentTarget.style.background = 'transparent')}
                >
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: catColor + '20',
                    color: catColor,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    {e.category}
                  </span>
                  <span style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {e.title || 'Untitled'}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
