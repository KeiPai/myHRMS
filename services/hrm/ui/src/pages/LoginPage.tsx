import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/login/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { loginApi, ApiUnavailableError } from '@/utils/auth-api';
import { setServiceJWT } from '@/federation/token-exchange';

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile/me', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (email: string, password: string, _remember: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginApi(email, password);
      setServiceJWT(result.accessToken);
      navigate('/profile/me', { replace: true });
    } catch (err) {
      if (err instanceof ApiUnavailableError) {
        setError('serviceUnavailable');
      } else {
        setError('login_failed');
      }
      setIsLoading(false);
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
    </div>
  );
}
