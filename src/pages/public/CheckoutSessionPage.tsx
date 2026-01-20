import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PublicPageShell from '../../components/layout/PublicPageShell';

// Simple page that immediately redirects to a provided Checkout URL.
// Accepts: /checkout-session?url=<encoded_checkout_url>
// Shows a tiny loader and a fallback link if automatic redirect is blocked.
const CheckoutSessionPage: React.FC = () => {
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const checkoutUrl = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const urlParam = params.get('url');
    if (urlParam) return decodeURIComponent(urlParam);
    // Fallback: allow using sessionStorage (if DonationPage saved it there)
    const stored = sessionStorage.getItem('checkout_url');
    return stored || '';
  }, [location.search]);

  useEffect(() => {
    if (!checkoutUrl) {
      setError('No Checkout URL provided.');
      return;
    }
    try {
      // Use replace so the intermediate route isn't kept in history.
      window.location.replace(checkoutUrl);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to redirect');
    }
  }, [checkoutUrl]);

  return (
    <PublicPageShell>
      <div className="max-w-xl mx-auto py-12 text-center">
        <h1 className="text-[24px] leading-[32px] font-bold text-primary mb-3">Preparing secure checkout…</h1>
        {!error ? (
          <p className="text-secondary">You’ll be redirected to Stripe in a moment. If not, use the button below.</p>
        ) : (
          <p className="text-red-600">{error}</p>
        )}
        {checkoutUrl && (
          <div className="mt-6">
            <a href={checkoutUrl} className="inline-block px-4 py-2 rounded-full border border-primary text-primary hover:bg-[var(--color-primary-light)]">
              Continue to Stripe Checkout
            </a>
          </div>
        )}
        <div className="mt-8 text-sm">
          <Link to="/donate" className="text-primary underline">Back to donations</Link>
        </div>
      </div>
    </PublicPageShell>
  );
};

export default CheckoutSessionPage;
