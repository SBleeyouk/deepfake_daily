import { colors } from '../../theme';

export default function Footer() {
  return (
    <footer style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 24px',
      borderTop: `1px solid ${colors.border}`,
      background: colors.bgSecondary,
      fontSize: '0.8rem',
      color: colors.textMuted,
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '4px',
          background: colors.bgTertiary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.6rem',
          color: colors.textSecondary,
        }}>
          LOGO
        </div>
        <span>Research Center</span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <span>Contact: research@example.edu</span>
      </div>

      <div style={{ textAlign: 'right' }}>
        <span>All rights reserved. Data for research purposes only.</span>
      </div>
    </footer>
  );
}
