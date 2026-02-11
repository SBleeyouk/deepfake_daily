export const colors = {
  bgPrimary: '#0A0A0A',
  bgSecondary: '#141414',
  bgTertiary: '#1E1E1E',

  textPrimary: '#F5F5F5',
  textSecondary: '#A0A0A0',
  textMuted: '#666666',

  accentTerminology: '#6C5CE7',
  accentIncident: '#FECA57',
  accentLawPolicy: '#00B894',
  accentTechResearch: '#0984E3',
  accentArtwork: '#FD79A8',
  accentOther: '#E17055',

  accentPrimary: '#FFFFFF',
  accentHover: '#D4D4D4',
  accentWarning: '#FECA57',

  graphNode: '#4ECDC4',
  graphLink: '#333333',
  graphHighlight: '#FF6B6B',

  border: '#2A2A2A',
  borderLight: '#333333',
};

export const categoryColors: Record<string, string> = {
  Terminology: colors.accentTerminology,
  Incident: colors.accentIncident,
  'Law/Policy': colors.accentLawPolicy,
  'Tech Research': colors.accentTechResearch,
  Artwork: colors.accentArtwork,
  Other: colors.accentOther,
};
