import { useNavigate } from 'react-router-dom';
import { colors } from '../../theme';
import Button from '../common/Button';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 140px)',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 700,
        marginBottom: '16px',
        lineHeight: 1.2,
      }}>
        Deepfake Research Log
      </h1>

      <p style={{
        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
        color: colors.textSecondary,
        maxWidth: '600px',
        marginBottom: '40px',
        lineHeight: 1.7,
      }}>
        A collaborative research log for tracking deepfake-related incidents,
        terminology, and policy developments. Upload data, discover correlations,
        and visualize the evolving landscape of synthetic media.
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button onClick={() => navigate('/add')} style={{ padding: '14px 32px', fontSize: '1rem' }}>
          Add New Data
        </Button>
        <Button variant="outline" onClick={() => navigate('/view')} style={{ padding: '14px 32px', fontSize: '1rem' }}>
          View Data
        </Button>
      </div>
    </div>
  );
}
