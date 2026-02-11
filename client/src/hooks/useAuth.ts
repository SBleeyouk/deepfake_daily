import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export function useAuth() {
  const [email, setEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedEmail = localStorage.getItem('auth_email');
    if (token && storedEmail) {
      setEmail(storedEmail);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (inputEmail: string) => {
    const { token, email: returnedEmail } = await api.login(inputEmail);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_email', returnedEmail);
    setEmail(returnedEmail);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_email');
    setEmail(null);
    setIsAuthenticated(false);
  }, []);

  return { email, isAuthenticated, loading, login, logout };
}
