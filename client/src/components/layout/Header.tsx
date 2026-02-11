import { Link } from 'react-router-dom';
import { colors } from '../../theme';

export default function Header() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      borderBottom: `1px solid ${colors.border}`,
      background: colors.bgPrimary,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexWrap: 'wrap',
      gap: '8px',
    }}>
      <div className="header-brand">
        <Link to="/" style={{ color: colors.textPrimary, fontWeight: 700, fontSize: '1.1rem' }}>
          AIG-Threat Database
        </Link>
      </div>

      <div className="header-actions" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <Link to="/add" style={{
          padding: '8px 16px',
          borderRadius: '6px',
          background: colors.accentPrimary,
          color: colors.bgPrimary,
          fontWeight: 600,
          fontSize: '0.85rem',
          transition: 'background 0.2s',
          whiteSpace: 'nowrap',
        }}>
          Add New Data
        </Link>
        <Link to="/view" style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: `1px solid ${colors.accentPrimary}`,
          color: colors.accentPrimary,
          fontWeight: 600,
          fontSize: '0.85rem',
          transition: 'background 0.2s',
          whiteSpace: 'nowrap',
        }}>
          View Data
        </Link>
      </div>
    </header>
  );
}
