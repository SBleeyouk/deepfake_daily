import { useState } from 'react';
import { colors, categoryColors } from '../../theme';
import { api } from '../../api/client';
import Button from '../common/Button';
import CategorySelect from '../common/CategorySelect';
import TagSelect from '../common/TagSelect';
import toast from 'react-hot-toast';
import type { Entry } from '../../hooks/useEntries';

interface DetailPanelProps {
  entry: Entry | null;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function DetailPanel({ entry, onClose, onUpdate }: DetailPanelProps) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Entry>>({});
  const [saving, setSaving] = useState(false);

  if (!entry) return null;

  const startEdit = () => {
    setEditData({ ...entry });
    setEditing(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await api.updateEntry(entry.id, {
        title: editData.title,
        category: editData.category,
        tags: editData.tags,
        comments: editData.comments,
        attachmentURL: editData.attachmentURL,
        thumbnailURL: editData.thumbnailURL,
        timeOccurred: editData.timeOccurred,
      });
      toast.success('Entry updated');
      setEditing(false);
      onUpdate?.();
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const catColor = categoryColors[entry.category] || colors.accentPrimary;

  const labelStyle = {
    fontSize: '0.75rem',
    color: colors.textMuted,
    marginBottom: '4px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  };

  const sectionStyle = { marginBottom: '20px' };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '420px',
      maxWidth: '100vw',
      height: '100vh',
      background: colors.bgSecondary,
      borderLeft: `1px solid ${colors.border}`,
      zIndex: 150,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontWeight: 600 }}>Entry Detail</span>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: colors.textSecondary,
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          X
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        <div style={sectionStyle}>
          <div style={labelStyle}>Headline</div>
          {editing ? (
            <input
              value={editData.title || ''}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              style={{ width: '100%' }}
            />
          ) : (
            <h3 style={{ fontSize: '1.1rem', lineHeight: 1.4 }}>{entry.title || 'Untitled'}</h3>
          )}
        </div>

        <div style={sectionStyle}>
          <div style={labelStyle}>Category</div>
          {editing ? (
            <CategorySelect
              value={editData.category || ''}
              onChange={(v) => setEditData({ ...editData, category: v })}
            />
          ) : (
            <span style={{
              padding: '4px 12px',
              borderRadius: '14px',
              background: catColor + '20',
              color: catColor,
              fontSize: '0.85rem',
              fontWeight: 600,
            }}>
              {entry.category}
            </span>
          )}
        </div>

        <div style={sectionStyle}>
          <div style={labelStyle}>Tags</div>
          {editing ? (
            <TagSelect
              value={editData.tags || []}
              onChange={(v) => setEditData({ ...editData, tags: v })}
            />
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {entry.tags.map((tag) => (
                <span key={tag} style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: colors.bgTertiary,
                  color: colors.textSecondary,
                  fontSize: '0.8rem',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {(entry.comments || editing) && (
          <div style={sectionStyle}>
            <div style={labelStyle}>Comments & Thoughts</div>
            {editing ? (
              <textarea
                value={editData.comments || ''}
                onChange={(e) => setEditData({ ...editData, comments: e.target.value })}
                rows={4}
                style={{ width: '100%', resize: 'vertical' }}
              />
            ) : (
              <p style={{ color: colors.textSecondary, fontSize: '0.9rem', lineHeight: 1.6 }}>
                {entry.comments}
              </p>
            )}
          </div>
        )}

        {(entry.attachmentURL || editing) && (
          <div style={sectionStyle}>
            <div style={labelStyle}>Attachment</div>
            {editing ? (
              <input
                value={editData.attachmentURL || ''}
                onChange={(e) => setEditData({ ...editData, attachmentURL: e.target.value })}
                style={{ width: '100%' }}
              />
            ) : (
              <a
                href={entry.attachmentURL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}
              >
                {entry.attachmentURL}
              </a>
            )}
          </div>
        )}

        {entry.thumbnailURL && !editing && (
          <div style={sectionStyle}>
            <div style={labelStyle}>Thumbnail</div>
            <img
              src={entry.thumbnailURL}
              alt=""
              style={{ maxWidth: '100%', borderRadius: '8px', border: `1px solid ${colors.border}` }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <div style={labelStyle}>Time Added</div>
            <span style={{ color: colors.textSecondary, fontSize: '0.85rem' }}>
              {entry.timeAdded ? new Date(entry.timeAdded).toLocaleString() : '-'}
            </span>
          </div>
          {entry.timeOccurred && (
            <div>
              <div style={labelStyle}>Time Occurred</div>
              {editing ? (
                <input
                  type="date"
                  value={editData.timeOccurred || ''}
                  onChange={(e) => setEditData({ ...editData, timeOccurred: e.target.value })}
                />
              ) : (
                <span style={{ color: colors.textSecondary, fontSize: '0.85rem' }}>
                  {new Date(entry.timeOccurred).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>

        {entry.submittedBy && (
          <div style={{ ...sectionStyle, marginTop: '20px' }}>
            <div style={labelStyle}>Submitted By</div>
            <span style={{ color: colors.textSecondary, fontSize: '0.85rem' }}>{entry.submittedBy}</span>
          </div>
        )}
      </div>

      <div style={{
        padding: '16px 20px',
        borderTop: `1px solid ${colors.border}`,
      }}>
        {editing ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="outline" onClick={() => setEditing(false)} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={saving} style={{ flex: 1 }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={startEdit} style={{ width: '100%' }}>
            Edit Data
          </Button>
        )}
      </div>
    </div>
  );
}
