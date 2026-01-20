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

const Signup: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDev, setShowDev] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  function handleUnderDevelopment(e?: React.MouseEvent) {
    if (e) e.preventDefault();
    setShowDev(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // For now, since signup API might not be implemented, we simulate signup and then login
      // In production, this would call a signup API first
      
      // Simulate signup delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After successful signup, log the user in
      await login(formData.email, formData.password);
      
      // Navigate to appropriate page
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
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
          <p className="mt-2 text-text-secondary">Create your account</p>
          <div className="mt-4 flex justify-center">
            <LanguageSelector />
          </div>
        </div>
        
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">{t('auth.signup', 'Sign Up')}</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                placeholder="Enter your full name"
                required
              />
              
              <Input
                label={t('auth.email')}
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder={t('auth.enterEmail')}
                required
              />
              
              <PasswordInput
                label={t('auth.password')}
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="Create a password (min. 6 characters)"
                required
              />
              
              <PasswordInput
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                placeholder="Confirm your password"
                required
              />
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary border-border rounded mt-1"
                  required
                />
                <label className="ml-2 text-sm text-text-secondary">
                  I agree to the{' '}
                  <a
                    href="#terms"
                    onClick={handleUnderDevelopment}
                    className="text-primary hover:text-primary-dark"
                  >
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a
                    href="#privacy"
                    onClick={handleUnderDevelopment}
                    className="text-primary hover:text-primary-dark"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              <Button 
                type="submit" 
                loading={loading}
                className="w-full"
              >
                {t('auth.createAccount', 'Create Account')}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/auth/login')}
                className="text-primary hover:text-primary-dark font-medium"
              >
                {t('auth.signin', 'Sign In')}
              </button>
            </div>
            
            {showDev && (
              <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowDev(false)} />
                <div className="relative z-10 w-full max-w-sm rounded-xl border border-base bg-white p-6 text-center shadow-xl">
                  <h3 className="text-[16px] font-semibold text-primary mb-2">Notice</h3>
                  <p className="text-[13px] text-secondary mb-4">This feature is under development.</p>
                  <button 
                    autoFocus 
                    onClick={() => setShowDev(false)} 
                    className="px-4 h-9 rounded-full border border-base bg-[var(--color-primary-light)] text-[13px]"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;