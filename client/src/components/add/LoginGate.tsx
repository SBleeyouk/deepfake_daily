import { useState } from 'react';
import type { ReactNode } from 'react';
import { colors } from '../../theme';
import Button from '../common/Button';

interface LoginGateProps {
  isAuthenticated: boolean;
  onLogin: (email: string) => Promise<void>;
  children: ReactNode;
}

export default function LoginGate({ isAuthenticated, onLogin, children }: LoginGateProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <>{children}</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 140px)',
      padding: '24px',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: colors.bgSecondary,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
      }}>
        <h2 style={{ marginBottom: '8px', fontSize: '1.4rem' }}>Login Required</h2>
        <p style={{ color: colors.textSecondary, fontSize: '0.9rem', marginBottom: '24px' }}>
          Enter your institutional email to access the data submission form.
        </p>

        <input
          type="email"
          placeholder="your.name@domain.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '12px' }}
        />

        {error && (
          <p style={{ color: colors.accentIncident, fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>
        )}

        <Button type="submit" disabled={loading || !email} style={{ width: '100%' }}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
}
