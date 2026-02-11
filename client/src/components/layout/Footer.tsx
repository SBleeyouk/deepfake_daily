import { colors } from '../../theme';

export default function Footer() {
  return (
    <footer style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 24px',
      background: colors.bgPrimary,
      borderTop: `1px solid ${colors.border}`,
      fontSize: '0.8rem',
      color: colors.textMuted,
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src="logo.png" alt="Logo" style={{ height: '24px' }} />
      </div>

      <div style={{ textAlign: 'right', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
        <span>Contact: sbleeyuk@media.mit.edu</span>
        <span>Thank you for your contribution.</span>
      </div>
    </footer>
  );
}
