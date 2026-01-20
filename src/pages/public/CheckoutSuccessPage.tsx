import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PublicPageShell from '../../components/layout/PublicPageShell';

type ReceiptInfo = {
  amount?: number;
  currency?: string;
  receiptUrl?: string;
};

const CheckoutSuccessPage: React.FC = () => {
  const location = useLocation();
  const [receipt, setReceipt] = useState<ReceiptInfo | null>(null);
  const [status, setStatus] = useState<'open'|'complete'|'expired'|undefined>();
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const sessionId = params.get('session_id') || '';

  const pending = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('pending_donation');
      return raw ? JSON.parse(raw) as { amount?: number; currency?: string; project?: string; type?: string } : null;
    } catch { return null; }
  }, []);

  useEffect(() => {
    const base = (import.meta as any).env?.VITE_API_URL as string | undefined;
    if (!base || !sessionId) return; // No backend or session; rely on fallback display
    // Fetch receipt details
    fetch(`${base}/api/donations/receipt?session_id=${encodeURIComponent(sessionId)}`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((data) => setReceipt(data))
      .catch((e) => setError(e.message));
    // Fetch status (optional)
    fetch(`${base}/api/donations/session-status?session_id=${encodeURIComponent(sessionId)}`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((data) => setStatus(data?.status))
      .catch(() => void 0);
  }, [sessionId]);

  const displayAmount = useMemo(() => {
    if (typeof receipt?.amount === 'number' && receipt.currency) {
      return `${(receipt.amount/100).toFixed(2)} ${receipt.currency.toUpperCase()}`;
    }
    if (pending?.amount && pending?.currency) {
      return `${pending.amount.toFixed(2)} ${pending.currency.toUpperCase()}`;
    }
    return null;
  }, [receipt, pending]);

  useEffect(() => {
    // Clear the pending cache on success
    try { sessionStorage.removeItem('pending_donation'); } catch {}
  }, []);

  return (
    <PublicPageShell>
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <h1 className="text-[28px] leading-[34px] font-bold text-primary">Thank you for your support!</h1>
        <p className="text-secondary">Your payment was processed. We truly appreciate your contribution.</p>
        {status && (
          <div className="text-xs text-secondary">Status: {status}</div>
        )}
        {displayAmount && (
          <div className="mx-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border border-base bg-white text-primary">
            <span>Amount:</span>
            <strong>{displayAmount}</strong>
          </div>
        )}
        {receipt?.receiptUrl && (
          <div className="mt-2 text-sm">
            <a href={receipt.receiptUrl} target="_blank" rel="noreferrer" className="text-primary underline">View Stripe receipt</a>
          </div>
        )}
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        <div className="mt-6">
          <Link to="/" className="inline-block px-4 py-2 rounded-full border border-primary text-primary hover:bg-[var(--color-primary-light)]">Back to home</Link>
        </div>
      </div>
    </PublicPageShell>
  );
};

export default CheckoutSuccessPage;
