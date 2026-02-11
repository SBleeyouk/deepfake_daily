import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../theme';
import { api } from '../../api/client';
import Button from '../common/Button';
import CategorySelect from '../common/CategorySelect';
import TagSelect from '../common/TagSelect';
import ConfirmModal from './ConfirmModal';
import toast from 'react-hot-toast';

export default function EntryForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [attachmentURL, setAttachmentURL] = useState('');
  const [thumbnailURL, setThumbnailURL] = useState('');
  const [timeOccurred, setTimeOccurred] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generatingHeadline, setGeneratingHeadline] = useState(false);
  const [extractingThumb, setExtractingThumb] = useState(false);

  const isValid = category && tags.length > 0;

  const handleGenerateHeadline = async () => {
    setGeneratingHeadline(true);
    try {
      const { headline } = await api.generateHeadline({ comments, attachmentURL, category, tags });
      setTitle(headline);
      toast.success('Headline generated');
    } catch {
      toast.error('Failed to generate headline');
    } finally {
      setGeneratingHeadline(false);
    }
  };

  const handleURLBlur = useCallback(async () => {
    if (!attachmentURL || thumbnailURL) return;
    setExtractingThumb(true);
    try {
      const { thumbnailUrl } = await api.extractThumbnail(attachmentURL);
      if (thumbnailUrl) {
        setThumbnailURL(thumbnailUrl);
      }
    } catch {}
    setExtractingThumb(false);
  }, [attachmentURL, thumbnailURL]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await api.uploadFile(file);
      setAttachmentURL(url);
      toast.success('File uploaded');
    } catch {
      toast.error('Upload failed');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.createEntry({
        title: title || undefined,
        category,
        tags,
        comments: comments || undefined,
        attachmentURL: attachmentURL || undefined,
        thumbnailURL: thumbnailURL || undefined,
        timeOccurred: timeOccurred || undefined,
      });
      toast.success('Entry submitted successfully');
      navigate('/view');
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  const fieldStyle = { marginBottom: '24px' };
  const labelStyle = {
    display: 'block' as const,
    marginBottom: '6px',
    fontSize: '0.85rem',
    fontWeight: 600 as const,
    color: colors.textSecondary,
  };
  const optionalStyle = { color: colors.textMuted, fontWeight: 400 as const };

  return (
    <div style={{
      maxWidth: '680px',
      margin: '0 auto',
      padding: '32px 24px',
    }}>
      <h2 style={{ marginBottom: '32px', fontSize: '1.5rem' }}>Add New Data</h2>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Summary Headline <span style={optionalStyle}>(optional - AI generates if empty)</span>
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Enter headline or leave empty for AI generation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button
            variant="outline"
            onClick={handleGenerateHeadline}
            disabled={generatingHeadline || (!comments && !attachmentURL)}
            style={{ fontSize: '0.8rem', padding: '8px 12px', whiteSpace: 'nowrap' }}
          >
            {generatingHeadline ? 'Generating...' : 'AI Generate'}
          </Button>
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Category <span style={{ color: colors.accentIncident }}>*</span></label>
        <CategorySelect value={category} onChange={setCategory} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Tags <span style={{ color: colors.accentIncident }}>*</span></label>
        <TagSelect value={tags} onChange={setTags} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Comments & Thoughts <span style={optionalStyle}>(optional)</span></label>
        <textarea
          placeholder="Your observations, notes, or analysis..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Attachment <span style={optionalStyle}>(URL or file)</span></label>
        <input
          type="url"
          placeholder="Paste URL here (news article, YouTube, paper...)"
          value={attachmentURL}
          onChange={(e) => setAttachmentURL(e.target.value)}
          onBlur={handleURLBlur}
          style={{ width: '100%', marginBottom: '8px' }}
        />
        <label style={{
          display: 'inline-block',
          padding: '8px 14px',
          borderRadius: '8px',
          border: `1px solid ${colors.border}`,
          color: colors.textSecondary,
          fontSize: '0.85rem',
          cursor: 'pointer',
        }}>
          Or upload file
          <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
        </label>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Thumbnail <span style={optionalStyle}>(auto-extracted from URL)</span>
        </label>
        {extractingThumb && <p style={{ color: colors.textMuted, fontSize: '0.85rem' }}>Extracting thumbnail...</p>}
        {thumbnailURL ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={thumbnailURL}
              alt="Thumbnail"
              style={{ maxWidth: '200px', borderRadius: '8px', border: `1px solid ${colors.border}` }}
            />
            <button
              type="button"
              onClick={() => setThumbnailURL('')}
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontSize: '0.7rem',
              }}
            >
              X
            </button>
          </div>
        ) : (
          <input
            type="url"
            placeholder="Or paste thumbnail URL manually"
            value={thumbnailURL}
            onChange={(e) => setThumbnailURL(e.target.value)}
            style={{ width: '100%' }}
          />
        )}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Time Occurred <span style={optionalStyle}>(optional)</span></label>
        <input
          type="date"
          value={timeOccurred}
          onChange={(e) => setTimeOccurred(e.target.value)}
        />
      </div>

      <Button
        onClick={() => setShowConfirm(true)}
        disabled={!isValid || submitting}
        style={{ width: '100%', padding: '14px' }}
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </Button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
}
