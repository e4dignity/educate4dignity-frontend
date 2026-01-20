import React, { useState } from 'react';
import { createCheckoutSession } from '../services/checkoutSession';

interface SimpleDonationButtonProps {
  amount?: number; // Montant en USD par défaut
  className?: string;
  children?: React.ReactNode;
}

const SimpleDonationButton: React.FC<SimpleDonationButtonProps> = ({ 
  amount = 25, // 25$ par défaut selon les requirements
  className = "",
  children = "Support My Work"
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDirectDonate = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      // Données par défaut basées sur les requirements de Jessica
      const donationParams = {
        amountCents: amount * 100, // Convertir en cents
        currency: 'usd',
        donationType: 'one-time' as const,
        projectId: 'jessica-dignity-project', // ID project par défaut
        donor: {
          firstName: 'Anonymous',
          lastName: 'Donor',
          email: 'donor@example.com',
          anonymous: true
        }
      };

      // Utiliser directement l'URL de test si disponible
      const testUrl = import.meta.env.VITE_STRIPE_CHECKOUT_TEST_URL as string | undefined;
      
      if (testUrl) {
        // Redirection directe vers l'URL de test Stripe
        window.location.href = testUrl;
        return;
      }

      // Sinon, utiliser l'API backend
      const session = await createCheckoutSession(donationParams);

      if (session.error) {
        throw new Error(session.error);
      }

      let checkoutUrl = session.url;
      
      if (!checkoutUrl) {
        throw new Error('Checkout URL not provided by backend');
      }

      // Redirection vers Stripe Checkout
      window.location.href = checkoutUrl;

    } catch (err: any) {
      console.error('Donation error:', err);
      setError(err.message || 'Une erreur est survenue lors du traitement de votre donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleDirectDonate}
        disabled={loading}
        className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Redirection...' : children}
      </button>
      
      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm max-w-xs z-10">
          {error}
        </div>
      )}
    </div>
  );
};

export default SimpleDonationButton;