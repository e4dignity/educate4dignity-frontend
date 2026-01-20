import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/authContext';

const TestPage: React.FC = () => {
  const { login } = useAuth();
  const handleAdminLogin = async () => {
    // Real login through AuthProvider (role derived from email prefix)
    await login('admin@local', 'dev');
    window.location.href = '/admin/blog';
  };

  const clearAuth = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Quick Admin Access</h3>
            <p className="text-sm text-text-secondary">This button logs you in as admin (dev) using the real auth context.</p>
          </div>

          <div className="space-y-2">
            <Button onClick={handleAdminLogin} className="w-full">
              Login as Admin
            </Button>
            <Button onClick={clearAuth} variant="outline" className="w-full">
              Clear Auth & Return Home
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="font-medium mb-2">Quick Links:</h3>
            <div className="space-y-1">
              <a href="/" className="block text-sm text-primary hover:underline">Home</a>
              <a href="/projects" className="block text-sm text-primary hover:underline">Projects</a>
              <a href="/login" className="block text-sm text-primary hover:underline">Login</a>
              <a href="/admin" className="block text-sm text-primary hover:underline">Admin Dashboard</a>
              <a href="/admin/blog" className="block text-sm text-primary hover:underline">Admin Blog</a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPage;
