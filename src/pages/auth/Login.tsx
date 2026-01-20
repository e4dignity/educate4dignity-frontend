import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Card, CardContent } from '../../components/ui/Card';
import { LanguageSelector } from '../../components/ui/LanguageSelector';
import { useAuth } from '../../hooks/authContext';
import Logo from '../../components/ui/Logo';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showDev, setShowDev] = useState(false);

  function handleUnderDevelopment(e?: React.MouseEvent) {
    if (e) e.preventDefault();
    setShowDev(true);
  }
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const authenticatedUser = await login(email, password);
      
      // Navigate based on authenticated user role, not email heuristic
      if (authenticatedUser?.role === 'admin') {
        navigate('/admin');
      } else if (authenticatedUser?.role === 'supplier') {
        navigate('/partner/suppliers');
      } else if (authenticatedUser?.role === 'distributor') {
        navigate('/partner/distributors');
      } else if (authenticatedUser?.role === 'trainer') {
        navigate('/partner/trainers');
      } else if (authenticatedUser?.role === 'team_member') {
        navigate('/team');
      } else if (authenticatedUser?.role === 'donor') {
        navigate('/donor');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Logo size="lg" className="flex items-center" withText={false} />
          </div>
          <p className="mt-2 text-text-secondary">{t('auth.signin')} to your account</p>
          <div className="mt-4 flex justify-center">
            <LanguageSelector />
          </div>
        </div>
        
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">{t('auth.login')}</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('auth.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.enterEmail')}
                required
              />
              
              <PasswordInput
                label={t('auth.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.enterPassword')}
                required
              />
              
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary border-border rounded"
                  />
                  <span className="ml-2 text-text-secondary">{t('auth.rememberMe')}</span>
                </label>
                
                <a
                  href="#forgot-password"
                  onClick={handleUnderDevelopment}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  {t('auth.forgotPassword')}
                </a>
              </div>
              
              <Button 
                type="submit" 
                loading={loading}
                className="w-full"
              >
                {t('auth.signin')}
              </Button>
            </form>
            
            {/* Development helper */}
            {import.meta.env?.DEV && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-700 font-medium mb-2">Development Credentials:</p>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@e4d.test');
                    setPassword('admin123');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Fill Admin Credentials
                </button>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-text-secondary">
              {t('auth.noAccount')}{' '}
              <button
                onClick={() => navigate('/auth/signup')}
                className="text-primary hover:text-primary-dark font-medium"
              >
                {t('auth.signup')}
              </button>
            </div>
            {showDev && (
              <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50" onClick={()=> setShowDev(false)} />
                <div className="relative z-10 w-full max-w-sm rounded-xl border border-base bg-white p-6 text-center shadow-xl">
                  <h3 className="text-[16px] font-semibold text-primary mb-2">Notice</h3>
                  <p className="text-[13px] text-secondary mb-4">It is under development.</p>
                  <button autoFocus onClick={()=> setShowDev(false)} className="px-4 h-9 rounded-full border border-base bg-[var(--color-primary-light)] text-[13px]">Close</button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
