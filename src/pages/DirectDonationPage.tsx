import React, { useEffect, useState } from 'react';
import { createCheckoutSession } from '../services/checkoutSession';
import JessicaNav from '../components/jessica/JessicaNav';
import JessicaFooter from '../components/jessica/JessicaFooter';

const DirectDonationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initiateDonation = async () => {
      try {
        // Données par défaut pour Jessica - $25 donation
        const donationParams = {
          amountCents: 2500, // $25
          currency: 'usd',
          donationType: 'one-time' as const,
          projectId: 'jessica-dignity-project',
          donor: {
            firstName: 'Supporter',
            lastName: 'Anonymous',
            email: 'supporter@jessicaproject.org',
            anonymous: true
          }
        };

        // Utiliser URL de test si disponible
        const testUrl = import.meta.env.VITE_STRIPE_CHECKOUT_TEST_URL as string | undefined;
        
        if (testUrl) {
          window.location.href = testUrl;
          return;
        }

        // Sinon utiliser l'API
        const session = await createCheckoutSession(donationParams);

        if (session.error) {
          throw new Error(session.error);
        }

        if (!session.url) {
          throw new Error('No checkout URL provided');
        }

        // Redirection immédiate vers Stripe
        window.location.href = session.url;

      } catch (err: any) {
        console.error('Donation redirect error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initiateDonation();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefdfb]">
        <JessicaNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#f4a6a9] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-2xl font-semibold text-[#5a4a47]">Redirecting to Secure Payment...</h2>
            <p className="text-[#7a6a67]">You'll be redirected to Stripe to complete your donation.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefdfb]">
      <JessicaNav />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-[#5a4a47]">Payment Setup Error</h2>
          <p className="text-[#7a6a67]">{error}</p>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="block w-full px-6 py-3 bg-[#f4a6a9] text-white rounded-full hover:bg-[#e89396] transition-colors"
            >
              Try Again
            </button>
            <a
              href="/"
              className="block w-full px-6 py-3 border border-[#f4a6a9] text-[#f4a6a9] rounded-full hover:bg-[#f4a6a9] hover:text-white transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
      <JessicaFooter />
    </div>
  );
};

export default DirectDonationPage;