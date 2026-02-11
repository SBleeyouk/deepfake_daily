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
      <div className="header-brand" style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 700,
        marginBottom: '16px',
        lineHeight: 1.2,
      }}>
        Collect Together<br></br>Together Prevent
      </div>

      <p style={{
        color: colors.textSecondary,
        maxWidth: '600px',
        marginBottom: '24px',
        lineHeight: 1.7,
      }}>
          This is a collaborative database tracking AI-generated threats - deepfakes, misinformation, AI scam, etc - related incidents, terminology, policy developments, and research papers.
          <br></br>Upload data, discover patterns, and visualize how AI-generated text, images, video, and voice are being weaponized for harm at large scale.
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
