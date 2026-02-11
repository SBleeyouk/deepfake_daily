import { useAuth } from '../hooks/useAuth';
import LoginGate from '../components/add/LoginGate';
import EntryForm from '../components/add/EntryForm';

export default function AddDataPage() {
  const { isAuthenticated, login, loading } = useAuth();

  if (loading) return null;

  return (
    <LoginGate isAuthenticated={isAuthenticated} onLogin={login}>
      <EntryForm />
    </LoginGate>
  );
}
